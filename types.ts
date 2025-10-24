export interface User {
  username: string;
  nameAr: string;
  role: 'employee' | 'admin';
}

export interface Time {
  hour: number | null;
  minute: number | null;
  period: 'AM' | 'PM' | null;
}

export interface WorkDay {
  start: Time | null;
  end: Time | null;
}

export type WorkWeek = {
  [day: string]: WorkDay;
};