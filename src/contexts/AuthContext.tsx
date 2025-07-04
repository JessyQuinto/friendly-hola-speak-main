import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();
        
        if (isAuth && storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse: AuthResponse = await authService.login(credentials);
      setUser(authResponse.user);
      
      toast({
        title: 'Bienvenido',
        description: `¡Hola ${authResponse.user.firstName}! Has iniciado sesión correctamente.`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
      toast({
        title: 'Error de autenticación',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse: AuthResponse = await authService.register(userData);
      setUser(authResponse.user);
      
      toast({
        title: '¡Cuenta creada!',
        description: `Bienvenido ${authResponse.user.firstName}. Tu cuenta ha sido creada exitosamente.`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al crear la cuenta';
      toast({
        title: 'Error de registro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente.',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;