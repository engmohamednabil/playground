'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemePalette = 'default' | 'ocean' | 'teal' | 'violet' | 'rose';

interface ThemeContextValue {
  mode: ThemeMode;
  palette: ThemePalette;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ThemePalette) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

const MODE_KEY = 'app_theme_mode';
const PALETTE_KEY = 'app_theme_palette';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [palette, setPaletteState] = useState<ThemePalette>('default');

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const m = (localStorage.getItem(MODE_KEY) as ThemeMode) || 'light';
      const p = (localStorage.getItem(PALETTE_KEY) as ThemePalette) || 'default';
      setModeState(m);
      setPaletteState(p);
    } catch {
      // ignore
    }
  }, []);

  // Apply classes to <html>
  useEffect(() => {
    const root = document.documentElement;
    // mode
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // palette
    const paletteClasses: ThemePalette[] = ['default', 'ocean', 'teal', 'violet', 'rose'];
    paletteClasses.forEach((c) => root.classList.remove(`theme-${c}`));
    root.classList.add(`theme-${palette}`);
    try {
      localStorage.setItem(MODE_KEY, mode);
      localStorage.setItem(PALETTE_KEY, palette);
    } catch {
      // ignore
    }
  }, [mode, palette]);

  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    palette,
    setMode: setModeState,
    setPalette: setPaletteState,
    toggleMode: () => setModeState((m) => (m === 'light' ? 'dark' : 'light')),
  }), [mode, palette]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}


