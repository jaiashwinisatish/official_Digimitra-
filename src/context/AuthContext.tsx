import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  studentClass?: string;
  role: string;
  languagePreference: string;
  token: string;
  enrolledCourses?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: check localStorage first, then try Supabase session
  useEffect(() => {
    const initAuth = async () => {
      // 1. Check localStorage for persisted user
      const stored = localStorage.getItem('userInfo');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } catch {
          localStorage.removeItem('userInfo');
        }
      }

      // 2. Check Supabase session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const supaUser: User = {
            _id: session.user.id,
            name: meta.name || meta.full_name || session.user.email?.split('@')[0] || 'Student',
            email: session.user.email || '',
            mobile: meta.mobile || '',
            studentClass: meta.studentClass || 'Class 9th',
            role: meta.role || 'student',
            languagePreference: meta.languagePreference || 'en',
            token: session.access_token,
            enrolledCourses: meta.enrolledCourses || ['course-1', 'course-2'],
          };
          localStorage.setItem('userInfo', JSON.stringify(supaUser));
          setUser(supaUser);
        }
      } catch {
        // Supabase unavailable — use localStorage data
      }

      setLoading(false);
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('userInfo');
          setUser(null);
        } else if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          const meta = session.user.user_metadata || {};
          const supaUser: User = {
            _id: session.user.id,
            name: meta.name || meta.full_name || session.user.email?.split('@')[0] || 'Student',
            email: session.user.email || '',
            mobile: meta.mobile || '',
            studentClass: meta.studentClass || 'Class 9th',
            role: meta.role || 'student',
            languagePreference: meta.languagePreference || 'en',
            token: session.access_token,
            enrolledCourses: meta.enrolledCourses || ['course-1', 'course-2'],
          };
          localStorage.setItem('userInfo', JSON.stringify(supaUser));
          setUser(supaUser);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Offline logout
    }
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem('userInfo', JSON.stringify(updated));
    setUser(updated);

    // Sync to Supabase metadata
    try {
      supabase.auth.updateUser({
        data: {
          name: updated.name,
          mobile: updated.mobile,
          studentClass: updated.studentClass,
          languagePreference: updated.languagePreference,
        },
      });
    } catch {
      // Offline — localStorage is source of truth
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
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
