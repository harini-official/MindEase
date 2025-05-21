import { useState, useEffect, useCallback } from "react";

export const useBreathing = (initialDuration = 120) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialDuration); // 2 minutes in seconds
  const [breathePhase, setBreathePhase] = useState("Breathe In");
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [phaseIntervalId, setPhaseIntervalId] = useState<number | null>(null);

  const startBreathingExercise = useCallback(() => {
    setIsBreathing(true);
    setBreathePhase("Breathe In");
    setTimeRemaining(initialDuration);
    
    // Set up phase changing (inhale/exhale) every 4 seconds
    const phaseInterval = window.setInterval(() => {
      setBreathePhase(prevPhase => 
        prevPhase === "Breathe In" ? "Breathe Out" : "Breathe In"
      );
    }, 4000);
    
    // Set up time countdown every second
    const countdownInterval = window.setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          // Time's up, clean up intervals
          clearInterval(phaseInterval);
          clearInterval(countdownInterval);
          setIsBreathing(false);
          setPhaseIntervalId(null);
          setIntervalId(null);
          return initialDuration;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setPhaseIntervalId(phaseInterval);
    setIntervalId(countdownInterval);
  }, [initialDuration]);

  const stopBreathingExercise = useCallback(() => {
    setIsBreathing(false);
    setBreathePhase("Breathe In");
    setTimeRemaining(initialDuration);
    
    // Clear intervals
    if (phaseIntervalId !== null) {
      clearInterval(phaseIntervalId);
      setPhaseIntervalId(null);
    }
    
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [initialDuration, intervalId, phaseIntervalId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalId !== null) clearInterval(intervalId);
      if (phaseIntervalId !== null) clearInterval(phaseIntervalId);
    };
  }, [intervalId, phaseIntervalId]);

  return {
    isBreathing,
    timeRemaining,
    breathePhase,
    startBreathingExercise,
    stopBreathingExercise
  };
};
