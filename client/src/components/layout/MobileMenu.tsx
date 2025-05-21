interface MobileMenuProps {
  isOpen: boolean;
  onItemClick: () => void;
}

const MobileMenu = ({ isOpen, onItemClick }: MobileMenuProps) => {
  return (
    <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white w-full pb-4 px-4 animate-fadeIn`}>
      <div className="flex flex-col space-y-3">
        <a 
          href="#motivation" 
          className="font-medium text-neutral-700 hover:text-primary-dark transition py-2 border-b border-neutral-200"
          onClick={onItemClick}
        >
          Motivation
        </a>
        <a 
          href="#blog" 
          className="font-medium text-neutral-700 hover:text-primary-dark transition py-2 border-b border-neutral-200"
          onClick={onItemClick}
        >
          Blog
        </a>
        <a 
          href="#planner" 
          className="font-medium text-neutral-700 hover:text-primary-dark transition py-2 border-b border-neutral-200"
          onClick={onItemClick}
        >
          Planners
        </a>
        <a 
          href="#relax" 
          className="font-medium text-neutral-700 hover:text-primary-dark transition py-2 border-b border-neutral-200"
          onClick={onItemClick}
        >
          Relax
        </a>
        <a 
          href="#audio" 
          className="font-medium text-neutral-700 hover:text-primary-dark transition py-2 border-b border-neutral-200"
          onClick={onItemClick}
        >
          Audio
        </a>
        <a 
          href="#testimonials" 
          className="font-medium text-neutral-700 hover:text-primary-dark transition py-2"
          onClick={onItemClick}
        >
          Testimonials
        </a>
      </div>
    </div>
  );
};

export default MobileMenu;
