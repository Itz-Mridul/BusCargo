import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../lib/api';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('buscargo_token'));

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        console.error('Invalid token');
        logout();
      }
    }
  }, [token]);

  const login = async (email: string, password: string, rememberMe: boolean = false, adminKey: string = '', isAdminLogin: boolean = false) => {
    const res = await apiLogin(email, password, rememberMe, adminKey, isAdminLogin);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('buscargo_token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  // Register creates the account and auto-logs in (returns token directly from server)
  const register = async (data: { name: string; email: string; password: string; role?: string }) => {
    const res = await apiRegister(data);
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('buscargo_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('buscargo_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
