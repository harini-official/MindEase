import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 dark:bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-poppins font-semibold mb-4">MindEase</h3>
            <p className="text-neutral-300 mb-4">Supporting students' mental wellness and academic balance.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-poppins font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#motivation" className="text-neutral-300 hover:text-white transition">Daily Motivation</a></li>
              <li><a href="#blog" className="text-neutral-300 hover:text-white transition">Mindful Blog</a></li>
              <li><a href="#planner" className="text-neutral-300 hover:text-white transition">Planners & Templates</a></li>
              <li><a href="#relax" className="text-neutral-300 hover:text-white transition">Breathe & Relax</a></li>
              <li><a href="#audio" className="text-neutral-300 hover:text-white transition">Audio Library</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-poppins font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-300 hover:text-white transition">Mental Health Resources</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition">Study Tips Blog</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition">About Our Mission</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition">Support Services</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition">Success Stories</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-poppins font-semibold mb-4">Newsletter</h4>
            <p className="text-neutral-300 mb-4">Subscribe for weekly wellness tips and updates.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-primary text-neutral-800 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400"
              />
              <button className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-r-lg transition">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} MindEase. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-neutral-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-neutral-400 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-neutral-400 hover:text-white text-sm">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
