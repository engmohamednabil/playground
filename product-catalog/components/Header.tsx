'use client';

import { useTheme } from './theme/ThemeProvider';
import { Button } from './ui/button';

export default function Header() {
  const { mode, toggleMode, palette, setPalette } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
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
      </div>
    </header>
  );
}


