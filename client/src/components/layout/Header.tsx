import { useState } from "react";
import { Link } from "wouter";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-primary-dark text-2xl font-poppins font-bold">
            Mind<span className="text-accent">Ease</span>
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          <a href="#motivation" className="font-medium text-neutral-700 hover:text-primary-dark transition">
            Motivation
          </a>
          <a href="#blog" className="font-medium text-neutral-700 hover:text-primary-dark transition">
            Blog
          </a>
          <a href="#planner" className="font-medium text-neutral-700 hover:text-primary-dark transition">
            Planners
          </a>
          <a href="#relax" className="font-medium text-neutral-700 hover:text-primary-dark transition">
            Relax
          </a>
          <a href="#audio" className="font-medium text-neutral-700 hover:text-primary-dark transition">
            Audio
          </a>
          <a href="#testimonials" className="font-medium text-neutral-700 hover:text-primary-dark transition">
            Testimonials
          </a>
        </nav>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-neutral-700"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
      
      {/* Mobile Nav */}
      <MobileMenu isOpen={isMobileMenuOpen} onItemClick={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
