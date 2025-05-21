import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Initialize state on mount
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);
  
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      // Switch to dark
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      // Switch to light
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    console.log("Theme toggled to:", newMode ? "dark" : "light");
  };
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      className="rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-transparent hover:text-primary-dark dark:hover:text-primary-light"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}