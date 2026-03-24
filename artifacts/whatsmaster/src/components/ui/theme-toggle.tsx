/**
 * Composant ThemeToggle - Bouton de bascule de thème
 * 
 * Utilise le hook useTheme pour basculer entre les thèmes clair et sombre.
 * Ce composant est accessible et inclut des attributs ARIA appropriés.
 */

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  variant?: "ghost" | "outline" | "default";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function ThemeToggle({ 
  variant = "ghost", 
  size = "icon",
  showLabel = false 
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      aria-label={`Basculer vers le thème ${theme === "dark" ? "clair" : "sombre"}`}
      title={`Thème actuel: ${theme === "dark" ? "sombre" : "clair"}`}
      className="relative"
    >
      <Sun 
        className="h-5 w-5 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" 
        aria-hidden="true"
      />
      <Moon 
        className="absolute h-5 w-5 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" 
        aria-hidden="true"
      />
      {showLabel && (
        <span className="ml-2">
          {theme === "dark" ? "Mode clair" : "Mode sombre"}
        </span>
      )}
    </Button>
  );
}

export default ThemeToggle;
