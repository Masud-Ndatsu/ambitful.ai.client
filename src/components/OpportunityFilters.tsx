import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

interface Filters {
  categories: string[];
  locations: string[];
  types: string[];
  deadlines: string;
  sortBy: string;
}

interface OpportunityFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const categories = [
  "Technology",
  "Healthcare",
  "Education",
  "Business",
  "Arts & Culture",
  "Environment",
  "Social Impact",
  "Research",
];

const locations = [
  "Remote",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Netherlands",
  "Global",
];

const types = [
  "Scholarship",
  "Internship",
  "Fellowship",
  "Grant",
  "Competition",
];

const deadlineOptions = [
  { value: "next-7-days", label: "Next 7 days" },
  { value: "this-month", label: "This month" },
  { value: "next-3-months", label: "Next 3 months" },
  { value: "custom", label: "Custom range" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "deadline-soon", label: "Deadline approaching" },
  { value: "popular", label: "Most popular" },
  { value: "amount-high", label: "Highest amount" },
];

export const OpportunityFilters = ({
  filters,
  onFiltersChange,
}: OpportunityFiltersProps) => {
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  console.log({ filters });

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);

    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.types, type]
      : filters.types.filter((t) => t !== type);

    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked
      ? [...filters.locations, location]
      : filters.locations.filter((l) => l !== location);

    onFiltersChange({ ...filters, locations: newLocations });
  };

  const handleDeadlineChange = (value: string) => {
    onFiltersChange({ ...filters, deadlines: value });
    setShowCustomDate(value === "custom");
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      locations: [],
      types: [],
      deadlines: "",
      sortBy: "newest",
    });
    setShowCustomDate(false);
    setDateRange(undefined);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.locations.length > 0 ||
    filters.types.length > 0 ||
    filters.deadlines;

  return (
    <Card className="p-6 bg-gradient-card border-0 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Sort By */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Sort by
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, sortBy: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Opportunity Type */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Opportunity Type
          </label>
          <div className="space-y-2">
            {types.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.types.includes(type)}
                  onCheckedChange={(checked) =>
                    handleTypeChange(type, checked as boolean)
                  }
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {type}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Category
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Location
          </label>
          <div className="space-y-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location}`}
                  checked={filters.locations.includes(location)}
                  onCheckedChange={(checked) =>
                    handleLocationChange(location, checked as boolean)
                  }
                />
                <label
                  htmlFor={`location-${location}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {location}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Deadline
          </label>
          <Select
            value={filters.deadlines}
            onValueChange={handleDeadlineChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select deadline filter" />
            </SelectTrigger>
            <SelectContent>
              {deadlineOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showCustomDate && (
            <div className="mt-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from && dateRange?.to
                      ? `${format(dateRange.from, "MMM dd")} - ${format(
                          dateRange.to,
                          "MMM dd"
                        )}`
                      : "Select date range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
