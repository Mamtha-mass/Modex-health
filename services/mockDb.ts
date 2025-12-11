import { DoctorSession, Booking, CreateSessionDto } from '../types';

// Keys for LocalStorage
const SESSIONS_KEY = 'modex_health_sessions';
const BOOKINGS_KEY = 'modex_health_bookings';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initialize basic data if empty
const initializeDb = () => {
  if (!localStorage.getItem(SESSIONS_KEY)) {
    const initialSessions: DoctorSession[] = [
      {
        id: '1',
        doctorName: 'Dr. Sarah Bennett',
        specialty: 'Cardiologist',
        startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        maxPatients: 15,
        consultationFee: 150.00,
        bookings: []
      },
      {
        id: '2',
        doctorName: 'Dr. Emily Chen',
        specialty: 'Pediatrician',
        startTime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        maxPatients: 20,
        consultationFee: 80.00,
        bookings: []
      },
      {
        id: '3',
        doctorName: 'Dr. James Wilson',
        specialty: 'General Physician',
        startTime: new Date(Date.now() + 3600000 * 5).toISOString(), // 5 hours from now
        maxPatients: 30,
        consultationFee: 50.00,
        bookings: []
      }
    ];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(initialSessions));
  }
  if (!localStorage.getItem(BOOKINGS_KEY)) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
  }
};

initializeDb();

export const MockApi = {
  getSessions: async (): Promise<DoctorSession[]> => {
    await delay(500); // Simulate network latency
    const sessionsStr = localStorage.getItem(SESSIONS_KEY);
    const bookingsStr = localStorage.getItem(BOOKINGS_KEY);
    
    const sessions: DoctorSession[] = sessionsStr ? JSON.parse(sessionsStr) : [];
    const bookings: Booking[] = bookingsStr ? JSON.parse(bookingsStr) : [];

    // Hydrate sessions with their bookings
    return sessions.map(session => ({
      ...session,
      bookings: bookings.filter(b => b.sessionId === session.id && b.status === 'CONFIRMED')
    }));
  },

  getSessionById: async (id: string): Promise<DoctorSession | undefined> => {
    await delay(300);
    const sessions = await MockApi.getSessions();
    return sessions.find(s => s.id === id);
  },

  createSession: async (data: CreateSessionDto): Promise<DoctorSession> => {
    await delay(600);
    const sessionsStr = localStorage.getItem(SESSIONS_KEY);
    const sessions: DoctorSession[] = sessionsStr ? JSON.parse(sessionsStr) : [];
    
    const newSession: DoctorSession = {
      ...data,
      id: Date.now().toString(),
      bookings: []
    };
    
    sessions.push(newSession);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    return newSession;
  },

  // Simulates a transaction for booking a token in queue
  bookTokens: async (sessionId: string, tokenIds: string[], userId: string): Promise<{ success: boolean; booking?: Booking; error?: string }> => {
    await delay(800); // Simulate processing time

    // 1. Critical Section
    const bookingsStr = localStorage.getItem(BOOKINGS_KEY);
    const currentBookings: Booking[] = bookingsStr ? JSON.parse(bookingsStr) : [];
    
    // 2. Check for double booking (Race condition check)
    const isBooked = currentBookings.some(b => 
      b.sessionId === sessionId && 
      b.status === 'CONFIRMED' &&
      b.tokenIds.some(t => tokenIds.includes(t))
    );

    if (isBooked) {
      return { success: false, error: 'The selected queue token was just taken by another patient.' };
    }

    // 3. Create Booking
    const newBooking: Booking = {
      id: Date.now().toString(),
      sessionId,
      userId,
      tokenIds,
      status: 'CONFIRMED',
      timestamp: new Date().toISOString()
    };

    // 4. Commit Transaction
    currentBookings.push(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(currentBookings));

    return { success: true, booking: newBooking };
  }
};
