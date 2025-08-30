import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  ExternalLink,
  Share2,
  CheckCircle,
  DollarSign,
  Users,
} from "lucide-react";
import { OpportunityCard } from "./OpportunityCard";
import { useOpportunities } from "@/hooks/use-opportunities";
import type { Opportunity } from "@/types/opportunity";

interface OpportunityDetailModalProps {
  opportunity: Opportunity;
  onClose: () => void;
}

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "scholarship":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    case "internship":
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
    case "fellowship":
      return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
    case "grant":
      return "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
  }
};

export const OpportunityDetailModal = ({
  opportunity,
  onClose,
}: OpportunityDetailModalProps) => {
  const { getSimilarOpportunities } = useOpportunities();
  const [similarOpportunities, setSimilarOpportunities] = useState<
    Opportunity[]
  >([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  // Load similar opportunities when modal opens
  useEffect(() => {
    const loadSimilar = async () => {
      try {
        setLoadingSimilar(true);
        const similar = await getSimilarOpportunities(opportunity.id, 4);
        setSimilarOpportunities(similar);
      } catch (error) {
        console.error("Failed to load similar opportunities:", error);
        setSimilarOpportunities([]);
      } finally {
        setLoadingSimilar(false);
      }
    };

    loadSimilar();
  }, [opportunity.id, getSimilarOpportunities]);

  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this amazing opportunity: ${opportunity.title}`;

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            shareText + " " + shareUrl
          )}`
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareText
          )}&url=${encodeURIComponent(shareUrl)}`
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(
            opportunity.title
          )}&body=${encodeURIComponent(shareText + " " + shareUrl)}`
        );
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        break;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] overflow-y-auto bg-gradient-card px-4 sm:px-6 md:px-8">
        <DialogHeader className="pb-3 sm:pb-4">
          {/* Mobile-first layout with stacked elements */}
          <div className="space-y-4">
            {/* Top section with badges and amount */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getTypeColor(opportunity.type)}>
                  {opportunity.type}
                </Badge>
                {opportunity.amount && (
                  <div className="flex items-center gap-1 text-primary font-semibold text-sm sm:text-base">
                    <DollarSign className="h-4 w-4" />
                    {opportunity.amount}
                  </div>
                )}
              </div>

              {/* Action buttons - stacked on mobile */}
              <div className="flex items-center gap-2 sm:ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("copy")}
                  className="flex-1 sm:flex-none"
                >
                  <Share2 className="h-4 w-4 sm:mr-0" />
                  <span className="sm:hidden ml-2">Share</span>
                </Button>
                <Button
                  onClick={() => window.open(opportunity.link, "_blank")}
                  className="bg-gradient-primary hover:shadow-glow flex-1 sm:flex-none"
                  size="sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
              </div>
            </div>

            {/* Title */}
            <DialogTitle className="text-xl sm:text-2xl leading-tight pr-8 sm:pr-0">
              {opportunity.title}
            </DialogTitle>

            {/* Date and location - stack on small screens */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>
                  Deadline:{" "}
                  {new Date(opportunity.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{opportunity.location}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              About This Opportunity
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              {opportunity.fullDescription}
            </p>
          </div>

          <Separator />

          {/* Eligibility & Benefits Grid - single column on mobile */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Eligibility */}
            <Card className="bg-background/50 border-0">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Eligibility Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {opportunity.eligibility?.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm leading-relaxed">
                        {requirement}
                      </span>
                    </li>
                  )) || (
                    <li className="text-xs sm:text-sm text-muted-foreground">
                      No specific eligibility requirements listed.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-background/50 border-0">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Benefits & Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {opportunity.benefits?.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  )) || (
                    <li className="text-xs sm:text-sm text-muted-foreground">
                      No specific benefits listed.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Application Instructions */}
          {opportunity.applicationInstructions &&
            opportunity.applicationInstructions.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  How to Apply
                </h3>
                <Card className="bg-background/50 border-0">
                  <CardContent className="pt-4 sm:pt-6">
                    <ol className="space-y-3">
                      {opportunity.applicationInstructions.map(
                        (instruction, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {instruction}
                            </span>
                          </li>
                        )
                      )}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            )}

          <Separator />

          {/* Share Buttons */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Share This Opportunity
            </h3>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={() => handleShare("whatsapp")}
                className="bg-green-50 hover:bg-green-100 border-green-200 text-xs sm:text-sm"
                size="sm"
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("twitter")}
                className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-xs sm:text-sm"
                size="sm"
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("email")}
                className="bg-gray-50 hover:bg-gray-100 border-gray-200 text-xs sm:text-sm"
                size="sm"
              >
                Email
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("copy")}
                className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-xs sm:text-sm"
                size="sm"
              >
                Copy Link
              </Button>
            </div>
          </div>

          <Separator />

          {/* Similar Opportunities */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Similar Opportunities
            </h3>
            {loadingSimilar ? (
              <div className="flex justify-center py-6 sm:py-8">
                <div className="text-muted-foreground text-sm sm:text-base">
                  Loading similar opportunities...
                </div>
              </div>
            ) : similarOpportunities.length > 0 ? (
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {similarOpportunities.map((similarOpp) => (
                  <OpportunityCard
                    key={similarOpp.id}
                    opportunity={similarOpp}
                    viewMode="grid"
                    onViewDetails={() => {
                      onClose();
                      const url = new URL(window.location.href);
                      url.searchParams.set("opportunity", similarOpp.id);
                      window.history.pushState({}, "", url);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="text-muted-foreground text-sm sm:text-base">
                  No similar opportunities found.
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-4 sm:pt-6 pb-2">
            <Button
              size="lg"
              onClick={() => window.open(opportunity.link, "_blank")}
              className="bg-gradient-primary hover:shadow-glow px-6 sm:px-8 w-full sm:w-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">
                Apply for {opportunity.title}
              </span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
