import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Test audio files
const AUDIO_FILES = [
  { id: 1, name: "Forest Meditation", path: "/audio/forest-meditation.mp3" },
  { id: 2, name: "Ocean Waves", path: "/audio/ocean-waves.mp3" },
  { id: 3, name: "Deep Focus", path: "/audio/deep-focus.mp3" },
  { id: 4, name: "Study Piano", path: "/audio/study-piano.mp3" },
  { id: 5, name: "Rainfall", path: "/audio/rainfall.mp3" }
];

export function AudioTest() {
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRefs = useRef<Record<number, HTMLAudioElement>>({});
  
  const handlePlay = (id: number) => {
    // If already playing this track, pause it
    if (playing === id) {
      audioRefs.current[id]?.pause();
      setPlaying(null);
      return;
    }
    
    // Pause any currently playing audio
    if (playing !== null && audioRefs.current[playing]) {
      audioRefs.current[playing]?.pause();
    }
    
    // Play the new track
    try {
      console.log(`Attempting to play audio ${id}`);
      const audio = audioRefs.current[id];
      if (audio) {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlaying(id);
              console.log(`Audio ${id} playing successfully`);
            })
            .catch(error => {
              console.error(`Error playing audio ${id}:`, error);
            });
        }
      }
    } catch (error) {
      console.error(`Failed to play audio ${id}:`, error);
    }
  };
  
  return (
    <section className="py-12 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-neutral-800 dark:text-white">
          Audio Test Page
        </h2>
        
        <div className="max-w-md mx-auto space-y-4">
          {AUDIO_FILES.map(file => (
            <Card key={file.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{file.name}</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePlay(file.id)}
                  >
                    {playing === file.id ? "Pause" : "Play"}
                  </Button>
                </div>
                
                <audio 
                  ref={el => {
                    if (el) audioRefs.current[file.id] = el;
                  }}
                  src={file.path}
                  preload="auto"
                  onEnded={() => setPlaying(null)}
                  className="w-full"
                  controls
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AudioTest;