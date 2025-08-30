import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useFeaturedOpportunities } from "@/hooks/use-featured-opportunities";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Opportunity } from "@/types/opportunity";
import { useNavigate } from "react-router-dom";

interface LegacyOpportunity {
  id: string;
  title: string;
  type: string;
  description: string;
  deadline: string;
  location: string;
  amount?: string;
  link: string;
}

const mockOpportunities: LegacyOpportunity[] = [
  {
    id: "1",
    title: "Google Summer of Code 2024",
    type: "Internship",
    description:
      "Join open source projects and work with mentors from leading tech companies. Perfect for computer science students.",
    deadline: "March 18, 2024",
    location: "Remote",
    amount: "$6,600",
    link: "#",
  },
  {
    id: "2",
    title: "Rhodes Scholarship",
    type: "Scholarship",
    description:
      "Full scholarship to study at Oxford University. One of the world's most prestigious academic awards.",
    deadline: "September 1, 2024",
    location: "Oxford, UK",
    amount: "Full tuition + living expenses",
    link: "#",
  },
  {
    id: "3",
    title: "Fulbright Student Program",
    type: "Fellowship",
    description:
      "Study, research, and teach abroad with this prestigious international exchange program.",
    deadline: "October 8, 2024",
    location: "Various Countries",
    amount: "Full funding",
    link: "#",
  },
  {
    id: "4",
    title: "Microsoft Internship Program",
    type: "Internship",
    description:
      "12-week summer internship at Microsoft with mentorship and hands-on experience in cutting-edge technology.",
    deadline: "January 31, 2024",
    location: "Redmond, WA",
    amount: "$8,000/month",
    link: "#",
  },
  {
    id: "5",
    title: "Gates Millennium Scholarship",
    type: "Scholarship",
    description:
      "Full scholarship for outstanding minority students pursuing undergraduate and graduate studies.",
    deadline: "January 15, 2024",
    location: "USA",
    amount: "Full tuition",
    link: "#",
  },
  {
    id: "6",
    title: "UN Youth Climate Summit",
    type: "Fellowship",
    description:
      "Join young climate leaders from around the world at the United Nations headquarters.",
    deadline: "April 30, 2024",
    location: "New York, NY",
    amount: "Travel + accommodation",
    link: "#",
  },
];

const FeaturedOpportunities = () => {
  const {
    opportunities: apiOpportunities,
    loading,
    error,
    refetch,
  } = useFeaturedOpportunities(6);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  // Use API opportunities if available, otherwise fallback to mock data
  const displayOpportunities =
    apiOpportunities.length > 0 ? apiOpportunities : mockOpportunities;
  const maxIndex = Math.max(0, displayOpportunities.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const visibleOpportunities = displayOpportunities.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "scholarship":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "internship":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "fellowship":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <section
      id="featured-opportunities"
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-card"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the latest and most sought-after opportunities curated by
            our AI system
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {Array.from({
              length: Math.ceil(displayOpportunities.length / itemsPerPage),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`w-2 h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / itemsPerPage) === index
                    ? "bg-primary w-8"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load featured opportunities: {error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="ml-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading or Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
          {loading
            ? // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <Card
                  key={index}
                  className="h-full flex flex-col shadow-soft bg-gradient-card border-0"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                  </CardHeader>
                  <CardContent className="flex-grow pb-3">
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted animate-pulse rounded" />
                      <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-4/5 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-3">
                    <div className="h-10 w-full bg-muted animate-pulse rounded" />
                  </CardFooter>
                </Card>
              ))
            : visibleOpportunities.map((opportunity, index) => (
                <Card
                  key={opportunity.id}
                  className="h-full flex flex-col shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getTypeColor(opportunity.type)}>
                        {opportunity.type}
                      </Badge>
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
                        <span>Deadline: {opportunity.deadline || ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{opportunity.location}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3">
                    <Button
                      className="w-full border text-primary hover:text-white bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      onClick={() =>
                        navigate(`/opportunities/${opportunity.id}`)
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            onClick={() => {
              navigate("/opportunities");
            }}
            variant="outline"
            size="lg"
            className="px-8"
          >
            View All Opportunities
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedOpportunities;
