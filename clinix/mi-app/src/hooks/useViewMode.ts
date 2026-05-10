import { useState, useEffect } from 'react';

export function useViewMode(key: string, defaultMode: 'grid' | 'table' = 'grid') {
  const [view, setView] = useState<'grid' | 'table'>(() => {
    const stored = localStorage.getItem(`viewMode_${key}`);
    return (stored === 'grid' || stored === 'table') ? stored : defaultMode;
  });

  useEffect(() => {
    localStorage.setItem(`viewMode_${key}`, view);
  }, [view, key]);

  return [view, setView] as const;
}