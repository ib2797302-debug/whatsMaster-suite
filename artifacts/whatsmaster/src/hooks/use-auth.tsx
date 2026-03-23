import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, LoginRequest, UserRole } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "./use-toast";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage on mount
    const storedToken = localStorage.getItem("whatsmaster_token");
    const storedUser = localStorage.getItem("whatsmaster_user");
    
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        localStorage.removeItem("whatsmaster_token");
        localStorage.removeItem("whatsmaster_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    // Simulate API call with robust fallback for the requested default credentials
    setIsLoading(true);
    try {
      // Fake network delay for realism
      await new Promise(r => setTimeout(r, 800));
      
      let mockUser: User;
      let mockToken = "mock_jwt_token_" + Date.now();

      if (data.username === "admin" && data.password === "admin") {
        mockUser = {
          id: "u1", name: "System Admin", username: "admin", role: "admin", isActive: true, createdAt: new Date().toISOString()
        };
      } else if (data.username === "user" && data.password === "user") {
        mockUser = {
          id: "u2", name: "Support Agent", username: "user", role: "user", isActive: true, createdAt: new Date().toISOString()
        };
      } else {
        throw new Error("Identifiants incorrects. Essayez admin/admin ou user/user.");
      }

      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem("whatsmaster_token", mockToken);
      localStorage.setItem("whatsmaster_user", JSON.stringify(mockUser));
      
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${mockUser.name}`,
      });
      
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("whatsmaster_token");
    localStorage.removeItem("whatsmaster_user");
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      logout,
      isAuthenticated: !!user,
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
