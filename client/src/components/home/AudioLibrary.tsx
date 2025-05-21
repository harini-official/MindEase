import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AudioResource } from "@/lib/types";

const CATEGORIES = ["All", "Focus", "Meditation", "Sleep", "Nature Sounds"];

const AudioLibrary = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [playing, setPlaying] = useState<number | null>(null);
  
  const { data: resources, isLoading } = useQuery<AudioResource[]>({
    queryKey: ['/api/audio-resources'],
  });

  const filteredResources = resources?.filter(resource => 
    activeCategory === "All" || resource.category === activeCategory
  );

  const handlePlayToggle = (id: number) => {
    if (playing === id) {
      setPlaying(null);
      const audioElement = document.getElementById(`audio-${id}`) as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
      }
    } else {
      // Stop any currently playing audio
      if (playing !== null) {
        const currentAudioElement = document.getElementById(`audio-${playing}`) as HTMLAudioElement;
        if (currentAudioElement) {
          currentAudioElement.pause();
        }
      }
      
      setPlaying(id);
      const audioElement = document.getElementById(`audio-${id}`) as HTMLAudioElement;
      if (audioElement) {
        audioElement.play().catch((e) => {
          console.error("Audio playback failed:", e);
          setPlaying(null);
        });
      }
    }
  };

  return (
    <section id="audio" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-poppins font-semibold text-neutral-800 mb-3">Mindful Audio Library</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Listen to guided meditations, calming sounds, and focus music.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveCategory(category)}
              variant={activeCategory === category ? "default" : "outline"}
              className={activeCategory === category 
                ? "bg-primary text-white" 
                : "bg-white hover:bg-primary hover:text-white text-neutral-700"}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-neutral-100 rounded-xl shadow-soft overflow-hidden">
                <div className="relative">
                  <Skeleton className="w-full h-48" />
                  <div className="absolute inset-0 bg-neutral-900/30 flex items-center justify-center">
                    <Skeleton className="w-14 h-14 rounded-full" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-7 w-4/5 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              </div>
            ))
          ) : !filteredResources || filteredResources.length === 0 ? (
            <div className="col-span-3 text-center py-10">
              <p className="text-neutral-600">
                {resources && resources.length > 0 
                  ? `No audio resources found in the "${activeCategory}" category.` 
                  : "No audio resources available. Check back soon!"}
              </p>
            </div>
          ) : (
            filteredResources.map((resource) => (
              <div key={resource.id} className="bg-neutral-100 rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-neutral-900/30 flex items-center justify-center">
                    <button 
                      onClick={() => handlePlayToggle(resource.id)}
                      className="w-14 h-14 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition"
                    >
                      <i className={`fas fa-${playing === resource.id ? 'pause' : 'play'} text-primary-dark text-xl`}></i>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      resource.category === "Meditation" ? "bg-primary-light text-primary-dark" :
                      resource.category === "Sleep" ? "bg-secondary-light text-secondary-dark" :
                      resource.category === "Focus" ? "bg-accent-light text-accent-dark" :
                      "bg-neutral-200 text-neutral-700"
                    }`}>
                      {resource.category}
                    </span>
                    <span className="bg-neutral-200 text-neutral-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {resource.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-neutral-800 mb-2">{resource.title}</h3>
                  <p className="text-neutral-600 mb-4">{resource.description}</p>
                  <audio 
                    id={`audio-${resource.id}`}
                    className="w-full audio-player" 
                    controls
                    onEnded={() => setPlaying(null)}
                    onPause={() => {
                      if (playing === resource.id) {
                        setPlaying(null);
                      }
                    }}
                    src={resource.audioUrl}
                  >
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
