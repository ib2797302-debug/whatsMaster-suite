/**
 * Tests pour les hooks personnalisés de préférences
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUserPreferences, useClipboard, useOnlineStatus, useWindowSize } from '../use-preferences';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useUserPreferences', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should return default preferences on first load', () => {
    const { result } = renderHook(() => useUserPreferences());

    expect(result.current.preferences).toEqual({
      theme: 'system',
      language: 'fr-FR',
      notifications: true,
      compactMode: false,
      sidebarCollapsed: false,
      itemsPerPage: 20,
    });
  });

  it('should load preferences from localStorage', () => {
    const savedPrefs = JSON.stringify({ theme: 'dark', language: 'en-US' });
    localStorageMock.getItem.mockReturnValue(savedPrefs);

    const { result } = renderHook(() => useUserPreferences());

    expect(result.current.preferences.theme).toBe('dark');
    expect(result.current.preferences.language).toBe('en-US');
  });

  it('should update a specific preference', () => {
    const { result } = renderHook(() => useUserPreferences());

    act(() => {
      result.current.updatePreference('theme', 'dark');
    });

    expect(result.current.preferences.theme).toBe('dark');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should toggle boolean preferences', () => {
    const { result } = renderHook(() => useUserPreferences());

    expect(result.current.preferences.notifications).toBe(true);

    act(() => {
      result.current.togglePreference('notifications');
    });

    expect(result.current.preferences.notifications).toBe(false);
  });

  it('should reset to default preferences', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ theme: 'dark', notifications: false })
    );

    const { result } = renderHook(() => useUserPreferences());

    act(() => {
      result.current.resetPreferences();
    });

    expect(result.current.preferences.theme).toBe('system');
    expect(result.current.preferences.notifications).toBe(true);
    expect(localStorageMock.removeItem).toHaveBeenCalled();
  });

  it('should provide helper booleans', () => {
    const { result } = renderHook(() => useUserPreferences());

    act(() => {
      result.current.updatePreference('theme', 'dark');
      result.current.updatePreference('compactMode', true);
    });

    expect(result.current.isDarkMode).toBe(true);
    expect(result.current.isCompactMode).toBe(true);
    expect(result.current.notificationsEnabled).toBe(true);
  });
});

describe('useClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should copy text to clipboard', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const { result } = renderHook(() => useClipboard(100));

    await act(async () => {
      const success = await result.current.copy('Test text');
      expect(success).toBe(true);
    });

    expect(writeTextMock).toHaveBeenCalledWith('Test text');
    expect(result.current.copied).toBe(true);
  });

  it('should handle clipboard errors', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Failed'));
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      const success = await result.current.copy('Test text');
      expect(success).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('should reset copied state after timeout', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    vi.useFakeTimers();

    const { result } = renderHook(() => useClipboard(100));

    await act(async () => {
      await result.current.copy('Test');
    });

    expect(result.current.copied).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.copied).toBe(false);

    vi.useRealTimers();
  });
});

describe('useOnlineStatus', () => {
  it('should return current online status', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);
  });

  it('should update when online/offline events fire', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
    });

    const { result } = renderHook(() => useOnlineStatus());
    expect(result.current).toBe(true);

    // Simulate offline event
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
    });

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current).toBe(false);
  });
});

describe('useWindowSize', () => {
  it('should return initial window size', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useWindowSize());

    expect(result.current).toEqual({ width: 1024, height: 768 });
  });

  it('should update on resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useWindowSize());

    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });
      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.width).toBe(800);
  });
});
