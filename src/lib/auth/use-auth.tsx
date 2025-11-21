'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '@/lib/types';
import { PlaceHolderImages } from '../placeholder-images';

const USERS_STORAGE_KEY = 'hopon-users';
const CURRENT_USER_STORAGE_KEY = 'hopon-current-user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password_raw: string) => boolean;
  signup: (name: string, email: string, password_raw: string) => User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Load users from local storage
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
      setUsers(allUsers);
      
      if (!storedUsers) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      }

      // Load current user from local storage
      const storedCurrentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (storedCurrentUser) {
        setUser(JSON.parse(storedCurrentUser));
      }
    } catch (error) {
      console.error("Failed to initialize auth from local storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string, password_raw: string): boolean => {
    const userToLogin = users.find(u => u.email === email && u.password === password_raw);
    if (userToLogin) {
      setUser(userToLogin);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(userToLogin));
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string, password_raw: string): User | null => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return null;
    }
    
    const avatar = PlaceHolderImages.find(p => p.id === 'user-avatar-3');

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password: password_raw,
      avatarUrl: avatar?.imageUrl ?? '/default-avatar.png',
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));
    
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  };

  const value = { user, loading, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
