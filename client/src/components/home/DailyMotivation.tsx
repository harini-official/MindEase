import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MotivationQuote } from "@/lib/types";

const DailyMotivation = () => {
  const [displayedQuotes, setDisplayedQuotes] = useState<MotivationQuote[]>([]);

  const { data: quotes, isLoading, refetch } = useQuery<MotivationQuote[]>({
    queryKey: ['/api/motivation-quotes'],
  });

  useEffect(() => {
    if (quotes && quotes.length > 0) {
      // Randomly select 3 quotes to display
      const randomQuotes = [...quotes].sort(() => 0.5 - Math.random()).slice(0, 3);
      setDisplayedQuotes(randomQuotes);
    }
  }, [quotes]);

  const handleRefreshQuotes = () => {
    if (quotes && quotes.length > 0) {
      const randomQuotes = [...quotes].sort(() => 0.5 - Math.random()).slice(0, 3);
      setDisplayedQuotes(randomQuotes);
    }
  };

  return (
    <section id="motivation" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-poppins font-semibold text-neutral-800 mb-3">Daily Motivation Wall</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Start your day with inspiring quotes, calming images, and uplifting messages.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-neutral-100 rounded-xl shadow-soft overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))
          ) : displayedQuotes.length === 0 ? (
            <div className="col-span-3 text-center py-10">
              <p className="text-neutral-600">No motivation quotes available. Check back soon!</p>
            </div>
          ) : (
            displayedQuotes.map((quote) => (
              <div key={quote.id} className="bg-neutral-100 rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-300">
                <img 
                  src={quote.imageUrl} 
                  alt="Motivational background" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <p className="text-lg font-poppins font-medium text-neutral-800 mb-2">
                    "{quote.quote}"
                  </p>
                  <p className="text-neutral-600 italic">— {quote.author}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-10">
          <Button 
            onClick={handleRefreshQuotes} 
            disabled={isLoading || !quotes || quotes.length === 0}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh Quotes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DailyMotivation;
