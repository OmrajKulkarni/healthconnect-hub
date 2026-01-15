/**
 * Appointment Context
 * Manages appointment data across the application
 * Uses localStorage for persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appointment } from '@/types';

// Context type definition
interface AppointmentContextType {
  appointments: Appointment[];
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Appointment;
  getPatientAppointments: (patientId: string) => Appointment[];
  cancelAppointment: (appointmentId: string) => void;
}

// Create context
const AppointmentContext = createContext<AppointmentContextType | null>(null);

// Storage key
const APPOINTMENTS_KEY = 'healthcare_appointments';

// Props for provider
interface AppointmentProviderProps {
  children: ReactNode;
}

/**
 * AppointmentProvider Component
 * Manages appointment state and provides it to children
 */
export function AppointmentProvider({ children }: AppointmentProviderProps) {
  // State for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load appointments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(APPOINTMENTS_KEY);
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  // Save appointments to localStorage when they change
  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  }, [appointments]);

  /**
   * Book a new appointment
   * Returns the created appointment
   */
  const bookAppointment = (
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'status'>
  ): Appointment => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  };

  /**
   * Get all appointments for a specific patient
   */
  const getPatientAppointments = (patientId: string): Appointment[] => {
    return appointments.filter(apt => apt.patientId === patientId);
  };

  /**
   * Cancel an appointment
   */
  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: 'cancelled' as const }
          : apt
      )
    );
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        bookAppointment,
        getPatientAppointments,
        cancelAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

/**
 * Custom hook to use appointment context
 */
export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
}
