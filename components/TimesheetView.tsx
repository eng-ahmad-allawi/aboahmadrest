import React from 'react';
import type { WorkWeek, WorkDay } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import TimeInput from './TimeInput';

interface TimesheetViewProps {
  workWeek: WorkWeek;
  onDataChange?: (newWorkWeek: WorkWeek) => void;
  isReadOnly: boolean;
  errors?: Record<string, boolean>;
}

const TimesheetView: React.FC<TimesheetViewProps> = ({ workWeek, onDataChange, isReadOnly, errors = {} }) => {
  const handleTimeChange = (day: string, type: 'start' | 'end', newTime: WorkDay['start' | 'end']) => {
    if (onDataChange) {
      const updatedWeek = {
        ...workWeek,
        [day]: {
          ...workWeek[day],
          [type]: newTime,
        },
      };
      onDataChange(updatedWeek);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
      <table className="w-full text-center">
        <thead className="border-b-2 border-gray-200">
          <tr>
            <th className="py-3 px-2 text-lg font-bold text-gray-600">اليوم</th>
            <th className={`py-3 px-2 text-lg font-bold text-gray-600 ${!isReadOnly ? 'border-l-2 border-gray-200' : ''}`}>وقت البداية</th>
            <th className="py-3 px-2 text-lg font-bold text-gray-600">وقت النهاية</th>
          </tr>
        </thead>
        <tbody>
          {DAYS_OF_WEEK.map((day) => {
            const hasError = !!errors[day];
            return (
              <tr key={day} className={`border-b border-gray-100 last:border-b-0 transition-colors ${hasError && !isReadOnly ? 'bg-red-50' : ''}`}>
                <td className="py-4 px-2 font-bold text-gray-800">{day}</td>
                <td className={`py-4 px-2 ${!isReadOnly ? 'border-l-2 border-gray-200' : ''}`}>
                  <TimeInput
                    value={workWeek[day]?.start}
                    onChange={(newTime) => handleTimeChange(day, 'start', newTime)}
                    isReadOnly={isReadOnly}
                    showEmptyInputs={!workWeek[day]?.start && !isReadOnly}
                    hasError={hasError}
                  />
                </td>
                <td className="py-4 px-2 relative pb-6">
                  <TimeInput
                    value={workWeek[day]?.end}
                    onChange={(newTime) => handleTimeChange(day, 'end', newTime)}
                    isReadOnly={isReadOnly}
                    hasError={hasError}
                  />
                  {hasError && !isReadOnly && (
                    <p className="text-red-600 text-xs mt-1 font-semibold text-center absolute bottom-0 left-0 right-0">
                        وقت النهاية يجب أن يكون بعد وقت البداية
                    </p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetView;