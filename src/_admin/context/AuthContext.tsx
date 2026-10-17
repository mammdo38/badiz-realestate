'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Admin } from '../types';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('badiz_token') : null;
    if (!storedToken) {
      setLoading(false);
      return;
    }
    
    if (!token) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setAdmin(res.data);
        })
        .catch(() => {
          localStorage.removeItem('badiz_token');
          setToken(null);
          setAdmin(null);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const login = (newToken: string, newAdmin: Admin) => {
    localStorage.setItem('badiz_token', newToken);
    setToken(newToken);
    setAdmin(newAdmin);
  };

  const logout = () => {
    localStorage.removeItem('badiz_token');
    setToken(null);
    setAdmin(null);
    window.location.href = '/admin/';
  };

  return (
    <AuthContext.Provider value={{
      admin, 
      token, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
