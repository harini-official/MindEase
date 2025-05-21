import { Link } from "wouter";
// Removed theme context import

const Hero = () => {
  // No longer need theme reference
  
  return (
    <section className="bg-gradient-to-r from-primary-light via-secondary-light to-accent-light dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-poppins font-bold text-neutral-800 dark:text-white mb-4 leading-tight">
              Your mental wellness journey starts here
            </h1>
            <p className="text-xl text-neutral-700 dark:text-neutral-300 mb-8">
              Supporting students through stress, motivation, and academic balance with mindful resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#motivation" 
                className="bg-primary-dark hover:bg-primary text-white font-medium py-3 px-6 rounded-lg transition duration-300 text-center"
              >
                Get Started
              </a>
              <a 
                href="#relax" 
                className="bg-white dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-primary-dark dark:text-white font-medium py-3 px-6 rounded-lg transition duration-300 text-center"
              >
                Try Breathe Exercise
              </a>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Student meditating outdoors" 
              className="rounded-xl shadow-medium w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
