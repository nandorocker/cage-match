import { tierDescriptions, tierColors } from "@/lib/movies";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TierFilterProps {
  selectedTier: number | null;
  onTierChange: (tier: number | null) => void;
}

export function TierFilter({ selectedTier, onTierChange }: TierFilterProps) {
  const tiers = Object.keys(tierDescriptions).map(Number);
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Filter by Tier</h2>
      <Tabs defaultValue={selectedTier?.toString() || "all"} onValueChange={(value) => {
        if (value === "all") {
          onTierChange(null);
        } else {
          onTierChange(Number(value));
        }
      }}>
        <TabsList className="grid grid-cols-7">
          <TabsTrigger value="all" className="text-sm">
            All
          </TabsTrigger>
          {tiers.map((tier) => (
            <TabsTrigger 
              key={tier} 
              value={tier.toString()} 
              className="text-sm"
            >
              Tier {tier}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
} 