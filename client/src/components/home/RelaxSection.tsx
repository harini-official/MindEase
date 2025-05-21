import { Button } from "@/components/ui/button";
import { useBreathing } from "@/hooks/use-breathing";

const RelaxSection = () => {
  const { 
    isBreathing, 
    timeRemaining, 
    breathePhase, 
    startBreathingExercise, 
    stopBreathingExercise 
  } = useBreathing();

  const handleToggleExercise = () => {
    if (isBreathing) {
      stopBreathingExercise();
    } else {
      startBreathingExercise();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <section id="relax" className="py-16 bg-gradient-to-r from-primary-light/30 to-accent-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-poppins font-semibold text-neutral-800 mb-3">Breathe & Relax</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Take a moment to calm your mind with these relaxation exercises.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-medium p-8 h-full">
              <h3 className="text-xl font-poppins font-semibold text-neutral-800 mb-4">Guided Breathing Exercise</h3>
              <p className="text-neutral-600 mb-6">Follow the circle as it expands and contracts. Breathe in as it grows, breathe out as it shrinks.</p>
              
              {/* Interactive breathing circle */}
              <div className="flex justify-center items-center h-64">
                <div 
                  className={`w-32 h-32 bg-primary-light rounded-full flex items-center justify-center text-primary-dark transition-all duration-1000 ease-in-out ${isBreathing ? "breathing-circle" : ""}`}
                  style={{
                    animation: isBreathing ? 'breath 8s ease-in-out infinite' : 'none',
                  }}
                >
                  <span className="text-lg font-medium">{breathePhase}</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-neutral-700 mb-2">Time Remaining: <span>{formatTime(timeRemaining)}</span></p>
                <Button 
                  id="start-breathing" 
                  onClick={handleToggleExercise}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  {isBreathing ? 'Stop Exercise' : 'Start Exercise'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl shadow-medium p-8 h-full">
              <h3 className="text-xl font-poppins font-semibold text-neutral-800 mb-4">Quick Relaxation Techniques</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-secondary-light rounded-full p-3 mr-4">
                    <i className="fas fa-brain text-secondary-dark"></i>
                  </div>
                  <div>
                    <h4 className="font-poppins font-medium text-neutral-800 mb-1">5-4-3-2-1 Grounding</h4>
                    <p className="text-neutral-600">Identify 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary-light rounded-full p-3 mr-4">
                    <i className="fas fa-cloud text-secondary-dark"></i>
                  </div>
                  <div>
                    <h4 className="font-poppins font-medium text-neutral-800 mb-1">Box Breathing</h4>
                    <p className="text-neutral-600">Inhale for 4 counts, hold for 4 counts, exhale for 4 counts, hold for 4 counts. Repeat.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-secondary-light rounded-full p-3 mr-4">
                    <i className="fas fa-hand-peace text-secondary-dark"></i>
                  </div>
                  <div>
                    <h4 className="font-poppins font-medium text-neutral-800 mb-1">Progressive Muscle Relaxation</h4>
                    <p className="text-neutral-600">Tense each muscle group for 5 seconds, then release and relax for 30 seconds. Start from your toes and work up.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelaxSection;
