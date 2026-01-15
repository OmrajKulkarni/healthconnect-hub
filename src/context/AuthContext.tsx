/**
 * Authentication Context
 * Manages user authentication state across the application
 * Uses localStorage for persistence (simple approach for beginners)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Patient } from '@/types';

// Context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => boolean;
  register: (name: string, email: string, password: string, location: string, role: UserRole) => boolean;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => false,
  register: () => false,
  logout: () => {},
});

// Storage keys
const USERS_KEY = 'healthcare_users';
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
   * Get all registered users from localStorage
   */
  const getUsers = (): (Patient & { password: string; role: UserRole })[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  };

  /**
   * Save users to localStorage
   */
  const saveUsers = (users: (Patient & { password: string; role: UserRole })[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  /**
   * Login function
   * Validates credentials and sets the current user
   */
  const login = (email: string, password: string, role: UserRole): boolean => {
    const users = getUsers();
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && 
           u.password === password && 
           u.role === role
    );

    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  /**
   * Register function
   * Creates a new user account
   */
  const register = (
    name: string, 
    email: string, 
    password: string, 
    location: string, 
    role: UserRole
  ): boolean => {
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      location,
      role,
    };

    // Save to storage
    saveUsers([...users, newUser]);

    // Auto-login after registration
    const userData: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));

    return true;
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
