import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { db } from '../services/dbService';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => Promise<boolean>;
  signup: (fullName: string, email: string, role: UserRole, phone?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'printvault_auth_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const savedId = localStorage.getItem(CURRENT_USER_KEY);
    if (savedId) {
      return db.getProfileById(savedId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  const login = async (email: string, role: UserRole): Promise<boolean> => {
    const profiles = db.getProfiles();
    let found = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      const newProfile: UserProfile = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email,
        role,
        full_name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.saveProfile(newProfile);
      found = newProfile;
    }
    setUser(found);
    return true;
  };

  const signup = async (fullName: string, email: string, role: UserRole, phone?: string): Promise<boolean> => {
    const newProfile: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      role,
      full_name: fullName,
      phone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.saveProfile(newProfile);
    setUser(newProfile);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
