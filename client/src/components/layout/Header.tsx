import { useState } from "react";
import { Link } from "wouter";
import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-neutral-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-primary-dark dark:text-primary-light text-2xl font-poppins font-bold">
            Mind<span className="text-accent dark:text-accent-light">Ease</span>
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          <a href="#motivation" className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition">
            Motivation
          </a>
          <a href="#blog" className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition">
            Blog
          </a>
          <a href="#planner" className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition">
            Planners
          </a>
          <a href="#relax" className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition">
            Relax
          </a>
          <a href="#audio" className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition">
            Audio
          </a>
          <a href="#testimonials" className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition">
            Testimonials
          </a>
          <Link href="/chat" className="font-medium text-primary-dark dark:text-primary-light hover:text-primary hover:underline transition">
            Chat Room
          </Link>
        </nav>
        
        <div className="flex items-center space-x-2">
          {/* Theme Toggle Button */}
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-neutral-700 dark:text-neutral-300"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <MobileMenu isOpen={isMobileMenuOpen} onItemClick={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
