import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, DoctorSession } from '../types';
import { MockApi } from '../services/mockDb';

interface AppContextType {
  user: User;
  setUser: (user: User) => void;
  sessions: DoctorSession[];
  isLoadingSessions: boolean;
  refreshSessions: () => Promise<void>;
}

const defaultUser: User = {
  id: 'patient_guest',
  name: 'Guest Patient',
  role: 'USER',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [sessions, setSessions] = useState<DoctorSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  const refreshSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const data = await MockApi.getSessions();
      // Sort by date nearest first
      const sorted = data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      setSessions(sorted);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  useEffect(() => {
    refreshSessions();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, sessions, isLoadingSessions, refreshSessions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};