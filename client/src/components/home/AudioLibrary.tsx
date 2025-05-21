import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AudioResource } from "@/lib/types";
import { useContext } from "react";
import { ThemeContext } from "../../App";

const CATEGORIES = ["All", "Focus", "Meditation", "Sleep", "Nature Sounds"];

const AudioLibrary = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [playing, setPlaying] = useState<number | null>(null);
  const { theme } = useContext(ThemeContext);
  const audioRefs = useRef<Record<number, HTMLAudioElement | null>>({});
  
  const { data: resources, isLoading } = useQuery<AudioResource[]>({
    queryKey: ['/api/audio-resources'],
  });

  const filteredResources = resources?.filter(resource => 
    activeCategory === "All" || resource.category === activeCategory
  );

  // Create sample audio URLs if needed
  useEffect(() => {
    if (resources && resources.length > 0) {
      resources.forEach(resource => {
        // Create dummy audio files if they don't exist or check URLs
        if (resource.audioUrl.startsWith('/audio/')) {
          // This is just logging to make sure we know which URLs we're dealing with
          console.log(`Audio resource ${resource.id} has URL: ${resource.audioUrl}`);
        }
      });
    }
  }, [resources]);

  const handlePlayToggle = (id: number) => {
    if (playing === id) {
      setPlaying(null);
      if (audioRefs.current[id]) {
        audioRefs.current[id]?.pause();
      }
    } else {
      // Stop any currently playing audio
      if (playing !== null && audioRefs.current[playing]) {
        audioRefs.current[playing]?.pause();
      }
      
      setPlaying(id);
      if (audioRefs.current[id]) {
        audioRefs.current[id]?.play().catch((e) => {
          console.error("Audio playback failed:", e);
          setPlaying(null);
        });
      }
    }
  };

  // Register audio elements with refs
  const registerAudioRef = (id: number, element: HTMLAudioElement | null) => {
    if (element) {
      audioRefs.current[id] = element;
    }
  };

  return (
    <section id="audio" className="py-16 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-poppins font-semibold text-neutral-800 dark:text-white mb-3">Mindful Audio Library</h2>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">Listen to guided meditations, calming sounds, and focus music.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              variant={activeCategory === category ? "default" : "outline"}
              className={activeCategory === category 
                ? "bg-primary text-white" 
                : "bg-white dark:bg-neutral-800 hover:bg-primary hover:text-white dark:text-neutral-300 dark:hover:bg-primary dark:hover:text-white text-neutral-700"}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-soft overflow-hidden">
                <div className="relative">
                  <Skeleton className="w-full h-48 dark:bg-neutral-700" />
                  <div className="absolute inset-0 bg-neutral-900/30 flex items-center justify-center">
                    <Skeleton className="w-14 h-14 rounded-full dark:bg-neutral-600" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-20 rounded-full dark:bg-neutral-700" />
                    <Skeleton className="h-5 w-16 rounded-full dark:bg-neutral-700" />
                  </div>
                  <Skeleton className="h-7 w-4/5 mb-2 dark:bg-neutral-700" />
                  <Skeleton className="h-4 w-full mb-4 dark:bg-neutral-700" />
                  <Skeleton className="h-12 w-full rounded-md dark:bg-neutral-700" />
                </div>
              </div>
            ))
          ) : !filteredResources || filteredResources.length === 0 ? (
            <div className="col-span-3 text-center py-10">
              <p className="text-neutral-600 dark:text-neutral-300">
                {resources && resources.length > 0 
                  ? `No audio resources found in the "${activeCategory}" category.` 
                  : "No audio resources available. Check back soon!"}
              </p>
            </div>
          ) : (
            filteredResources.map((resource) => (
              <div key={resource.id} className="bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-neutral-900/30 flex items-center justify-center">
                    <button 
                      onClick={() => handlePlayToggle(resource.id)}
                      className="w-14 h-14 bg-white/80 hover:bg-white dark:bg-neutral-800/80 dark:hover:bg-neutral-800 rounded-full flex items-center justify-center transition"
                      aria-label={playing === resource.id ? 'Pause' : 'Play'}
                    >
                      <i className={`fas fa-${playing === resource.id ? 'pause' : 'play'} text-primary-dark dark:text-primary-light text-xl`}></i>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      resource.category === "Meditation" ? "bg-primary-light text-primary-dark dark:bg-primary-dark dark:text-primary-light" :
                      resource.category === "Sleep" ? "bg-secondary-light text-secondary-dark dark:bg-secondary-dark dark:text-secondary-light" :
                      resource.category === "Focus" ? "bg-accent-light text-accent-dark dark:bg-accent-dark dark:text-accent-light" :
                      "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
                    }`}>
                      {resource.category}
                    </span>
                    <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {resource.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-neutral-800 dark:text-white mb-2">{resource.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">{resource.description}</p>
                  <audio 
                    ref={(el) => registerAudioRef(resource.id, el)}
                    id={`audio-${resource.id}`}
                    className="w-full audio-player" 
                    controls
                    preload="auto"
                    onEnded={() => setPlaying(null)}
                    onPause={() => {
                      if (playing === resource.id) {
                        setPlaying(null);
                      }
                    }}
                  >
                    <source src={resource.audioUrl} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Button className="inline-flex items-center bg-primary hover:bg-primary-dark text-white">
            Browse Full Library
            <i className="fas fa-headphones ml-2"></i>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AudioLibrary;
