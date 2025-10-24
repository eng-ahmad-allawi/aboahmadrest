
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { EMPLOYEES, ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';

const SESSION_KEY = 'abuAhmadSession';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_KEY);
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      }
    } catch (error) {
      console.error("Failed to parse session from localStorage", error);
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser: User = { username: ADMIN_USERNAME, nameAr: 'المسؤول', role: 'admin' };
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
      setUser(adminUser);
      return true;
    }

    const employee = EMPLOYEES.find(e => e.username === username && e.password === password);
    if (employee) {
      const employeeUser: User = { username: employee.username, nameAr: employee.nameAr, role: 'employee' };
      localStorage.setItem(SESSION_KEY, JSON.stringify(employeeUser));
      setUser(employeeUser);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return { user, login, logout };
};
