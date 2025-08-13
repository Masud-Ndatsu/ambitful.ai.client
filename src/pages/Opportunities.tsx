/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OpportunitySearch } from "@/components/OpportunitySearch";
import { OpportunityFilters } from "@/components/OpportunityFilters";
import { OpportunityCard } from "@/components/OpportunityCard";
import { OpportunityDetailModal } from "@/components/OpportunityDetailModal";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { useOpportunities } from "@/hooks/use-opportunities";
import type { Opportunity } from "@/types/opportunity";

const Opportunities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Use the opportunities hook
  const {
    opportunities,
    loading,
    error,
    total,
    page,
    totalPages,
    availableFilters,
    filters,
    setSearch,
    setCategory,
    setLocation,
    setType,
    setSortBy,
    setPage,
    getOpportunityById,
  } = useOpportunities();

  console.log({ filters, availableFilters });

  // Get the selected opportunity from URL parameter
  const selectedOpportunityId = searchParams.get("opportunity");
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null);

  // Load selected opportunity when ID changes
  useEffect(() => {
    if (selectedOpportunityId) {
      getOpportunityById(selectedOpportunityId)
        .then(setSelectedOpportunity)
        .catch(() => setSelectedOpportunity(null));
    } else {
      setSelectedOpportunity(null);
    }
  }, [selectedOpportunityId, getOpportunityById]);

  // Function to handle opening opportunity modal
  const handleViewDetails = (opportunityId: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("opportunity", opportunityId);
      return newParams;
    });
  };

  // Function to handle closing opportunity modal
  const handleCloseModal = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("opportunity");
      return newParams;
    });
  };

  // Handle search input change
  const handleSearchChange = (query: string) => {
    setSearch(query);
  };

  // Handle filter changes
  const handleFiltersChange = (
    newFilters: Partial<import("@/types/opportunity").OpportunityFilters>
  ) => {
    // Handle each filter type, including clearing (undefined values)
    if (newFilters.search !== undefined) {
      setSearch(newFilters.search || "");
    }
    if (newFilters.category !== undefined) {
      setCategory(newFilters.category || "");
    }
    if (newFilters.location !== undefined) {
      setLocation(newFilters.location || "");
    }
    if (newFilters.type !== undefined) {
      setType(newFilters.type || "");
    }
    if (newFilters.sortBy !== undefined) {
      setSortBy(newFilters.sortBy);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Explore Opportunities
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover thousands of scholarships, internships, and fellowships
                curated specifically for young professionals like you
              </p>
            </div>

            <OpportunitySearch
              searchQuery={filters.search || ""}
              onSearchChange={handleSearchChange}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-1/4">
                <OpportunityFilters
                  selectedFilters={{
                    categories: filters.category ? [filters.category] : [],
                    locations: filters.location ? [filters.location] : [],
                    types: filters.type ? [filters.type] : [],
                    deadlines: "",
                    sortBy: filters.sortBy || "newest",
                  }}
                  availableFilters={availableFilters}
                  onFiltersChange={handleFiltersChange}
                  loading={loading}
                />
              </div>

              {/* Results */}
              <div className="lg:w-3/4">
                {/* View Controls */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-muted-foreground">
                    {loading
                      ? "Loading..."
                      : `Showing ${opportunities.length} of ${total} opportunities`}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Loading and Error States */}
                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-muted-foreground">
                      Loading opportunities...
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-destructive">
                      Error loading opportunities: {error.message}
                    </div>
                  </div>
                )}

                {/* Opportunity Grid/List */}
                {!loading && !error && (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    {opportunities.length > 0 ? (
                      opportunities.map((opportunity) => (
                        <OpportunityCard
                          key={opportunity.id}
                          opportunity={opportunity}
                          viewMode={viewMode}
                          onViewDetails={() =>
                            handleViewDetails(opportunity.id)
                          }
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <div className="text-muted-foreground">
                          No opportunities found matching your criteria.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setPage(Math.max(page - 1, 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>

                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "outline"}
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}

                      <Button
                        variant="outline"
                        onClick={() => setPage(Math.min(page + 1, totalPages))}
                        disabled={page === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Opportunities;
