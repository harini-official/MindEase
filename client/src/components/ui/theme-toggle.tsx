import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  // Simple direct implementation without context
  const isDarkMode = document.documentElement.classList.contains("dark");
  
  const toggleTheme = () => {
    const htmlElement = document.documentElement;
    
    if (htmlElement.classList.contains("dark")) {
      // Currently dark, switch to light
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      // Currently light, switch to dark
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
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