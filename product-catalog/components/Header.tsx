'use client';

import { useState } from 'react';
import { useTheme } from './theme/ThemeProvider';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export default function Header() {
  const { mode, toggleMode, palette, setPalette } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 top-0 z-40 flex justify-center pointer-events-none">
      <div
        className="relative h-14 w-full max-w-5xl pointer-events-auto"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="absolute inset-x-0 top-0 flex justify-center">
          <div
            className={cn(
              "h-2 w-24 rounded-b-full bg-primary/40 transition-opacity duration-300",
              isOpen ? "opacity-0" : "opacity-80"
            )}
          />
        </div>
        <header
          className={cn(
            "absolute left-0 right-0 top-0 mx-auto flex h-12 items-center justify-between rounded-full border bg-background/90 px-4 shadow-sm backdrop-blur transition-all duration-300",
            isOpen
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-full opacity-0 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="size-6 rounded-md bg-primary/20" />
            <span className="text-sm font-semibold tracking-tight">Product Catalog</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="palette-select">Theme Palette</label>
            <select
              id="palette-select"
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={palette}
              onChange={(e) => setPalette(e.target.value as any)}
              aria-label="Select theme palette"
            >
              <option value="default">Default</option>
              <option value="ocean">Ocean</option>
              <option value="teal">Teal</option>
              <option value="violet">Violet</option>
              <option value="rose">Rose</option>
            </select>
            <Button variant="outline" size="sm" onClick={toggleMode} aria-label="Toggle color mode">
              {mode === 'light' ? 'Dark' : 'Light'}
            </Button>
          </div>
        </header>
      </div>
    </div>
  );
}


