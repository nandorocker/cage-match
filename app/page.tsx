"use client";

import { useState, useEffect } from "react";
import { movies, Movie, tierDescriptions } from "@/lib/movies";
import { MovieGrid } from "@/components/movie-grid";
import { TierFilter } from "@/components/tier-filter";
import { SearchBar } from "@/components/search-bar";
import { MovieDetail } from "@/components/movie-detail";
import { SettingsContent } from "@/components/settings-content";
import { ArrowUpDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [sortAscending, setSortAscending] = useState(false);
  const [isWatchlistSelected, setIsWatchlistSelected] = useState(false);
  const [bookmarkedMovies, setBookmarkedMovies] = useState<Set<number>>(new Set());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Handle global search
  const handleGlobalSearch = (query: string) => {
    setGlobalSearchQuery(query);
    if (query) {
      // When starting a global search, clear other section states
      setSelectedTier(null);
      setIsWatchlistSelected(false);
      setIsSettingsOpen(false);
    }
    // Reset section filter when changing search
    setSectionFilter("");
  };

  // Load state from URL on initial render
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash.slice(1);
    if (!hash) return;

    try {
      const params = new URLSearchParams(hash);
      
      // Load section state
      const section = params.get('section');
      if (section) {
        if (section === 'settings') {
          setIsSettingsOpen(true);
          setIsWatchlistSelected(false);
          setSelectedTier(null);
          setGlobalSearchQuery(""); // Clear search when changing sections
        } else if (section === 'watchlist') {
          setIsWatchlistSelected(true);
          setIsSettingsOpen(false);
          setSelectedTier(null);
          setGlobalSearchQuery(""); // Clear search when changing sections
        } else if (section.startsWith('tier-')) {
          const tier = Number(section.replace('tier-', ''));
          if (!isNaN(tier)) {
            setSelectedTier(tier);
            setIsWatchlistSelected(false);
            setIsSettingsOpen(false);
            setGlobalSearchQuery(""); // Clear search when changing sections
          }
        }
      }

      // Load search query - only if no section is specified
      const search = params.get('search');
      if (search && !section) {
        setGlobalSearchQuery(search);
        // Clear other section states when loading a search
        setSelectedTier(null);
        setIsWatchlistSelected(false);
        setIsSettingsOpen(false);
      }

      // Load sort direction
      const sort = params.get('sort');
      if (sort) {
        setSortAscending(sort === 'asc');
      }
    } catch (error) {
      console.error('Error parsing URL state:', error);
    }
  }, []);

  // Update URL when state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    
    // Set section parameter based on current state
    if (isSettingsOpen) {
      params.set('section', 'settings');
    } else if (isWatchlistSelected) {
      params.set('section', 'watchlist');
    } else if (selectedTier !== null) {
      params.set('section', `tier-${selectedTier}`);
    } else if (globalSearchQuery) {
      // Use search as its own section
      params.set('search', globalSearchQuery);
    }

    // Add sort parameter if needed
    if (sortAscending) {
      params.set('sort', 'asc');
    }

    // Update URL without triggering a page reload
    const newHash = params.toString();
    if (newHash) {
      window.history.replaceState(null, '', `#${newHash}`);
    } else {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [selectedTier, isWatchlistSelected, isSettingsOpen, globalSearchQuery, sortAscending]);
  
  // Load bookmarked movies from localStorage on initial render
  useEffect(() => {
    // This function should only run in the browser
    if (typeof window === 'undefined') return;
    
    console.log("Loading bookmarked movies from localStorage");
    const bookmarked = new Set<number>();
    
    // Check each movie if it's bookmarked
    movies.forEach(movie => {
      const isBookmarked = localStorage.getItem(`bookmarked-${movie.ranking}`);
      console.log(`Movie ${movie.ranking}: ${isBookmarked}`);
      if (isBookmarked === 'true') {
        bookmarked.add(movie.ranking);
      }
    });
    
    console.log(`Found ${bookmarked.size} bookmarked movies`);
    setBookmarkedMovies(bookmarked);
  }, []);
  
  // Handle bookmark changes
  const handleBookmarkChange = (movieId: number, isBookmarked: boolean) => {
    console.log(`Bookmark change: Movie ${movieId} is now ${isBookmarked ? 'bookmarked' : 'not bookmarked'}`);
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`bookmarked-${movieId}`, isBookmarked.toString());
    }
    
    // Update state
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
  
  // Handle reset watchlist
  const handleResetWatchlist = () => {
    // Clear all bookmarks from localStorage
    if (typeof window !== 'undefined') {
      movies.forEach(movie => {
        localStorage.removeItem(`bookmarked-${movie.ranking}`);
      });
    }
    
    // Clear bookmarked movies state
    setBookmarkedMovies(new Set());
  };

  // First apply global filters
  const globallyFilteredMovies = movies.filter((movie: Movie) => {
    // If there's a global search, it takes precedence over section filters
    if (globalSearchQuery) {
      const query = globalSearchQuery.toLowerCase();
      return (
        movie.title.toLowerCase().includes(query) ||
        (movie.description && movie.description.toLowerCase().includes(query))
      );
    }

    // Otherwise, apply section filters
    if (isWatchlistSelected) {
      return bookmarkedMovies.has(movie.ranking);
    } else if (selectedTier !== null) {
      return movie.tier === selectedTier;
    }
    
    return true;
  });

  // Then apply section filter if any
  const filteredMovies = globallyFilteredMovies.filter((movie: Movie) => {
    if (sectionFilter) {
      const query = sectionFilter.toLowerCase();
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
    if (isSettingsOpen) {
      return "Settings";
    } else if (isWatchlistSelected) {
      return "Your Watchlist";
    } else if (selectedTier !== null) {
      return `Tier ${selectedTier}: ${tierDescriptions[selectedTier]}`;
    } else if (globalSearchQuery) {
      return `Search results for "${globalSearchQuery}"`;
    }
    return "All Nicolas Cage Movies";
  };

  // Reset section filter when changing sections or search
  useEffect(() => {
    setSectionFilter("");
  }, [selectedTier, isWatchlistSelected, isSettingsOpen, globalSearchQuery]);

  // Debug output for bookmarked movies
  useEffect(() => {
    console.log(`Bookmarked movies count: ${bookmarkedMovies.size}`);
    console.log(`Bookmarked movies: ${Array.from(bookmarkedMovies).join(', ')}`);
  }, [bookmarkedMovies]);

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
              <SearchBar 
                searchQuery={globalSearchQuery} 
                onSearchChange={handleGlobalSearch}
                label="Global Search" 
                placeholder="Search all movies..."
              />
              <TierFilter 
                selectedTier={selectedTier} 
                onTierChange={setSelectedTier}
                isWatchlistSelected={isWatchlistSelected}
                onWatchlistChange={setIsWatchlistSelected}
                isSettingsOpen={isSettingsOpen}
                onSettingsClick={() => setIsSettingsOpen(true)}
                onCloseSettings={() => setIsSettingsOpen(false)}
              />
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="sticky top-0 z-10 pt-4 pb-3 bg-white mb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <AnimatePresence mode="wait">
                  <motion.h2 
                    key={`title-${isSettingsOpen ? 'settings' : isWatchlistSelected ? 'watchlist' : ''}${selectedTier !== null ? `tier-${selectedTier}` : 'all-tiers'}-search-${globalSearchQuery}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl font-bold"
                  >
                    {getContentTitle()}
                  </motion.h2>
                </AnimatePresence>
                
                {!isSettingsOpen && (
                  <div className="flex flex-col md:flex-row items-end md:items-center gap-3 w-full md:w-auto">
                    <SearchBar 
                      searchQuery={sectionFilter} 
                      onSearchChange={setSectionFilter} 
                      label="" 
                      placeholder="Filter current section..."
                      className="w-full md:w-auto flex justify-end"
                      compact={true}
                    />
                    
                    <button 
                      onClick={() => setSortAscending(!sortAscending)}
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors whitespace-nowrap"
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
                )}
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {isSettingsOpen ? (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SettingsContent 
                    onClose={() => setIsSettingsOpen(false)}
                    onResetWatchlist={handleResetWatchlist}
                  />
                </motion.div>
              ) : sortedMovies.length > 0 ? (
                <motion.div
                  key={`content-${isWatchlistSelected ? 'watchlist' : ''}${selectedTier !== null ? `tier-${selectedTier}` : 'all-tiers'}-search-${globalSearchQuery}-section-${sectionFilter}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MovieGrid 
                    movies={sortedMovies} 
                    onMovieClick={setSelectedMovie}
                    onBookmarkChange={handleBookmarkChange}
                    bookmarkedMovies={bookmarkedMovies}
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
                  <p className="text-gray-500">
                    {isWatchlistSelected 
                      ? "Your watchlist is empty. Bookmark some movies to add them here."
                      : "No movies found matching your criteria."}
                  </p>
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
