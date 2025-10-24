import React from 'react';
import type { Time } from '../types';

interface TimeInputProps {
  value: Time | null;
  onChange?: (newTime: Time | null) => void;
  isReadOnly: boolean;
  showEmptyInputs?: boolean;
  hasError?: boolean;
}

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = [0, 15, 30, 45];

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange, isReadOnly, hasError }) => {
  const handleChange = (part: keyof Time, newValue: string) => {
    if (!onChange) return;

    // Create a new Time object based on the current state or with nulls
    const newTime: Time = {
      hour: value?.hour ?? null,
      minute: value?.minute ?? null,
      period: value?.period ?? null,
    };

    // Update the part that was changed
    if (part === 'period') {
        newTime[part] = newValue as 'AM' | 'PM';
    } else {
        const numericValue = parseInt(newValue, 10);
        newTime[part] = numericValue;
    }

    onChange(newTime);
  };


  if (isReadOnly) {
    return (
      <div className="flex justify-center items-center h-10">
        {value && value.hour && value.period ? (
          <span className="text-lg font-semibold text-gray-800">{`${value.hour}:${String(value.minute ?? '00').padStart(2, '0')} ${value.period === 'AM' ? 'صباحًا' : 'مساءً'}`}</span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </div>
    );
  }
  
  const selectBaseClasses = "p-2 border rounded-md bg-gray-50 focus:ring-orange-500 focus:border-orange-500 text-black transition-colors";
  const errorClasses = "border-red-500 ring-1 ring-red-500";
  const normalClasses = "border-gray-300";

  // This component will now always render the inputs for employees
  return (
    <div className="flex items-center justify-center gap-1">
      <select
        value={value?.hour ?? ''}
        onChange={(e) => handleChange('hour', e.target.value)}
        className={`w-16 ${selectBaseClasses} ${hasError ? errorClasses : normalClasses}`}
        aria-invalid={hasError ? "true" : "false"}
      >
        <option value="" disabled>--</option>
        {hours.map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="font-bold">:</span>
      <select
        value={value?.minute ?? ''}
        onChange={(e) => handleChange('minute', e.target.value)}
        className={`w-16 ${selectBaseClasses} ${hasError ? errorClasses : normalClasses}`}
        aria-invalid={hasError ? "true" : "false"}
      >
        <option value="" disabled>--</option>
        {minutes.map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
      </select>
      <select
        value={value?.period ?? ''}
        onChange={(e) => handleChange('period', e.target.value)}
        className={`w-20 ${selectBaseClasses} ${hasError ? errorClasses : normalClasses}`}
        aria-invalid={hasError ? "true" : "false"}
      >
        <option value="" disabled>--</option>
        <option value="AM">صباحًا</option>
        <option value="PM">مساءً</option>
      </select>
    </div>
  );
};

export default TimeInput;