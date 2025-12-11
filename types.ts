export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  SELECTED = 'SELECTED',
  BOOKED = 'BOOKED',
}

export interface DoctorSession {
  id: string;
  doctorName: string;
  specialty: string;
  startTime: string; // ISO string
  maxPatients: number; // Queue capacity
  consultationFee: number;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  sessionId: string;
  userId: string;
  tokenIds: string[]; // Represents Queue Numbers e.g., "1", "2"
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export type CreateSessionDto = Omit<DoctorSession, 'id' | 'bookings'>;
