import { Movie, tierColors, tierDescriptions } from "@/lib/movies";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Bookmark, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  movie: Movie;
  onBookmarkChange?: (movieId: number, isBookmarked: boolean) => void;
  isBookmarked?: boolean; // Add prop to receive bookmark state from parent
}

export function MovieCard({ movie, onBookmarkChange, isBookmarked: externalIsBookmarked }: MovieCardProps) {
  const tierColorClass = tierColors[movie.tier] || "bg-gray-100 text-gray-800 border-gray-300";
  const textColorClass = tierColorClass.split(' ')[1] || "text-gray-800";
  
  // Initialize with the external state if provided, otherwise false
  const [isBookmarked, setIsBookmarked] = useState<boolean>(externalIsBookmarked || false);
  
  // Update internal state when external state changes
  useEffect(() => {
    if (externalIsBookmarked !== undefined) {
      setIsBookmarked(externalIsBookmarked);
    }
  }, [externalIsBookmarked]);
  
  // Handle bookmark click
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    const newState = !isBookmarked;
    
    // Update internal state
    setIsBookmarked(newState);
    
    // Call the callback if provided
    if (onBookmarkChange) {
      onBookmarkChange(movie.ranking, newState);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`bookmarked-${movie.ranking}`, newState.toString());
      }
    }
  };
  
  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    // Share functionality - for now just copy to clipboard
    const shareText = `Check out "${movie.title}" - Ranked #${movie.ranking} in Nicolas Cage movies!`;
    navigator.clipboard.writeText(shareText)
      .then(() => {
        alert("Copied to clipboard: " + shareText);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  return (
    <Card className="h-full flex flex-col relative">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-bold">{movie.title}</CardTitle>
          <Badge variant="outline" className={`ml-2 flex-shrink-0 ${tierColorClass}`}>
            #{movie.ranking}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 flex-wrap mt-2">
          {movie.year ? (
            <span className="flex items-center gap-1">
              <Film className="h-4 w-4" />
              <span>{movie.year}</span>
            </span>
          ) : (
            <span className="text-gray-400">Year unknown</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-5">{movie.description}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center w-full">
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${textColorClass}`}>
            Tier {movie.tier}:
          </span>
          <span className={`text-sm ${textColorClass}`}>
            {tierDescriptions[movie.tier]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleBookmarkClick}
          >
            <Bookmark 
              className={`h-4 w-4 ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} 
            />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={handleShareClick}
          >
            <Share2 className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 