import { tierDescriptions, tierColors } from "@/lib/movies";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark } from "lucide-react";

interface TierFilterProps {
  selectedTier: number | null;
  onTierChange: (tier: number | null) => void;
  isWatchlistSelected: boolean;
  onWatchlistChange: (selected: boolean) => void;
}

export function TierFilter({ 
  selectedTier, 
  onTierChange, 
  isWatchlistSelected, 
  onWatchlistChange 
}: TierFilterProps) {
  // Get tiers and sort them in descending order (6 to 1)
  const tiers = Object.keys(tierDescriptions)
    .map(Number)
    .sort((a, b) => b - a);
  
  // Extract color classes for each tier
  const getColorClasses = (tier: number) => {
    const colorClass = tierColors[tier];
    if (!colorClass) return "";
    
    // Extract just the text color from the full class string
    const textColorMatch = colorClass.match(/text-[a-z]+-\d+/);
    const textColor = textColorMatch ? textColorMatch[0] : "";
    
    // Extract just the border color from the full class string
    const borderColorMatch = colorClass.match(/border-[a-z]+-\d+/);
    const borderColor = borderColorMatch ? borderColorMatch[0] : "";
    
    return `${textColor} border-l-4 ${borderColor} pl-2`;
  };
  
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-3">Filter by Tier</h2>
      <Tabs 
        defaultValue={selectedTier?.toString() || "all"} 
        orientation="vertical"
        onValueChange={(value) => {
          // Reset watchlist selection when selecting a tier
          if (isWatchlistSelected) {
            onWatchlistChange(false);
          }
          
          if (value === "all") {
            onTierChange(null);
          } else {
            onTierChange(Number(value));
          }
        }}
        className="w-full"
      >
        <TabsList className="flex flex-col h-auto space-y-1 bg-transparent w-full">
          <TabsTrigger 
            value="all" 
            className="justify-start px-3 py-2 text-sm w-full data-[state=active]:bg-gray-200 text-left"
          >
            All Tiers
          </TabsTrigger>
          {tiers.map((tier) => (
            <TabsTrigger 
              key={tier} 
              value={tier.toString()} 
              className={`justify-start px-3 py-2 text-sm w-full data-[state=active]:bg-gray-200 text-left ${getColorClasses(tier)}`}
            >
              <div className="flex flex-col items-start w-full overflow-hidden">
                <span className="font-medium truncate w-full">Tier {tier}</span>
                <span className="text-sm truncate w-full">{tierDescriptions[tier].split(':')[0]}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Watchlist section - separate from tier filters */}
      <div className="mt-6 border-t pt-4">
        <button 
          className={`flex items-center gap-2 px-3 py-2 w-full text-left rounded-md transition-colors ${
            isWatchlistSelected ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          onClick={() => {
            // Toggle watchlist selection
            const newState = !isWatchlistSelected;
            onWatchlistChange(newState);
            
            // Reset tier selection when selecting watchlist
            if (newState && selectedTier !== null) {
              onTierChange(null);
            }
          }}
        >
          <Bookmark className={`h-4 w-4 ${isWatchlistSelected ? 'fill-blue-500 text-blue-500' : ''}`} />
          <span className="font-medium">Watchlist</span>
        </button>
      </div>
    </div>
  );
} 