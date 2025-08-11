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
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-gradient-card">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-3">
                <Badge className={getTypeColor(opportunity.type)}>
                  {opportunity.type}
                </Badge>
                {opportunity.amount && (
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <DollarSign className="h-4 w-4" />
                    {opportunity.amount}
                  </div>
                )}
              </div>

              <DialogTitle className="text-2xl mb-3">
                {opportunity.title}
              </DialogTitle>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Deadline:{" "}
                    {new Date(opportunity.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{opportunity.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare("copy")}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => window.open(opportunity.link, "_blank")}
                className="bg-gradient-primary hover:shadow-glow"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Apply Now
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              About This Opportunity
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {opportunity.fullDescription}
            </p>
          </div>

          <Separator />

          {/* Eligibility & Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Eligibility */}
            <Card className="bg-background/50 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  Eligibility Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {opportunity.eligibility?.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </li>
                  )) || (
                    <li className="text-sm text-muted-foreground">
                      No specific eligibility requirements listed.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="bg-background/50 border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Benefits & Rewards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {opportunity.benefits?.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  )) || (
                    <li className="text-sm text-muted-foreground">
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
                <h3 className="text-lg font-semibold mb-3">How to Apply</h3>
                <Card className="bg-background/50 border-0">
                  <CardContent className="pt-6">
                    <ol className="space-y-3">
                      {opportunity.applicationInstructions.map(
                        (instruction, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm text-muted-foreground">
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
            <h3 className="text-lg font-semibold mb-3">
              Share This Opportunity
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => handleShare("whatsapp")}
                className="bg-green-50 hover:bg-green-100 border-green-200"
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("twitter")}
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("email")}
                className="bg-gray-50 hover:bg-gray-100 border-gray-200"
              >
                Email
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("copy")}
                className="bg-purple-50 hover:bg-purple-100 border-purple-200"
              >
                Copy Link
              </Button>
            </div>
          </div>

          <Separator />

          {/* Similar Opportunities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Similar Opportunities
            </h3>
            {loadingSimilar ? (
              <div className="flex justify-center py-8">
                <div className="text-muted-foreground">
                  Loading similar opportunities...
                </div>
              </div>
            ) : similarOpportunities.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {similarOpportunities.map((similarOpp) => (
                  <OpportunityCard
                    key={similarOpp.id}
                    opportunity={similarOpp}
                    viewMode="grid"
                    onViewDetails={() => {
                      // Close current modal and open new one
                      onClose();
                      // Update URL to show new opportunity
                      const url = new URL(window.location.href);
                      url.searchParams.set("opportunity", similarOpp.id);
                      window.history.pushState({}, "", url);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  No similar opportunities found.
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-6">
            <Button
              size="lg"
              onClick={() => window.open(opportunity.link, "_blank")}
              className="bg-gradient-primary hover:shadow-glow px-8"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Apply for {opportunity.title}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
