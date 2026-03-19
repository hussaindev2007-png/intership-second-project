import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, AuthContextType } from '../types';
import { users as initialUsers } from '../data/users'; 
import toast from 'react-hot-toast';

interface ExtendedAuthContextType extends AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifying2FA: boolean;
  verifyOTP: (code: string) => Promise<void>;
  cancel2FA: () => void;
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

const USERS_DB_KEY = 'bn_users_database';
const SESSION_KEY = 'bn_active_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem(USERS_DB_KEY);
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

  const [user, setUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  useEffect(() => {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    const activeSession = localStorage.getItem(SESSION_KEY);
    if (activeSession) {
      try {
        setUser(JSON.parse(activeSession));
      } catch (e) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const foundUser = allUsers.find(u => u.email === email && u.role === role);
      if (foundUser) {
        setPendingUser(foundUser);
        setIsVerifying2FA(true);
        toast.success('Security code sent!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (allUsers.some(u => u.email === email)) throw new Error('Email exists');

      const newUser: User = {
        id: `U-${Date.now()}`,
        name, email, role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        bio: 'Nexus Member',
        isOnline: true,
        createdAt: new Date().toISOString()
      };

      setAllUsers(prev => [...prev, newUser]);
      setPendingUser(newUser);
      setIsVerifying2FA(true);
      toast.success('Account created! Verify OTP.');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const verifyOTP = async (code: string): Promise<void> => {
    setIsLoading(true);
    try {
      
      if (code === "1234" && pendingUser) {
       
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const finalUser = { ...pendingUser };
        setUser(finalUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(finalUser));
        
        setPendingUser(null);
        setIsVerifying2FA(false);
        toast.success(`Access Granted! Welcome ${finalUser.name}`);
      } else {
        throw new Error('Invalid code');
      }
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    toast.success('Logged out');
    window.location.href = '/login'; 
  };

  const cancel2FA = () => {
    setIsVerifying2FA(false);
    setPendingUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, register, logout, 
      forgotPassword: async () => {}, resetPassword: async () => {}, updateProfile: async () => {},
      isAuthenticated: !!user, isLoading, isVerifying2FA, verifyOTP, cancel2FA 
    } as any}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth error');
  return context;
};
