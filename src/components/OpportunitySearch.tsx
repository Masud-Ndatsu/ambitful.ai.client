import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mic, X } from "lucide-react";

interface OpportunitySearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const OpportunitySearch = ({ searchQuery, onSearchChange }: OpportunitySearchProps) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSearchChange(transcript);
      };
      
      recognition.start();
    }
  };

  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <Input
          type="text"
          placeholder="Search by title, category, country..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-20 py-3 text-lg bg-background border-input focus:border-primary"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleVoiceSearch}
            className={`h-6 w-6 p-0 ${isListening ? 'text-primary' : ''}`}
            title="Voice search"
          >
            <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
      </div>
      
      {isListening && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          🎤 Listening... Speak your search terms
        </div>
      )}
    </div>
  );
};