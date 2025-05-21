import { createContext, useState, useEffect, ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      // Check localStorage first
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
        return savedTheme;
      }
      // Fall back to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light"; // Default fallback for SSR
  });

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  };

  // Apply theme class to document element when theme changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Remove both classes first to ensure clean state
    htmlElement.classList.remove("light", "dark");
    
    // Add the current theme class
    htmlElement.classList.add(theme);
    
    // Save theme to localStorage
    localStorage.setItem("theme", theme);
    
    console.log(`Theme applied: ${theme}`);
  }, [theme]);

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};