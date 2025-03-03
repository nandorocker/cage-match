import { Movie } from "@/lib/movies";
import { MovieCard } from "@/components/movie-card";
import { AnimatePresence, motion } from "framer-motion";

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onBookmarkChange?: (movieId: number, isBookmarked: boolean) => void;
}

export function MovieGrid({ movies, onMovieClick, onBookmarkChange }: MovieGridProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={movies.map(m => m.ranking).join(',')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {movies.map((movie) => (
          <div 
            key={movie.ranking} 
            className="h-full cursor-pointer"
            onClick={() => onMovieClick(movie)}
          >
            <MovieCard 
              movie={movie} 
              onBookmarkChange={onBookmarkChange}
            />
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
} 