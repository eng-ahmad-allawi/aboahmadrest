import React, { useState, useEffect, useCallback } from 'react';
import type { User, WorkWeek, Time } from '../types';
import { useWorkData } from '../hooks/useWorkData';
import { calculateTotalDays, calculateTotalHours, validateWorkDay } from '../services/timeService';
import { DAYS_OF_WEEK } from '../constants';
import TimesheetView from './TimesheetView';

interface EmployeeDashboardProps {
  user: User;
}

const getDefaultWorkWeek = (): WorkWeek => {
  const week: WorkWeek = {};
  DAYS_OF_WEEK.forEach((day) => {
    const isFriday = day === 'الجمعة';
    
    // Default end time has an empty hour, but pre-filled minute and period.
    const defaultEndTime: Time = {
      hour: null,
      minute: (isFriday ? 30 : 0),
      period: 'PM',
    };
    
    // Default start time has an empty hour and period, but pre-filled minutes.
    const defaultStartTime: Time = {
      hour: null,
      minute: 0,
      period: (isFriday ? 'AM' : null), // Set to 'AM' for Friday
    };

    week[day] = {
      start: defaultStartTime,
      end: defaultEndTime,
    };
  });
  return week;
};


const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user }) => {
  const { loadWorkData, saveWorkData, loadAllWorkData } = useWorkData();
  const [workWeek, setWorkWeek] = useState<WorkWeek>(getDefaultWorkWeek());
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [totalDays, setTotalDays] = useState(0);
  const [totalHours, setTotalHours] = useState(0);

  useEffect(() => {
    const data = loadWorkData(user.username);
    console.log('Loaded work data for user:', user.username, 'data:', data);
    if (data) {
      setWorkWeek(data);
      setTotalDays(calculateTotalDays(data));
      setTotalHours(calculateTotalHours(data));
    } else {
      // Reset to default if no data
      setWorkWeek(getDefaultWorkWeek());
      setTotalDays(0);
      setTotalHours(0);
    }
  }, [user.username, loadWorkData]);

  const handleDataChange = useCallback((newWorkWeek: WorkWeek) => {
    setWorkWeek(newWorkWeek);

    const newErrors: Record<string, boolean> = {};
    let hasAnyError = false;
    for (const day in newWorkWeek) {
      if (!validateWorkDay(newWorkWeek[day])) {
        newErrors[day] = true;
        hasAnyError = true;
      }
    }
    setErrors(newErrors);

    setTotalDays(calculateTotalDays(newWorkWeek));
    setTotalHours(calculateTotalHours(newWorkWeek));

    if (!hasAnyError) {
      saveWorkData(user.username, newWorkWeek).catch((error) => {
        console.error('Failed to save work data', error);
      });
    }
  }, [user.username, saveWorkData]);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">مرحباً، {user.nameAr}</h2>
        <p className="text-gray-600 mt-1">هنا يمكنك تسجيل ساعات العمل الخاصة بك لهذا الأسبوع.</p>
      </div>
      
      <TimesheetView
        workWeek={workWeek}
        onDataChange={handleDataChange}
        isReadOnly={false}
        errors={errors}
      />

      <div className="mt-6 p-6 bg-orange-100 border-r-4 border-orange-500 rounded-lg shadow-md space-y-2">
        <h3 className="text-xl font-bold text-orange-800">ملخص الدوام</h3>
        <p className="text-2xl font-bold text-orange-600">
          إجمالي الساعات المحسوبة: <span className="text-3xl">{totalHours.toFixed(1)}</span> ساعة
        </p>
        <p className="text-2xl font-bold text-orange-600">
          إجمالي الأيام: <span className="text-3xl">{totalDays}</span> يوم
        </p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;