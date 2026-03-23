/**
 * Hook personnalisé pour la gestion des préférences utilisateur
 * Gère les paramètres persistants dans le localStorage
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  compactMode: boolean;
  sidebarCollapsed: boolean;
  itemsPerPage: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'fr-FR',
  notifications: true,
  compactMode: false,
  sidebarCollapsed: false,
  itemsPerPage: 20,
};

const STORAGE_KEY = 'whatsmaster_preferences';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    return DEFAULT_PREFERENCES;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sauvegarder les préférences quand elles changent
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      setError(null);
    } catch (err) {
      setError('Impossible de sauvegarder les préférences');
      console.error('Failed to save preferences:', err);
    }
  }, [preferences]);

  // Mettre à jour une préférence spécifique
  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Réinitialiser aux valeurs par défaut
  const resetPreferences = useCallback(() => {
    setIsLoading(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setPreferences(DEFAULT_PREFERENCES);
      setError(null);
    } catch (err) {
      setError('Impossible de réinitialiser les préférences');
      console.error('Failed to reset preferences:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Basculer une valeur booléenne
  const togglePreference = useCallback(<K extends keyof UserPreferences>(
    key: K
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key] as UserPreferences[K],
    }));
  }, []);

  return {
    preferences,
    isLoading,
    error,
    updatePreference,
    resetPreferences,
    togglePreference,
    // Helpers spécifiques
    isDarkMode: preferences.theme === 'dark',
    isCompactMode: preferences.compactMode,
    notificationsEnabled: preferences.notifications,
  };
}

/**
 * Hook pour gérer l'état de chargement initial
 */
export function useInitialLoad<T>(
  loader: () => Promise<T>,
  dependencies: unknown[] = []
): { data: T | null; isLoading: boolean; error: Error | null; reload: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await loader();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setIsLoading(false);
    }
  }, [loader, ...dependencies]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, isLoading, error, reload: loadData };
}

/**
 * Hook pour suivre la visibilité d'un élément dans le viewport
 */
export function useInView<T extends Element>(
  options?: IntersectionObserverInit
): { ref: React.RefObject<T>; isInView: boolean } {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

/**
 * Hook pour gérer le presse-papier
 */
export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);

      setTimeout(() => setCopied(false), timeout);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Échec de la copie'));
      return false;
    }
  }, [timeout]);

  return { copied, error, copy };
}

/**
 * Hook pour détecter si l'utilisateur est en ligne
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook pour suivre la taille de la fenêtre
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/**
 * Hook pour le défilement infini
 */
export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  isLoading: boolean,
  threshold = 100
) {
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, hasMore, isLoading, threshold]);
}
