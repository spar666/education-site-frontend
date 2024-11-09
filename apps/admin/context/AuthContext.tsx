'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

// Define the AuthContext types
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Create a context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component that wraps the app
export const AsProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Function to authenticate user and store token
  const login = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  // Function to handle user logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Retrieve token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
