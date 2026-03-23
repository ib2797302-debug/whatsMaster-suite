import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act, render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme, ThemeToggle } from "./use-theme";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("ThemeProvider", () => {
    it("should provide default theme as system", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe("system");
    });

    it("should accept custom default theme", () => {
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper: customWrapper });

      expect(result.current.theme).toBe("dark");
    });

    it("should load theme from localStorage on mount", () => {
      localStorage.setItem("whatsmaster_theme", "dark");

      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBe("dark");
    });

    it("should use custom storage key", () => {
      const customKey = "custom_theme_key";
      localStorage.setItem(customKey, "dark");

      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider storageKey={customKey}>{children}</ThemeProvider>
      );

      const { result } = renderHook(() => useTheme(), { wrapper: customWrapper });

      expect(result.current.theme).toBe("dark");
    });
  });

  describe("setTheme", () => {
    it("should change theme to light", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme("light");
      });

      expect(result.current.theme).toBe("light");
      expect(localStorage.getItem("whatsmaster_theme")).toBe("light");
    });

    it("should change theme to dark", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme("dark");
      });

      expect(result.current.theme).toBe("dark");
      expect(localStorage.getItem("whatsmaster_theme")).toBe("dark");
    });

    it("should change theme to system", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme("system");
      });

      expect(result.current.theme).toBe("system");
      expect(localStorage.getItem("whatsmaster_theme")).toBe("system");
    });

    it("should apply dark class to document when theme is dark", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme("dark");
      });

      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });

    it("should apply light class to document when theme is light", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme("light");
      });

      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("should set colorScheme style property", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme("dark");
      });

      expect(document.documentElement.style.colorScheme).toBe("dark");
    });
  });

  describe("actualTheme", () => {
    it("should return actual theme based on system when theme is system", () => {
      // Mock system theme as dark
      const matchMediaMock = vi.fn().mockReturnValue({ matches: true });
      vi.spyOn(window, "matchMedia").mockImplementation(matchMediaMock);

      const { result } = renderHook(() => useTheme(), { wrapper });

      // Quand le thème est system et que le système est en dark mode
      expect(result.current.actualTheme).toBe("dark");
    });

    it("should return actual theme when theme is explicitly set", () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      act(() => {
        result.current.setTheme("dark");
      });

      expect(result.current.actualTheme).toBe("dark");

      act(() => {
        result.current.setTheme("light");
      });

      expect(result.current.actualTheme).toBe("light");
    });
  });

  describe("system theme listener", () => {
    it("should listen to system theme changes when theme is system", () => {
      const addEventListenerSpy = vi.fn();
      const removeEventListenerSpy = vi.fn();
      
      const matchMediaMock = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: addEventListenerSpy,
        removeEventListener: removeEventListenerSpy,
      });
      
      vi.spyOn(window, "matchMedia").mockImplementation(matchMediaMock);

      const { unmount } = renderHook(() => useTheme(), { wrapper });

      expect(addEventListenerSpy).toHaveBeenCalledWith("change", expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("change", expect.any(Function));
    });

    it("should not listen to system theme changes when theme is not system", () => {
      const addEventListenerSpy = vi.fn();
      
      const matchMediaMock = vi.fn().mockReturnValue({
        matches: false,
        addEventListener: addEventListenerSpy,
      });
      
      vi.spyOn(window, "matchMedia").mockImplementation(matchMediaMock);

      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      );

      renderHook(() => useTheme(), { wrapper: customWrapper });

      // Ne devrait pas ajouter d'écouteur quand le thème n'est pas "system"
      expect(addEventListenerSpy).not.toHaveBeenCalled();
    });
  });
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
  });

  it("should render with icon variant by default", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label");
  });

  it("should render with button variant", () => {
    render(
      <ThemeProvider>
        <ThemeToggle variant="button" />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent(/clair|sombre/i);
  });

  it("should toggle theme on click", () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    
    act(() => {
      button.click();
    });

    // Après le premier clic, devrait passer à dark
    expect(localStorage.getItem("whatsmaster_theme")).toBe("dark");
  });

  it("should cycle through light -> dark -> system -> light", () => {
    const { rerender } = render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");

    // Light -> Dark
    act(() => button.click());
    expect(localStorage.getItem("whatsmaster_theme")).toBe("dark");

    // Dark -> System
    act(() => button.click());
    expect(localStorage.getItem("whatsmaster_theme")).toBe("system");

    // System -> Light
    act(() => button.click());
    expect(localStorage.getItem("whatsmaster_theme")).toBe("light");
  });

  it("should have proper accessibility attributes", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label");
    expect(button).toHaveAttribute("title");
  });

  it("should accept custom className", () => {
    render(
      <ThemeProvider>
        <ThemeToggle className="custom-class" />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });
});
