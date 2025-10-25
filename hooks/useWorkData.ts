
import { useCallback, useEffect, useState } from 'react';
import type { WorkWeek } from '../types';
import { supabase } from '../services/supabaseClient';

const getWeekId = (): string => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday = 0, Saturday = 6
  const diff = now.getDate() - dayOfWeek - 1; // Adjust to get to the last Saturday
  const lastSaturday = new Date(now.setDate(diff));
  return `${lastSaturday.getFullYear()}-${lastSaturday.getMonth() + 1}-${lastSaturday.getDate()}`;
};

export const useWorkData = () => {
  const [allData, setAllData] = useState<{ [username: string]: WorkWeek }>({});

  const weekId = getWeekId();

  useEffect(() => {
    // Load initial data
    loadAllWorkDataInternal();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('work_data_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'work_data',
          filter: `week_id=eq.${weekId}`,
        },
        () => {
          loadAllWorkDataInternal();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [weekId]);

  const loadAllWorkDataInternal = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('work_data')
        .select('*')
        .eq('week_id', weekId);

      if (error) {
        console.error('Failed to load all work data', error);
        return;
      }

      const formattedData: { [username: string]: WorkWeek } = {};
      data?.forEach((item) => {
        formattedData[item.username] = item.work_week;
      });
      setAllData(formattedData);
    } catch (error) {
      console.error('Failed to load all work data', error);
    }
  }, [weekId]);

  const loadWorkData = useCallback((username: string): WorkWeek | null => {
    return allData[username] || null;
  }, [allData]);

  const saveWorkData = useCallback(async (username: string, data: WorkWeek) => {
    try {
      console.log('Saving work data for user:', username, 'data:', data);
      // First try to update existing record
      const { data: existingData, error: selectError } = await supabase
        .from('work_data')
        .select('*')
        .eq('username', username)
        .eq('week_id', weekId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Failed to check existing data', selectError);
        return;
      }

      let error;
      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('work_data')
          .update({
            work_week: data,
            updated_at: new Date().toISOString(),
          })
          .eq('username', username)
          .eq('week_id', weekId);
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('work_data')
          .insert({
            username,
            week_id: weekId,
            work_week: data,
            updated_at: new Date().toISOString(),
          });
        error = insertError;
      }

      if (error) {
        console.error('Failed to save work data', error);
      } else {
        console.log('Work data saved successfully');
        // Reload data after save
        loadAllWorkDataInternal();
      }
    } catch (error) {
      console.error('Failed to save work data', error);
    }
  }, [weekId, loadAllWorkDataInternal]);

  const loadAllWorkData = useCallback((): { [username: string]: WorkWeek } => {
    return allData;
  }, [allData]);

  const clearAllWorkData = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('work_data')
        .delete()
        .eq('week_id', weekId);

      if (error) {
        console.error('Failed to clear work data', error);
      }
    } catch (error) {
      console.error('Failed to clear work data', error);
    }
  }, [weekId]);

  return { loadWorkData, saveWorkData, loadAllWorkData, clearAllWorkData };
};
