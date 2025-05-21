import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Testimonial } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  const getVisibleSlides = () => {
    if (!testimonials) return [];
    
    const slidesToShow = isMobile ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const startIndex = currentIndex;
    const endIndex = Math.min(startIndex + slidesToShow, testimonials.length);
    
    return testimonials.slice(startIndex, endIndex);
  };

  const handlePrev = () => {
    if (testimonials && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (testimonials && currentIndex < testimonials.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDotClick = (index: number) => {
    if (testimonials) {
      setCurrentIndex(index);
    }
  };

  const visibleSlides = getVisibleSlides();
  const maxDots = testimonials ? testimonials.length : 3;

  return (
    <section id="testimonials" className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-poppins font-semibold text-neutral-800 mb-3">Student Voices</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Hear from students who have found balance through MindEase.</p>
        </div>
        
        <div className="relative">
          <div className="testimonial-slider overflow-hidden">
            <div 
              className="flex testimonial-track transition-transform duration-300"
              style={{
                transform: `translateX(-${currentIndex * (100 / (isMobile ? 1 : window.innerWidth < 1024 ? 2 : 3))}%)`,
              }}
            >
              {isLoading ? (
                // Loading skeleton
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className={`testimonial-slide w-full ${isMobile ? '' : 'md:w-1/2 lg:w-1/3'} flex-shrink-0 px-4`}>
                    <div className="bg-white rounded-xl shadow-soft p-6 h-full">
                      <div className="flex items-center mb-4">
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-24 w-full mb-6" />
                      <div className="flex items-center">
                        <Skeleton className="w-12 h-12 rounded-full mr-4" />
                        <div>
                          <Skeleton className="h-5 w-20 mb-1" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : !testimonials || testimonials.length === 0 ? (
                <div className="testimonial-slide w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl shadow-soft p-6 h-full text-center">
                    <p className="text-neutral-600">No testimonials available yet. Be the first to share your experience!</p>
                  </div>
                </div>
              ) : (
                testimonials.map((testimonial) => (
                  <div key={testimonial.id} className={`testimonial-slide w-full ${isMobile ? '' : 'md:w-1/2 lg:w-1/3'} flex-shrink-0 px-4`}>
                    <div className="bg-white rounded-xl shadow-soft p-6 h-full">
                      <div className="flex items-center mb-4">
                        <div className="text-yellow-400 flex">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`fas fa-${i < testimonial.rating ? 'star' : i === Math.floor(testimonial.rating) && testimonial.rating % 1 !== 0 ? 'star-half-alt' : 'star'}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-700 mb-6 italic">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-neutral-300 rounded-full overflow-hidden mr-4">
                          {/* Placeholder for student profile image */}
                          <div className={`w-full h-full ${
                            testimonial.id % 3 === 0 ? "bg-primary-light" :
                            testimonial.id % 3 === 1 ? "bg-accent-light" :
                            "bg-secondary-light"
                          } flex items-center justify-center`}>
                            <span className={`${
                              testimonial.id % 3 === 0 ? "text-primary-dark" :
                              testimonial.id % 3 === 1 ? "text-accent-dark" :
                              "text-secondary-dark"
                            } font-medium`}>
                              {testimonial.studentName.split(' ').map(name => name[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-poppins font-medium text-neutral-800">{testimonial.studentName}</h4>
                          <p className="text-sm text-neutral-600">{testimonial.studentTitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <button 
            className="absolute top-1/2 -translate-y-1/2 left-0 md:left-4 bg-white w-10 h-10 rounded-full shadow-medium flex items-center justify-center text-primary-dark hover:bg-primary-light transition-colors"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isLoading || !testimonials}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button 
            className="absolute top-1/2 -translate-y-1/2 right-0 md:right-4 bg-white w-10 h-10 rounded-full shadow-medium flex items-center justify-center text-primary-dark hover:bg-primary-light transition-colors"
            onClick={handleNext}
            disabled={!testimonials || currentIndex >= testimonials.length - (isMobile ? 1 : window.innerWidth < 1024 ? 2 : 3) || isLoading}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {[...Array(maxDots)].map((_, index) => (
              <button 
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-primary' : 'bg-neutral-300 hover:bg-primary-light'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
