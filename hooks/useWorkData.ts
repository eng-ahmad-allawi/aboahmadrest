
import { useCallback } from 'react';
import type { WorkWeek } from '../types';
import { EMPLOYEES } from '../constants';

const getWeekId = (): string => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday = 0, Saturday = 6
  const diff = now.getDate() - dayOfWeek - 1; // Adjust to get to the last Saturday
  const lastSaturday = new Date(now.setDate(diff));
  return `${lastSaturday.getFullYear()}-${lastSaturday.getMonth() + 1}-${lastSaturday.getDate()}`;
};

const getStorageKey = (): string => `abuAhmadWorkData_${getWeekId()}`;

export const useWorkData = () => {
  
  const loadWorkData = useCallback((username: string): WorkWeek | null => {
    try {
      const key = getStorageKey();
      const allData = localStorage.getItem(key);
      if (allData) {
        const parsedData = JSON.parse(allData);
        return parsedData[username] || null;
      }
      return null;
    } catch (error) {
      console.error("Failed to load work data", error);
      return null;
    }
  }, []);
  
  const saveWorkData = useCallback((username: string, data: WorkWeek) => {
    try {
      const key = getStorageKey();
      const allDataStr = localStorage.getItem(key) || '{}';
      const allData = JSON.parse(allDataStr);
      allData[username] = data;
      localStorage.setItem(key, JSON.stringify(allData));
    } catch (error) {
      console.error("Failed to save work data", error);
    }
  }, []);
  
  const loadAllWorkData = useCallback((): { [username: string]: WorkWeek } => {
    try {
      const key = getStorageKey();
      const allData = localStorage.getItem(key);
      return allData ? JSON.parse(allData) : {};
    } catch (error) {
      console.error("Failed to load all work data", error);
      return {};
    }
  }, []);

  const clearAllWorkData = useCallback(() => {
    try {
      const key = getStorageKey();
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to clear work data", error);
    }
  }, []);

  return { loadWorkData, saveWorkData, loadAllWorkData, clearAllWorkData };
};
