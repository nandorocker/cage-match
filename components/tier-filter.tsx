import { tierDescriptions, tierColors } from "@/lib/movies";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Settings } from "lucide-react";

interface TierFilterProps {
  selectedTier: number | null;
  onTierChange: (tier: number | null) => void;
  isWatchlistSelected: boolean;
  onWatchlistChange: (selected: boolean) => void;
  isSettingsOpen: boolean;
  onSettingsClick: () => void;
  onCloseSettings: () => void;
}

export function TierFilter({ 
  selectedTier, 
  onTierChange, 
  isWatchlistSelected, 
  onWatchlistChange,
  isSettingsOpen,
  onSettingsClick,
  onCloseSettings
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
  
  // Determine the current value for the tabs
  const getCurrentValue = () => {
    if (isSettingsOpen) return "settings";
    if (isWatchlistSelected) return "watchlist";
    return selectedTier?.toString() || "all";
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    // If we're in settings mode, close settings first
    if (isSettingsOpen) {
      onCloseSettings();
    }
    
    // Then handle the tab change
    if (value === "settings") {
      onSettingsClick();
    } else if (value === "watchlist") {
      onWatchlistChange(true);
      onTierChange(null);
    } else {
      onWatchlistChange(false);
      
      if (value === "all") {
        onTierChange(null);
      } else {
        onTierChange(Number(value));
      }
    }
  };
  
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-3">Filter by Tier</h2>
      <Tabs 
        value={getCurrentValue()}
        orientation="vertical"
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex flex-col h-auto space-y-1 bg-transparent w-full">
          <TabsTrigger 
            value="all" 
            className="justify-start px-3 py-2 text-sm w-full data-[state=active]:bg-gray-200 text-left"
          >
            All Tiers
          </TabsTrigger>
          
          {/* Tier tabs */}
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
          
          {/* Custom HR separator */}
          <div className="h-px w-full my-4 bg-gray-300"></div>
          
          {/* Watchlist tab */}
          <TabsTrigger 
            value="watchlist" 
            className="justify-start px-3 py-2 text-sm w-full data-[state=active]:bg-gray-200 text-left"
          >
            <div className="flex items-center gap-2">
              <Bookmark className={`h-4 w-4 ${isWatchlistSelected && !isSettingsOpen ? 'fill-blue-500 text-blue-500' : ''}`} />
              <span className="font-medium">Watchlist</span>
            </div>
          </TabsTrigger>
          
          {/* Settings button - now a TabsTrigger instead of a button */}
          <TabsTrigger 
            value="settings" 
            className="justify-start px-3 py-2 text-sm w-full data-[state=active]:bg-gray-200 text-left"
          >
            <div className="flex items-center gap-2">
              <Settings className={`h-4 w-4 ${isSettingsOpen ? 'text-blue-500' : ''}`} />
              <span className="font-medium">Settings</span>
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
} 