
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { EMPLOYEES, ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';
import { supabase } from '../services/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const authUser = session.user;
        // Map email to username (remove @example.com)
        const email = authUser.email || '';
        const username = email.endsWith('@example.com') ? email.replace('@example.com', '') : (email === 'aboahmad@example.com' ? ADMIN_USERNAME : '');
        const employee = EMPLOYEES.find(e => e.username === username);
        if (username === ADMIN_USERNAME || employee) {
          const userData: User = {
            username,
            nameAr: username === ADMIN_USERNAME ? 'المسؤول' : (employee?.nameAr || ''),
            role: username === ADMIN_USERNAME ? 'admin' : 'employee'
          };
          setUser(userData);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const authUser = session.user;
        const email = authUser.email || '';
        const username = email.endsWith('@example.com') ? email.replace('@example.com', '') : (email === 'aboahmad@example.com' ? ADMIN_USERNAME : '');
        const employee = EMPLOYEES.find(e => e.username === username);
        if (username === ADMIN_USERNAME || employee) {
          const userData: User = {
            username,
            nameAr: username === ADMIN_USERNAME ? 'المسؤول' : (employee?.nameAr || ''),
            role: username === ADMIN_USERNAME ? 'admin' : 'employee'
          };
          setUser(userData);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    console.log('Login function called with username:', username, 'password:', password);
    try {
      setError(null);
      // Map username to email, handle if username is already an email
      const email = username.includes('@') ? username : (username === ADMIN_USERNAME ? 'aboahmad@example.com' : `${username}@example.com`);
      console.log('Mapped to email:', email);
      console.log('Calling supabase.auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Supabase response received:', { data, error });

      if (error) {
        console.log('Login error:', error.message);
        setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
        return false;
      }

      // Manually set user after successful login
      const authUser = data.user;
      const userEmail = authUser.email || '';
      const mappedUsername = userEmail.endsWith('@example.com') ? userEmail.replace('@example.com', '') : (userEmail === 'aboahmad@example.com' ? ADMIN_USERNAME : '');
      const employee = EMPLOYEES.find(e => e.username === mappedUsername);
      if (mappedUsername === ADMIN_USERNAME || employee) {
        const userData: User = {
          username: mappedUsername,
          nameAr: mappedUsername === ADMIN_USERNAME ? 'المسؤول' : (employee?.nameAr || ''),
          role: mappedUsername === ADMIN_USERNAME ? 'admin' : 'employee'
        };
        setUser(userData);
      }

      return true;
    } catch (error) {
      console.log('Login exception:', error.message);
      setError('حدث خطأ في تسجيل الدخول.');
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return { user, login, logout, loading, error };
};
