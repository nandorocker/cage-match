import { Movie, tierColors } from "@/lib/movies";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const tierColorClass = tierColors[movie.tier] || "bg-gray-100 text-gray-800 border-gray-300";
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{movie.title}</CardTitle>
          <Badge variant="outline" className={`ml-2 ${tierColorClass}`}>
            Tier {movie.tier}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          {movie.year ? (
            <>
              <Film className="h-4 w-4" />
              <span>{movie.year}</span>
            </>
          ) : (
            <span className="text-gray-400">Year unknown</span>
          )}
          <span className="mx-2">•</span>
          <Star className="h-4 w-4" />
          <span>Rank #{movie.ranking}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-4">{movie.description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <p className="text-xs text-gray-500">{movie.tier_description}</p>
      </CardFooter>
    </Card>
  );
} 