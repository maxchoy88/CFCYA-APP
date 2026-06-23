export interface Stats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent';
}

export interface Trainee {
  id: string;
  name: string;
  category: string;
  primaryPosition: string;
  secondaryPosition: string;
  team: string;
  parentName: string;
  phone: string;
  email: string;
  tin: string;
  stats: Stats;
  image: string;
  attendance: number; // percentage, e.g. 85
  attendanceHistory: (string | AttendanceRecord)[]; // support both string dates or record objects
  feeHistory: Record<string, boolean>; // e.g., { "2026-06": true }
  height?: string;
  weight?: string;
  coachComment?: string;
  totalSessions?: number;
  attendedSessions?: number;
}

export interface CoachAttendanceRecord {
  date: string;
  school: string;
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  rank: string;
  rate: number;
  phone: string;
  attendanceHistory: CoachAttendanceRecord[];
  paymentHistory: Record<string, { status: 'paid' | 'unpaid' }>;
}

export interface CloudConfig {
  key: string;
  binId: string;
}

export interface ImgConfig {
  cloudName: string;
  uploadPreset: string;
}
