import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  label = "Search Movies", 
  placeholder = "Search movies...",
  className = "w-full",
  compact = false
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact || !!searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle click outside to collapse the search bar in compact mode
  useEffect(() => {
    if (!compact) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) && !searchQuery) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [compact, searchQuery]);
  
  // Expand the search bar when it receives focus
  const handleFocus = () => {
    setIsFocused(true);
    setIsExpanded(true);
  };
  
  // Handle blur event
  const handleBlur = () => {
    setIsFocused(false);
    // Only collapse if in compact mode and no search query
    if (compact && !searchQuery) {
      setIsExpanded(false);
    }
  };
  
  return (
    <div className={className}>
      {label && <h2 className="text-lg font-semibold mb-3">{label}</h2>}
      <div className={`relative ${compact ? "flex justify-end" : "w-full"}`}>
        <div 
          className={`relative overflow-hidden rounded-md ${
            compact ? "transition-all duration-300 ease-in-out" : "w-full"
          } ${
            compact && !isExpanded ? "w-9 h-9" : compact ? "w-32 md:w-40" : "w-full"
          }`}
        >
          <div 
            className={`absolute inset-y-0 left-0 flex items-center pointer-events-none z-10 ${
              compact && !isExpanded ? "inset-x-0 justify-center" : "pl-3"
            }`}
          >
            <Search className={`${compact && !isExpanded ? "w-4 h-4" : "w-4 h-4"} text-gray-500`} />
          </div>
          <input
            ref={inputRef}
            type="text"
            className={`block w-full h-full p-2 ${
              compact && !isExpanded ? "opacity-0" : "pl-9"
            } text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 focus:bg-white focus:ring-blue-500 focus:border-blue-500 ${
              compact ? "transition-all duration-300 ease-in-out" : ""
            }`}
            placeholder={isExpanded ? (compact ? "Filter" : placeholder) : ""}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={() => {
              if (compact && !isExpanded) {
                setIsExpanded(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }
            }}
            style={{
              cursor: compact && !isExpanded ? 'pointer' : 'text'
            }}
          />
          {compact && !isExpanded && (
            <div className="absolute inset-0 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer" onClick={() => {
              setIsExpanded(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}></div>
          )}
        </div>
      </div>
    </div>
  );
} 