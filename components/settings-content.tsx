import { useState, useEffect } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsContentProps {
  onClose: () => void;
  onResetWatchlist: () => void;
}

type Theme = "light" | "dark" | "system";

export function SettingsContent({ onClose, onResetWatchlist }: SettingsContentProps) {
  const [theme, setTheme] = useState<Theme>("system");
  
  // Load theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);
  
  // Apply theme when it changes
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      
      // Apply theme to document
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      
      if (newTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(newTheme);
      }
    }
  };
  
  const handleResetWatchlist = () => {
    if (confirm("Are you sure you want to reset your watchlist? This cannot be undone.")) {
      onResetWatchlist();
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose how the application looks</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={theme} 
            onValueChange={(value) => handleThemeChange(value as Theme)} 
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
          <CardDescription>Manage your watchlist data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="destructive" 
            onClick={handleResetWatchlist}
          >
            Reset Watchlist
          </Button>
          <p className="text-sm text-gray-500">
            This will remove all movies from your watchlist. This action cannot be undone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 