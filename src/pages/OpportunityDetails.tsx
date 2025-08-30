import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  ArrowLeft,
} from "lucide-react";
import { OpportunityCard } from "@/components/OpportunityCard";
import { useOpportunities } from "@/hooks/use-opportunities";
import { LoadingOverlay, LoadingSkeleton } from "@/components/ui/LoadingButton";
import { formatDate } from "@/lib/utils";
import type { Opportunity } from "@/types/opportunity";

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

export default function OpportunityDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOpportunityById, getSimilarOpportunities } = useOpportunities();

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [similarOpportunities, setSimilarOpportunities] = useState<
    Opportunity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load opportunity when component mounts or ID changes
  useEffect(() => {
    const loadOpportunity = async () => {
      if (!id) {
        setError("No opportunity ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const opp = await getOpportunityById(id);
        setOpportunity(opp);
      } catch (error) {
        console.error("Failed to load opportunity:", error);
        setError("Failed to load opportunity details");
      } finally {
        setLoading(false);
      }
    };

    loadOpportunity();
  }, [id, getOpportunityById]);

  // Load similar opportunities when opportunity is loaded
  useEffect(() => {
    const loadSimilar = async () => {
      if (!opportunity) return;

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
  }, [opportunity, getSimilarOpportunities]);

  const handleShare = async (platform: string) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this amazing opportunity: ${opportunity?.title}`;

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
            opportunity?.title || "Opportunity"
          )}&body=${encodeURIComponent(shareText + " " + shareUrl)}`
        );
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        break;
    }
  };

  const handleBackToOpportunities = () => {
    navigate("/opportunities");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Loading skeleton */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <LoadingSkeleton lines={1} width="100px" height="40px" />
                <LoadingSkeleton lines={1} width="200px" height="40px" />
              </div>
              <LoadingSkeleton lines={2} height="3rem" />
              <div className="grid gap-6 lg:grid-cols-2">
                <LoadingSkeleton lines={8} height="400px" />
                <LoadingSkeleton lines={8} height="400px" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {error || "Opportunity not found"}
            </h1>
            <p className="text-gray-600">
              The opportunity you're looking for doesn't exist or couldn't be
              loaded.
            </p>
            <Button onClick={handleBackToOpportunities}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Opportunities
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <div className="mb-4 sm:mb-6">
            <Button
              variant="outline"
              onClick={handleBackToOpportunities}
              className="gap-2 text-sm sm:text-base"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">Back to Opportunities</span>
              <span className="xs:hidden">Back</span>
            </Button>
          </div>

          {/* Header Section */}
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {/* Top section with badges and amount */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge
                  className={`${getTypeColor(
                    opportunity.type
                  )} text-xs sm:text-sm`}
                >
                  {opportunity.type}
                </Badge>
                {opportunity.amount && (
                  <div className="flex items-center gap-1 sm:gap-2 text-primary font-semibold text-sm sm:text-base">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                    {opportunity.amount}
                  </div>
                )}
              </div>

              {/* Action buttons - responsive sizing */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleShare("copy")}
                  size="sm"
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button
                  onClick={() => window.open(opportunity.link, "_blank")}
                  className="bg-primary hover:shadow-glow flex-1 sm:flex-none text-xs sm:text-sm"
                  size="sm"
                >
                  <ExternalLink className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Apply Now
                </Button>
              </div>
            </div>

            {/* Title - responsive text sizing */}
            <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {opportunity.title}
            </h1>

            {/* Date and location - stack on small screens */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 text-muted-foreground text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span>
                  Deadline:{" "}
                  {formatDate(opportunity.deadline, { format: "medium" })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="break-words">{opportunity.location}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                About This Opportunity
              </h2>
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {opportunity.fullDescription}
                </p>
              </div>
            </section>

            {/* Eligibility & Benefits Grid - single column on mobile */}
            <section className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
              {/* Eligibility */}
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    Eligibility Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 sm:space-y-3">
                    {opportunity.eligibility?.map((requirement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 sm:gap-3"
                      >
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed text-sm sm:text-base">
                          {requirement}
                        </span>
                      </li>
                    )) || (
                      <li className="text-muted-foreground text-sm sm:text-base">
                        No specific eligibility requirements listed.
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                    Benefits & Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 sm:space-y-3">
                    {opportunity.benefits?.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 sm:gap-3"
                      >
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed text-sm sm:text-base">
                          {benefit}
                        </span>
                      </li>
                    )) || (
                      <li className="text-muted-foreground text-sm sm:text-base">
                        No specific benefits listed.
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Application Instructions */}
            {opportunity.applicationInstructions &&
              opportunity.applicationInstructions.length > 0 && (
                <section>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                    How to Apply
                  </h2>
                  <Card>
                    <CardContent className="pt-4 sm:pt-6">
                      <ol className="space-y-3 sm:space-y-4">
                        {opportunity.applicationInstructions.map(
                          (instruction, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 sm:gap-4"
                            >
                              <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="text-muted-foreground leading-relaxed pt-0.5 sm:pt-1 text-sm sm:text-base">
                                {instruction}
                              </span>
                            </li>
                          )
                        )}
                      </ol>
                    </CardContent>
                  </Card>
                </section>
              )}

            {/* Share Section */}
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                Share This Opportunity
              </h2>
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
            </section>

            {/* Similar Opportunities */}
            <section>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 sm:mb-4">
                Similar Opportunities
              </h2>
              <LoadingOverlay
                loading={loadingSimilar}
                message="Loading similar opportunities..."
                className="min-h-[200px]"
              >
                {similarOpportunities.length > 0 ? (
                  <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                    {similarOpportunities.map((similarOpp) => (
                      <OpportunityCard
                        key={similarOpp.id}
                        opportunity={similarOpp}
                        viewMode="grid"
                        onViewDetails={() => {
                          navigate(`/opportunities/${similarOpp.id}`);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-muted-foreground text-sm sm:text-base">
                      No similar opportunities found.
                    </div>
                  </div>
                )}
              </LoadingOverlay>
            </section>

            {/* Bottom CTA - full width on mobile */}
            <section className="text-center pt-6 sm:pt-8 pb-4">
              <Button
                size="lg"
                onClick={() => window.open(opportunity.link, "_blank")}
                className="bg-gradient-primary hover:shadow-glow px-6 sm:px-8 w-full sm:w-auto text-sm sm:text-base"
              >
                <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="truncate">
                  Apply for{" "}
                  {opportunity.title.length > 30
                    ? `${opportunity.title.substring(0, 30)}...`
                    : opportunity.title}
                </span>
              </Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
