"use client";

import { useState, useEffect } from "react";
import { movies, Movie } from "@/lib/movies";
import { MovieGrid } from "@/components/movie-grid";
import { TierFilter } from "@/components/tier-filter";
import { SearchBar } from "@/components/search-bar";
import { MovieDetail } from "@/components/movie-detail";

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isWatchlistSelected, setIsWatchlistSelected] = useState(false);
  const [bookmarkedMovies, setBookmarkedMovies] = useState<Set<number>>(new Set());
  
  // Load bookmarked movies from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bookmarked = new Set<number>();
      
      // Check each movie if it's bookmarked
      movies.forEach(movie => {
        const isBookmarked = localStorage.getItem(`bookmarked-${movie.ranking}`) === 'true';
        if (isBookmarked) {
          bookmarked.add(movie.ranking);
        }
      });
      
      setBookmarkedMovies(bookmarked);
    }
  }, []);
  
  // Handle bookmark changes
  const handleBookmarkChange = (movieId: number, isBookmarked: boolean) => {
    setBookmarkedMovies(prev => {
      const updated = new Set(prev);
      if (isBookmarked) {
        updated.add(movieId);
      } else {
        updated.delete(movieId);
      }
      return updated;
    });
  };

  // Filter movies based on selected tier, watchlist, and search query
  const filteredMovies = movies.filter((movie: Movie) => {
    // Filter by watchlist
    if (isWatchlistSelected) {
      if (!bookmarkedMovies.has(movie.ranking)) {
        return false;
      }
    }
    // Filter by tier
    else if (selectedTier !== null && movie.tier !== selectedTier) {
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

  // Determine the section title based on filters
  const getSectionTitle = () => {
    if (isWatchlistSelected) {
      return "Your Watchlist";
    } else if (selectedTier !== null) {
      return `Tier ${selectedTier}: ${movies.find(m => m.tier === selectedTier)?.tier_description || ''}`;
    } else if (searchQuery) {
      return `Search Results: "${searchQuery}"`;
    } else {
      return "All Movies";
    }
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
        
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
          <div className="md:col-span-1">
            <TierFilter 
              selectedTier={selectedTier} 
              onTierChange={setSelectedTier}
              isWatchlistSelected={isWatchlistSelected}
              onWatchlistChange={setIsWatchlistSelected}
            />
          </div>
          
          <div className="md:col-span-3">
            <h2 
              key={`${isWatchlistSelected ? 'watchlist' : ''}${selectedTier || ''}${searchQuery}`}
              className="text-2xl font-bold mb-6 opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]"
            >
              {getSectionTitle()}
            </h2>
            
            {filteredMovies.length > 0 ? (
              <MovieGrid 
                movies={filteredMovies} 
                onMovieClick={setSelectedMovie}
                onBookmarkChange={handleBookmarkChange}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {isWatchlistSelected 
                    ? "Your watchlist is empty. Bookmark some movies to add them here."
                    : "No movies found matching your criteria."}
                </p>
              </div>
            )}
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