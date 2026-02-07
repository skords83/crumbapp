import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('crumb-theme-dark');
    if (saved) {
      return saved === 'true';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [colorTheme, setColorTheme] = useState(() => {
    // Check localStorage for color theme
    const saved = localStorage.getItem('crumb-color-theme');
    return saved || 'natural'; // natural, modern, premium
  });

  useEffect(() => {
    // Apply dark mode
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('crumb-theme-dark', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    // Apply color theme
    document.documentElement.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem('crumb-color-theme', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const changeColorTheme = (theme) => {
    setColorTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colorTheme, changeColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
