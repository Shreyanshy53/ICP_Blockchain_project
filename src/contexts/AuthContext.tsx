import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  principal: string;
  role: 'educator' | 'learner';
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (role: 'educator' | 'learner') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing authentication
    const savedUser = localStorage.getItem('icp-scholar-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (role: 'educator' | 'learner') => {
    setIsLoading(true);
    
    // Simulate Internet Identity authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      principal: `${role}-${Math.random().toString(36).substr(2, 9)}`,
      role,
      name: role === 'educator' ? 'Dr. Sarah Johnson' : 'Alex Chen',
      email: role === 'educator' ? 'sarah.johnson@university.edu' : 'alex.chen@email.com',
      avatar: `https://images.unsplash.com/photo-${role === 'educator' ? '1494790108755-2616c5e24227' : '1472099645785-5658abf4ff4e'}?auto=format&fit=crop&w=400&q=80`
    };
    
    setUser(mockUser);
    localStorage.setItem('icp-scholar-user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('icp-scholar-user');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};