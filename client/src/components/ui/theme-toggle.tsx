import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "../../App";

export function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
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