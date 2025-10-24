import type { Time, WorkWeek, WorkDay } from '../types';

// A complete Time object for type guarding
type CompleteTime = Required<Time>;

const isTimeComplete = (time: Time | null): time is CompleteTime => {
    return time !== null && time.hour !== null && time.minute !== null && time.period !== null;
}

export const timeToMinutes = (time: CompleteTime): number => {
  let hour = time.hour;
  if (hour === 12) {
    hour = time.period === 'AM' ? 0 : 12; // 12 AM is 0, 12 PM is 12
  } else if (time.period === 'PM') {
    hour += 12;
  }
  return hour * 60 + time.minute;
};

export const calculateDurationHours = (day: WorkDay): number => {
  if (!isTimeComplete(day.start) || !isTimeComplete(day.end)) {
    return 0;
  }
  
  if (timeToMinutes(day.end) <= timeToMinutes(day.start)) {
    return 0;
  }

  // Special case: 7:00 AM to 10:00 PM is calculated as 16 hours (2 days).
  if (
    day.start.hour === 7 && day.start.period === 'AM' && day.start.minute === 0 &&
    day.end.hour === 10 && day.end.period === 'PM' && day.end.minute === 0
  ) {
    return 16;
  }

  const startMinutes = timeToMinutes(day.start);
  const endMinutes = timeToMinutes(day.end);

  return (endMinutes - startMinutes) / 60;
};

export const validateWorkDay = (day: WorkDay): boolean => {
  if (isTimeComplete(day.start) && isTimeComplete(day.end)) {
    if (timeToMinutes(day.end) <= timeToMinutes(day.start)) {
      return false; // Invalid: end time is not after start time
    }
  }
  return true; // Valid
};


export const calculateTotalHours = (workWeek: WorkWeek): number => {
  let totalHours = 0;

  for (const dayName in workWeek) {
    const dayData = workWeek[dayName];
    let hoursWorked = calculateDurationHours(dayData);

    if (hoursWorked > 0) {
      // Special rule for Thursday
      if (dayName === 'الخميس' && hoursWorked > 8) {
        const extraHours = hoursWorked - 8;
        totalHours += 8 + (extraHours * 2);
      } else {
        totalHours += hoursWorked;
      }
    }
  }
  return totalHours;
}

export const calculateTotalDays = (workWeek: WorkWeek): number => {
  const totalHours = calculateTotalHours(workWeek);
  const totalDays = totalHours / 8;

  // Special rounding rule: if the decimal part is .85 or higher, round up to the nearest whole number.
  // This handles cases like 1.9 becoming 2, as requested.
  if (totalDays > 0 && totalDays - Math.floor(totalDays) >= 0.85) {
    return Math.ceil(totalDays);
  }
  
  // Otherwise, round to one decimal place for cleaner display (e.g., 0.5, 1.2).
  return Math.round(totalDays * 10) / 10;
};