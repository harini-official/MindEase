import { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "../../App";

export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  // Force apply the current theme when the component mounts
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    // Determine what the new theme should be (opposite of current)
    const newTheme = theme === "light" ? "dark" : "light";
    
    // Log for debugging
    console.log(`Toggling theme from ${theme} to ${newTheme}`);
    
    // Update state
    setTheme(newTheme);
    
    // Force DOM update immediately
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Store preference
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme} 
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-transparent hover:text-primary-dark dark:hover:text-primary-light"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}