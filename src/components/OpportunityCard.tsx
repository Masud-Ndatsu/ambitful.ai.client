import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

interface Opportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  deadline: string;
  location: string;
  amount?: string;
  link: string;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  viewMode: "grid" | "list";
  onViewDetails: () => void;
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'scholarship':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    case 'internship':
      return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    case 'fellowship':
      return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
    case 'grant':
      return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
  }
};

export const OpportunityCard = ({ opportunity, viewMode, onViewDetails }: OpportunityCardProps) => {
  if (viewMode === "list") {
    return (
      <Card className="bg-gradient-card border-0 shadow-soft hover:shadow-glow transition-all duration-300">
        <div className="flex items-center p-6">
          <div className="flex-grow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Badge className={getTypeColor(opportunity.type)}>
                  {opportunity.type}
                </Badge>
                {opportunity.amount && (
                  <span className="text-sm font-semibold text-primary">
                    {opportunity.amount}
                  </span>
                )}
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {opportunity.title}
            </h3>
            
            <p className="text-muted-foreground mb-3 line-clamp-2">
              {opportunity.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{opportunity.deadline}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{opportunity.location}</span>
              </div>
            </div>
          </div>
          
          <div className="ml-6 flex flex-col gap-2">
            <Button onClick={onViewDetails}>
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(opportunity.link, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col bg-gradient-card border-0 shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getTypeColor(opportunity.type)}>
            {opportunity.type}
          </Badge>
          {opportunity.amount && (
            <span className="text-sm font-semibold text-primary">
              {opportunity.amount}
            </span>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">
          {opportunity.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow pb-3">
        <CardDescription className="text-sm mb-4 line-clamp-3">
          {opportunity.description}
        </CardDescription>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {opportunity.deadline}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{opportunity.location}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 flex flex-col gap-2">
        <Button 
          className="w-full"
          onClick={onViewDetails}
        >
          View Details
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => window.open(opportunity.link, '_blank')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};