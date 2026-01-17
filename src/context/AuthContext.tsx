/**
 * Authentication Context
 * Manages user authentication state across the application
 * Uses Supabase for persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, location: string, role: UserRole, specialization?: string) => Promise<boolean>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// Storage key for current user session
const CURRENT_USER_KEY = 'healthcare_current_user';

// Props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Wraps the application and provides authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // State for current user
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /**
   * Login function
   * Validates credentials against the database
   */
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simple password hash for demo (in production, use proper hashing on backend)
      const passwordHash = btoa(password);

      if (role === 'doctor') {
        const { data, error } = await supabase
          .from('doctors')
          .select('id, name, email')
          .eq('email', email.toLowerCase())
          .eq('password_hash', passwordHash)
          .single();

        if (error || !data) return false;

        const userData: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: 'doctor',
        };
        setUser(userData);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        return true;
      } else {
        const { data, error } = await supabase
          .from('patients')
          .select('id, name, email')
          .eq('email', email.toLowerCase())
          .eq('password_hash', passwordHash)
          .single();

        if (error || !data) return false;

        const userData: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: 'patient',
        };
        setUser(userData);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  /**
   * Register function
   * Creates a new user account in the database
   */
  const register = async (
    name: string,
    email: string,
    password: string,
    location: string,
    role: UserRole,
    specialization?: string
  ): Promise<boolean> => {
    try {
      // Simple password hash for demo (in production, use proper hashing on backend)
      const passwordHash = btoa(password);

      if (role === 'doctor') {
        // Check if email already exists
        const { data: existing } = await supabase
          .from('doctors')
          .select('id')
          .eq('email', email.toLowerCase())
          .single();

        if (existing) return false;

        // Insert new doctor
        const { data, error } = await supabase
          .from('doctors')
          .insert({
            name,
            email: email.toLowerCase(),
            password_hash: passwordHash,
            location,
            specialization: specialization || 'General Practice',
          })
          .select('id, name, email')
          .single();

        if (error || !data) {
          console.error('Doctor registration error:', error);
          return false;
        }

        // Auto-login after registration
        const userData: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: 'doctor',
        };
        setUser(userData);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        return true;
      } else {
        // Check if email already exists
        const { data: existing } = await supabase
          .from('patients')
          .select('id')
          .eq('email', email.toLowerCase())
          .single();

        if (existing) return false;

        // Insert new patient
        const { data, error } = await supabase
          .from('patients')
          .insert({
            name,
            email: email.toLowerCase(),
            password_hash: passwordHash,
            location,
          })
          .select('id, name, email')
          .single();

        if (error || !data) {
          console.error('Patient registration error:', error);
          return false;
        }

        // Auto-login after registration
        const userData: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: 'patient',
        };
        setUser(userData);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
        return true;
      }
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    }
  };

  /**
   * Logout function
   * Clears the current user
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use auth context
 * Throws error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
