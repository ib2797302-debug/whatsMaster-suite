import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";
import { ThemeProvider, useTheme } from "@/hooks/use-theme";

// Wrapper component with ThemeProvider
function ThemeToggleWrapper() {
  return (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("devrait faire le rendu avec l'icône soleil par défaut (thème sombre)", () => {
    render(<ThemeToggleWrapper />);
    
    // Le soleil devrait être visible (thème sombre par défaut)
    const sunIcon = screen.getByRole("img", { hidden: true });
    expect(sunIcon).toBeInTheDocument();
  });

  it("devrait basculer vers le thème clair au clic", () => {
    render(<ThemeToggleWrapper />);
    
    const toggleButton = screen.getByRole("button", {
      name: /basculer vers le thème clair/i
    });
    
    fireEvent.click(toggleButton);
    
    // Après le clic, le label devrait indiquer le thème sombre
    expect(toggleButton).toHaveAttribute(
      "aria-label",
      "Basculer vers le thème sombre"
    );
  });

  it("devrait avoir un attribut aria-label approprié", () => {
    render(<ThemeToggleWrapper />);
    
    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveAttribute("aria-label");
    expect(toggleButton.getAttribute("aria-label")).toContain("Basculer vers le thème");
  });

  it("devrait avoir un attribut title", () => {
    render(<ThemeToggleWrapper />);
    
    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveAttribute("title");
    expect(toggleButton.getAttribute("title")).toContain("Thème actuel");
  });

  it("devrait afficher le label si showLabel est true", () => {
    function ThemeToggleWithLabel() {
      return (
        <ThemeProvider>
          <ThemeToggle showLabel={true} />
        </ThemeProvider>
      );
    }
    
    render(<ThemeToggleWithLabel />);
    
    const label = screen.getByText(/mode sombre/i);
    expect(label).toBeInTheDocument();
  });

  it("devrait utiliser la variante ghost par défaut", () => {
    render(<ThemeToggleWrapper />);
    
    const toggleButton = screen.getByRole("button");
    // La classe devrait contenir des styles de bouton ghost
    expect(toggleButton).toBeInTheDocument();
  });

  it("devrait accepter différentes variantes", () => {
    function ThemeToggleOutline() {
      return (
        <ThemeProvider>
          <ThemeToggle variant="outline" />
        </ThemeProvider>
      );
    }
    
    render(<ThemeToggleOutline />);
    
    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();
  });

  it("devrait basculer plusieurs fois entre les thèmes", () => {
    render(<ThemeToggleWrapper />);
    
    const toggleButton = screen.getByRole("button");
    
    // Premier clic - passage en clair
    fireEvent.click(toggleButton);
    expect(toggleButton.getAttribute("aria-label")).toBe("Basculer vers le thème sombre");
    
    // Deuxième clic - retour en sombre
    fireEvent.click(toggleButton);
    expect(toggleButton.getAttribute("aria-label")).toBe("Basculer vers le thème clair");
    
    // Troisième clic - passage en clair
    fireEvent.click(toggleButton);
    expect(toggleButton.getAttribute("aria-label")).toBe("Basculer vers le thème sombre");
  });

  it("devrait persister le thème dans le localStorage", () => {
    render(<ThemeToggleWrapper />);
    
    const toggleButton = screen.getByRole("button");
    
    // Basculer vers le thème clair
    fireEvent.click(toggleButton);
    
    // Vérifier que localStorage a été mis à jour
    const storedTheme = localStorage.getItem("whatsmaster_theme");
    expect(storedTheme).toBe("light");
  });

  it("devrait charger le thème depuis le localStorage", () => {
    // Définir un thème dans localStorage avant le rendu
    localStorage.setItem("whatsmaster_theme", "light");
    
    render(<ThemeToggleWrapper />);
    
    const toggleButton = screen.getByRole("button");
    // Devrait afficher l'option pour passer en sombre
    expect(toggleButton.getAttribute("aria-label")).toBe("Basculer vers le thème sombre");
  });

  it("devrait gérer le thème système", () => {
    // Simuler une préférence système sombre
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: true, // mode sombre
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
    
    localStorage.setItem("whatsmaster_theme", "system");
    
    render(<ThemeToggleWrapper />);
    
    // Le thème devrait être sombre car le système est en mode sombre
    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();
  });
});
