import React, { createContext, useContext, useEffect, useState } from 'react';
import { theme } from './theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [colorMode, setColorMode] = useState('light');
  
  // Toggle between light and dark mode
  const toggleColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(newMode);
    localStorage.setItem('colorMode', newMode);
    updateDocumentClasses(newMode);
  };

  // Update document classes when color mode changes
  const updateDocumentClasses = (mode) => {
    document.documentElement.setAttribute('data-theme', mode);
    document.body.className = mode;
  };

  // Initialize theme on mount
  useEffect(() => {
    // Check for saved preference or use system preference
    const savedMode = localStorage.getItem('colorMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialMode = savedMode || (prefersDark ? 'dark' : 'light');
    setColorMode(initialMode);
    updateDocumentClasses(initialMode);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newMode = e.matches ? 'dark' : 'light';
      setColorMode(newMode);
      updateDocumentClasses(newMode);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Theme values
  const themeValues = {
    ...theme,
    colorMode,
    toggleColorMode,
    isDark: colorMode === 'dark',
    isLight: colorMode === 'light',
  };

  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
