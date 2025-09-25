import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { AuthService } from '../services/authService';
import { UserService, UserProfile } from '../services/userService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const extractErrorMessage = (err: unknown): string => {
    if (typeof err === 'string') return err;
    if (typeof err === 'object' && err !== null) {
      const maybeResp = (err as { response?: { data?: unknown } }).response;
      const data = maybeResp?.data;
      if (typeof data === 'string') return data;
      if (typeof data === 'object' && data !== null && 'message' in (data as Record<string, unknown>)) {
        const msg = (data as Record<string, unknown>).message;
        if (typeof msg === 'string') return msg;
      }
      if ('message' in (err as Record<string, unknown>)) {
        const msg = (err as Record<string, unknown>).message;
        if (typeof msg === 'string') return msg;
      }
    }
    return 'Request failed';
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('daxo_user');
    const savedProfile = localStorage.getItem('daxo_profile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      setError(undefined);
      const token = await AuthService.login({ email, password });
      if (!token) return false;

      localStorage.setItem('daxo_token', token);
      
      // Fetch user profile after login
      try {
        const profile = await UserService.getMyProfile();
        setUserProfile(profile);
        localStorage.setItem('daxo_profile', JSON.stringify(profile));
        
        const userData: User = { id: profile.id.toString(), email: profile.email, name: profile.name };
        setUser(userData);
        localStorage.setItem('daxo_user', JSON.stringify(userData));
      } catch {
        // If profile fetch fails, still set basic user data
        const userData: User = { id: email, email, name: email.split('@')[0] };
        setUser(userData);
        localStorage.setItem('daxo_user', JSON.stringify(userData));
      }
      
      return true;
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || 'Login failed';
      console.error('Login error:', msg);
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, confirmPassword: string, name?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!email || !password || password !== confirmPassword) return false;
      setError(undefined);

      await AuthService.register({
        name: name || email.split('@')[0],
        email,
        password
      });

      // Do NOT auto-login; require user to login explicitly
      return true;
    } catch (err: unknown) {
      const msg = extractErrorMessage(err) || 'Registration failed';
      console.error('Registration error:', msg);
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('daxo_user');
    localStorage.removeItem('daxo_profile');
    localStorage.removeItem('daxo_token');
    localStorage.removeItem('daxo_goals');
    localStorage.removeItem('daxo_meals');
    localStorage.removeItem('daxo_progress');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
    userProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};