/**
 * Type definitions for the Smart HealthCare Interface
 * These types define the structure of our data models
 */

// Doctor data structure (from CSV)
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  location: string;
  availableTimings: string[];
  image?: string;
}

// Patient data structure
export interface Patient {
  id: string;
  name: string;
  email: string;
  password: string;
  location: string;
}

// Appointment data structure
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

// Search filters
export interface SearchFilters {
  symptoms: string;
  location: string;
}

// User types for authentication
export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
