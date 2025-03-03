import { Movie, tierColors, tierDescriptions } from "@/lib/movies";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const tierColorClass = tierColors[movie.tier] || "bg-gray-100 text-gray-800 border-gray-300";
  const textColorClass = tierColorClass.split(' ')[1] || "text-gray-800";
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl font-bold">{movie.title}</CardTitle>
          <Badge variant="outline" className={`ml-2 flex-shrink-0 ${tierColorClass}`}>
            #{movie.ranking}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 flex-wrap mt-2">
          {movie.year ? (
            <div className="flex items-center gap-1">
              <Film className="h-4 w-4" />
              <span>{movie.year}</span>
            </div>
          ) : (
            <span className="text-gray-400">Year unknown</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-5">{movie.description}</p>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col items-start w-full">
        <div className="flex items-center gap-1">
          <span className={`text-sm font-medium ${textColorClass}`}>
            Tier {movie.tier}:
          </span>
          <span className={`text-sm ${textColorClass}`}>
            {tierDescriptions[movie.tier]}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
} 