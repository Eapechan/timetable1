export interface Period {
  id: string;
  name: string;
  teacher: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'break';
  color?: string;
}

export interface DaySchedule {
  day: string;
  periods: Period[];
}

export interface TimetableData {
  schedule: DaySchedule[];
}

export interface AppSettings {
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark';
  notifications: boolean;
}