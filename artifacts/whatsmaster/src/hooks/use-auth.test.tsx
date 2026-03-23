import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./use-auth";
import { User } from "@workspace/api-client-react";

// Mock wouter
vi.mock("wouter", () => ({
  useLocation: () => ["/", vi.fn()],
}));

// Mock use-toast
vi.mock("./use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should initialize with null user and token", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("should login successfully with valid credentials", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ username: "admin", password: "admin" });
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.username).toBe("admin");
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "whatsmaster_token",
      expect.any(String)
    );
  });

  it("should reject invalid credentials", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await expect(
      act(async () => {
        await result.current.login({ username: "invalid", password: "invalid" });
      })
    ).rejects.toThrow();

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should logout and clear storage", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Login first
    await act(async () => {
      await result.current.login({ username: "user", password: "user" });
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalled();
  });

  it("should identify admin user correctly", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ username: "admin", password: "admin" });
    });

    expect(result.current.isAdmin).toBe(true);
  });

  it("should identify non-admin user correctly", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ username: "user", password: "user" });
    });

    expect(result.current.isAdmin).toBe(false);
  });
});
