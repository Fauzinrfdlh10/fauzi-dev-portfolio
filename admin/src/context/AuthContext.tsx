import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';

interface Admin {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  admin: Admin | null;
  loading: boolean;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  admin: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setAdmin(res.data);
        } catch (error) {
          console.error('Failed to authenticate token');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (token: string, adminData: Admin) => {
    localStorage.setItem('token', token);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
