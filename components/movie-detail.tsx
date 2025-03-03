import { Movie, tierColors } from "@/lib/movies";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Film, Star, Award } from "lucide-react";

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
}

export function MovieDetail({ movie, onClose }: MovieDetailProps) {
  const tierColorClass = tierColors[movie.tier] || "bg-gray-100 text-gray-800 border-gray-300";
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{movie.title}</h2>
              <div className="flex items-center gap-3 mt-2">
                {movie.year && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Film className="h-4 w-4" />
                    <span>{movie.year}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-600">
                  <Star className="h-4 w-4" />
                  <span>Rank #{movie.ranking}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Award className="h-4 w-4" />
                  <Badge variant="outline" className={tierColorClass}>
                    Tier {movie.tier}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{movie.description}</p>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-500">{movie.tier_description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 