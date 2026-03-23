import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User, LoginRequest } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "./use-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Security constants - using secure cookie names for future migration
const AUTH_TOKEN_KEY = "whatsmaster_token";
const AUTH_USER_KEY = "whatsmaster_user";
const TOKEN_EXPIRY_KEY = "whatsmaster_token_expiry";
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to validate user object structure
function isValidUser(user: unknown): user is User {
  return (
    typeof user === "object" &&
    user !== null &&
    "id" in user &&
    typeof (user as User).id === "string" &&
    "name" in user &&
    typeof (user as User).name === "string" &&
    "username" in user &&
    typeof (user as User).username === "string" &&
    "role" in user &&
    ["admin", "user"].includes((user as User).role)
  );
}

// Helper function to check token expiry
function isTokenExpired(): boolean {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  return Date.now() > parseInt(expiry, 10);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const clearAuthStorage = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }, []);

  useEffect(() => {
    // Check local storage on mount with security best practices
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    
    if (storedToken && storedUser && !isTokenExpired()) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validate user object structure before setting
        if (isValidUser(parsedUser)) {
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          // Invalid user data, clear storage
          console.warn('Invalid user data in storage, clearing...');
          clearAuthStorage();
        }
      } catch (e) {
        console.error('Failed to parse stored auth data:', e);
        clearAuthStorage();
      }
    } else if (storedToken || storedUser) {
      // Token expired or incomplete auth data
      console.warn('Auth data expired or incomplete, clearing...');
      clearAuthStorage();
    }
    setIsLoading(false);
  }, [clearAuthStorage]);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));
      
      let mockUser: User;
      // Generate more secure token with timestamp and random string
      const mockToken = `mock_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const tokenExpiry = Date.now() + TOKEN_EXPIRY_MS;

      if (data.username === "admin" && data.password === "admin") {
        mockUser = {
          id: "u1", 
          name: "System Admin", 
          username: "admin", 
          role: "admin", 
          isActive: true, 
          createdAt: new Date().toISOString()
        };
      } else if (data.username === "user" && data.password === "user") {
        mockUser = {
          id: "u2", 
          name: "Support Agent", 
          username: "user", 
          role: "user", 
          isActive: true, 
          createdAt: new Date().toISOString()
        };
      } else {
        throw new Error("Identifiants incorrects. Essayez admin/admin ou user/user.");
      }

      setUser(mockUser);
      setToken(mockToken);
      // Store token with expiry
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
      localStorage.setItem(TOKEN_EXPIRY_KEY, tokenExpiry.toString());
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${mockUser.name}`,
      });
      
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue lors de la connexion",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Future: Call logout API endpoint to invalidate server-side session
      // await fetch('/api/auth/logout', { 
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
    } catch (e) {
      console.error('Logout API call failed:', e);
    } finally {
      // Always clear local state and storage
      setUser(null);
      setToken(null);
      clearAuthStorage();
      setLocation("/login");
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur WhatsMaster",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user && !isTokenExpired(),
      isAdmin: user?.role === "admin"
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
