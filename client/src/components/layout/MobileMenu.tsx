import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onItemClick: () => void;
}

const MobileMenu = ({ isOpen, onItemClick }: MobileMenuProps) => {
  return (
    <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-neutral-900 w-full pb-4 px-4 animate-fadeIn`}>
      <div className="flex flex-col space-y-3">
        <a 
          href="#motivation" 
          className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition py-2 border-b border-neutral-200 dark:border-neutral-700"
          onClick={onItemClick}
        >
          Motivation
        </a>
        <a 
          href="#blog" 
          className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition py-2 border-b border-neutral-200 dark:border-neutral-700"
          onClick={onItemClick}
        >
          Blog
        </a>
        <a 
          href="#planner" 
          className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition py-2 border-b border-neutral-200 dark:border-neutral-700"
          onClick={onItemClick}
        >
          Planners
        </a>
        <a 
          href="#relax" 
          className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition py-2 border-b border-neutral-200 dark:border-neutral-700"
          onClick={onItemClick}
        >
          Relax
        </a>
        <a 
          href="#audio" 
          className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition py-2 border-b border-neutral-200 dark:border-neutral-700"
          onClick={onItemClick}
        >
          Audio
        </a>
        <a 
          href="#testimonials" 
          className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-primary-dark dark:hover:text-primary-light transition py-2 border-b border-neutral-200 dark:border-neutral-700"
          onClick={onItemClick}
        >
          Testimonials
        </a>
        <Link 
          href="/chat" 
          className="font-medium text-primary-dark dark:text-primary-light hover:text-primary hover:underline transition py-2"
          onClick={onItemClick}
        >
          Chat Room
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
