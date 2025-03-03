"use client";

import { useState } from "react";
import { movies, Movie } from "@/lib/movies";
import { MovieGrid } from "@/components/movie-grid";
import { TierFilter } from "@/components/tier-filter";
import { SearchBar } from "@/components/search-bar";
import { MovieDetail } from "@/components/movie-detail";

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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
        
        <TierFilter selectedTier={selectedTier} onTierChange={setSelectedTier} />
        
        {filteredMovies.length > 0 ? (
          <MovieGrid 
            movies={filteredMovies} 
            onMovieClick={setSelectedMovie}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No movies found matching your criteria.</p>
          </div>
        )}
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