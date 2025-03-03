"use client";

import { useState } from "react";
import { movies, Movie, tierDescriptions } from "@/lib/movies";
import { MovieGrid } from "@/components/movie-grid";
import { TierFilter } from "@/components/tier-filter";
import { SearchBar } from "@/components/search-bar";
import { MovieDetail } from "@/components/movie-detail";
import { ArrowUpDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [sortAscending, setSortAscending] = useState(false); // Default to worst to best (descending)

  // Filter movies based on selected tier and search query
  const filteredMovies = movies.filter((movie: Movie) => {
    // Filter by tier
    if (selectedTier !== null && movie.tier !== selectedTier) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        movie.title.toLowerCase().includes(query) ||
        (movie.description && movie.description.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Sort movies based on the current sort direction
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortAscending) {
      // Best to worst (ascending by ranking)
      return a.ranking - b.ranking;
    } else {
      // Worst to best (descending by ranking)
      return b.ranking - a.ranking;
    }
  });

  // Get the title for the current view
  const getContentTitle = () => {
    if (selectedTier !== null) {
      return `Tier ${selectedTier}: ${tierDescriptions[selectedTier]}`;
    }
    if (searchQuery) {
      return `Search results for "${searchQuery}"`;
    }
    return "All Nicolas Cage Movies";
  };

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Nicolas Cage Movies</h1>
          <p className="text-gray-600">
            Explore all {movies.length} Nicolas Cage movies, ranked from best to worst.
          </p>
        </header>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="sticky top-6 space-y-6 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-hidden">
              <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
              <TierFilter selectedTier={selectedTier} onTierChange={setSelectedTier} />
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="sticky top-0 z-10 pt-4 pb-3 bg-white mb-4">
              <div className="flex justify-between items-center">
                <AnimatePresence mode="wait">
                  <motion.h2 
                    key={`title-${selectedTier !== null ? `tier-${selectedTier}` : 'all-tiers'}-search-${searchQuery}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-bold"
                  >
                    {getContentTitle()}
                  </motion.h2>
                </AnimatePresence>
                
                <button 
                  onClick={() => setSortAscending(!sortAscending)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={sortAscending ? "best-to-worst" : "worst-to-best"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {sortAscending ? "Best to Worst" : "Worst to Best"}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {sortedMovies.length > 0 ? (
                <motion.div
                  key={`content-${selectedTier !== null ? `tier-${selectedTier}` : 'all-tiers'}-search-${searchQuery}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MovieGrid 
                    movies={sortedMovies} 
                    onMovieClick={setSelectedMovie}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <p className="text-gray-500">No movies found matching your criteria.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {selectedMovie && (
        <MovieDetail 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </main>
  );
}
