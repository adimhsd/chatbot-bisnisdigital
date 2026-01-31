'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial theme
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      <i
        className={`fas text-lg ${isDark ? 'fa-sun text-yellow-400' : 'fa-moon text-slate-600'}`}
      ></i>
    </button>
  );
}
