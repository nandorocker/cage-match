import { Movie } from "@/lib/movies";
import { MovieCard } from "@/components/movie-card";

interface MovieGridProps {
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

export function MovieGrid({ movies, onMovieClick }: MovieGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div 
          key={movie.ranking} 
          className="h-full cursor-pointer" 
          onClick={() => onMovieClick(movie)}
        >
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
} 