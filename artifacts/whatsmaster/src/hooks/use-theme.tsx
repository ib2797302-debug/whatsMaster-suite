import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  actualTheme: "light" | "dark";
}

const THEME_KEY = "whatsmaster_theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Hook utilitaire pour obtenir le thème système
 */
function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") {
    return "light";
  }
  
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Applique le thème à l'élément HTML
 */
function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark" | "system";
  storageKey?: string;
}

/**
 * Fournisseur de thème avec support du mode sombre et du thème système
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = THEME_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(defaultTheme);
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialisation du thème depuis le stockage local
  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as "light" | "dark" | "system" | null;
    
    if (storedTheme) {
      setThemeState(storedTheme);
    }
    
    setIsInitialized(true);
  }, [storageKey]);

  // Application du thème
  useEffect(() => {
    if (!isInitialized) return;

    let newTheme: "light" | "dark";

    if (theme === "system") {
      newTheme = getSystemTheme();
    } else {
      newTheme = theme;
    }

    setActualTheme(newTheme);
    applyTheme(newTheme);

    // Sauvegarde dans le stockage local
    localStorage.setItem(storageKey, theme);
  }, [theme, isInitialized, storageKey]);

  // Écouteur des changements du thème système
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      const systemTheme = getSystemTheme();
      setActualTheme(systemTheme);
      applyTheme(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const setTheme = (newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook pour utiliser le contexte de thème
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}

/**
 * Bouton de bascule du thème prêt à l'emploi
 */
interface ThemeToggleProps {
  className?: string;
  variant?: "button" | "icon";
}

export function ThemeToggle({ className = "", variant = "icon" }: ThemeToggleProps) {
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getLabel = () => {
    if (theme === "system") {
      return `Thème: Système (actuellement ${actualTheme === "dark" ? "sombre" : "clair"})`;
    }
    return `Thème: ${theme === "dark" ? "sombre" : "clair"}`;
  };

  if (variant === "button") {
    return (
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ${className}`}
        aria-label={getLabel()}
        title={getLabel()}
      >
        {actualTheme === "dark" ? "🌙 Sombre" : "☀️ Clair"}
        <span className="ml-2 text-xs opacity-70">
          {theme === "system" ? "(Auto)" : ""}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-md hover:bg-muted transition-colors ${className}`}
      aria-label={getLabel()}
      title={getLabel()}
    >
      {actualTheme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
