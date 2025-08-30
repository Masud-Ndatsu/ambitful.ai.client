/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OpportunitySearch } from "@/components/OpportunitySearch";
import { OpportunityFilters } from "@/components/OpportunityFilters";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { DataPagination } from "@/components/ui/DataPagination";
import { useOpportunities } from "@/hooks/use-opportunities";
import type { Opportunity } from "@/types/opportunity";

const Opportunities = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
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

  console.log({ filters, total, totalPages });

  // Sync URL with hook filters on mount
  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const sortBy = searchParams.get("sortBy");
    const page = searchParams.get("page");

    if (search && search !== filters.search) setSearch(search);
    if (category && category !== filters.category) setCategory(category);
    if (location && location !== filters.location) setLocation(location);
    if (type && type !== filters.type) setType(type);
    if (sortBy && sortBy !== filters.sortBy) setSortBy(sortBy as any);
    if (page && parseInt(page) !== filters.page) setPage(parseInt(page));
  }, [searchParams]);

  // Handle filter changes
  const handleFiltersChange = (
    newFilters: Partial<import("@/types/opportunity").OpportunityFilters>
  ) => {
    // Handle each filter type, including clearing (undefined values)
    if (newFilters.search !== undefined) {
      const updatedFilters = {
        ...filters,
        search: newFilters.search || undefined,
        page: 1,
      };
      updateURL(updatedFilters);
    }
    if (newFilters.category !== undefined) {
      const updatedFilters = {
        ...filters,
        category: newFilters.category || undefined,
        page: 1,
      };
      updateURL(updatedFilters);
    }
    if (newFilters.location !== undefined) {
      const updatedFilters = {
        ...filters,
        location: newFilters.location || undefined,
        page: 1,
      };
      updateURL(updatedFilters);
    }
    if (newFilters.type !== undefined) {
      const updatedFilters = {
        ...filters,
        type: newFilters.type || undefined,
        page: 1,
      };
      updateURL(updatedFilters);
    }
    if (newFilters.sortBy !== undefined) {
      const updatedFilters = { ...filters, sortBy: newFilters.sortBy, page: 1 };
      updateURL(updatedFilters);
    }
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    updateURL(updatedFilters);
  };

  // Function to handle navigating to opportunity details page
  const handleViewDetails = (opportunityId: string) => {
    navigate(`/opportunities/${opportunityId}`);
  };

  // Update URL when filters change
  const updateURL = (newFilters: any) => {
    const newSearchParams = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        newSearchParams.set(key, String(value));
      }
    });

    setSearchParams(newSearchParams);
  };

  // Handle search input change
  const handleSearchChange = (query: string) => {
    handleFiltersChange({ search: query || undefined, page: 1 });
  };

  // Sync URL with hook filters on mount
  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const sortBy = searchParams.get("sortBy");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    if (search && search !== filters.search) setSearch(search);
    if (category && category !== filters.category) setCategory(category);
    if (location && location !== filters.location) setLocation(location);
    if (type && type !== filters.type) setType(type);
    if (sortBy && sortBy !== filters.sortBy) setSortBy(sortBy as any);
    if (page && parseInt(page) !== filters.page) setPage(parseInt(page));
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Discover Opportunities... Empower Your Future.
              </h1>
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
                <DataPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  showPageInfo={true}
                  totalItems={total}
                  itemsPerPage={10}
                  className="mt-12"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Opportunities;
