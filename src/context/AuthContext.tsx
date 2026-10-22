import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types/auth';
import { storage } from '../services/storage';

interface AuthContextType extends AuthState {
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleSuccess: (userData: { name: string; email: string; avatar?: string }) => void;
  logout: () => void;
  isGoogleConfigured: boolean;
  googleClientId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS_KEY = 'registered_users';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => storage.get<User | null>('auth_user', null));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isGoogleConfigured = Boolean(googleClientId && googleClientId.length > 5 && !googleClientId.includes('YOUR_GOOGLE_CLIENT_ID'));

  // Ensure standard demo user exists for easy testing if needed
  useEffect(() => {
    const existingUsers = storage.get<Array<{ name: string; email: string; passwordHash: string }>>(DEMO_USERS_KEY, []);
    if (!existingUsers.some(u => u.email === 'alex@dailynest.com')) {
      existingUsers.push({
        name: 'Alex Johnson',
        email: 'alex@dailynest.com',
        passwordHash: 'password123'
      });
      storage.set(DEMO_USERS_KEY, existingUsers);
    }
  }, []);

  const loginWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 400)); // Smooth natural feeling transition

    const trimmedEmail = email.trim().toLowerCase();
    const registeredUsers = storage.get<Array<{ name: string; email: string; passwordHash: string }>>(DEMO_USERS_KEY, []);
    const found = registeredUsers.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      setIsLoading(false);
      return { success: false, error: 'No account found with this email. Please register first.' };
    }

    if (found.passwordHash !== password) {
      setIsLoading(false);
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    const authenticatedUser: User = {
      id: `usr-${Date.now()}`,
      name: found.name,
      email: found.email,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      provider: 'local',
      createdAt: new Date().toISOString()
    };

    setUser(authenticatedUser);
    storage.set('auth_user', authenticatedUser);
    setIsLoading(false);
    return { success: true };
  };

  const registerWithEmail = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise(res => setTimeout(res, 400));

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid full name.' };
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setIsLoading(false);
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (!password || password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const registeredUsers = storage.get<Array<{ name: string; email: string; passwordHash: string }>>(DEMO_USERS_KEY, []);
    if (registeredUsers.some(u => u.email.toLowerCase() === trimmedEmail)) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    registeredUsers.push({
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: password
    });
    storage.set(DEMO_USERS_KEY, registeredUsers);

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`,
      provider: 'local',
      createdAt: new Date().toISOString()
    };

    setUser(newUser);
    storage.set('auth_user', newUser);
    setIsLoading(false);
    return { success: true };
  };

  const loginWithGoogleSuccess = (userData: { name: string; email: string; avatar?: string }) => {
    const googleUser: User = {
      id: `goog-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      provider: 'google',
      createdAt: new Date().toISOString()
    };
    setUser(googleUser);
    storage.set('auth_user', googleUser);
  };

  const logout = () => {
    setUser(null);
    storage.remove('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogleSuccess,
        logout,
        isGoogleConfigured,
        googleClientId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
