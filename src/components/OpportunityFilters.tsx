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
import { useState, useCallback, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import type { OpportunityFilters as OpportunityFiltersType } from "@/types/opportunity";

interface SelectedFilters {
  categories: string[];
  types: string[];
  deadlines: string;
  dateRange?: DateRange;
  sortBy: string;
}

interface AvailableFilters {
  categories: string[];
  types: string[];
  tags: string[];
}

interface OpportunityFiltersProps {
  selectedFilters: SelectedFilters;
  availableFilters: AvailableFilters;
  onFiltersChange: (filters: Partial<OpportunityFiltersType>) => void;
  loading?: boolean;
}

import {
  DEFAULT_TYPES,
  DEFAULT_CATEGORIES,
  DEADLINE_OPTIONS,
  SORT_OPTIONS,
  TYPE_LABELS,
  CATEGORY_LABELS,
} from "@/data";

export const OpportunityFilters = ({
  selectedFilters,
  availableFilters,
  onFiltersChange,
  loading = false,
}: OpportunityFiltersProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    selectedFilters.dateRange
  );

  // Memoized filter options - use available filters when provided, fallback to defaults
  const filterOptions = useMemo(
    () => ({
      categories:
        availableFilters.categories.length > 0
          ? availableFilters.categories
          : DEFAULT_CATEGORIES,
      types:
        availableFilters.types.length > 0
          ? availableFilters.types
          : DEFAULT_TYPES,
    }),
    [availableFilters]
  );

  // Optimized change handlers using useCallback
  const handleMultiSelectChange = useCallback(
    (
      filterType: "categories" | "types",
      value: string,
      checked: boolean
    ) => {
      // Map plural filter types to singular OpportunityFilters properties
      const filterMapping = {
        categories: "category",
        types: "type",
      } as const;

      const propertyName = filterMapping[filterType];

      // Get current selected value for this filter type
      const currentValue =
        filterType === "categories"
          ? selectedFilters.categories?.[0]
          : selectedFilters.types?.[0];

      if (checked) {
        // Set the new filter value
        onFiltersChange({
          [propertyName]: value,
        } as Partial<OpportunityFiltersType>);
      } else {
        // Clear the filter if unchecking the currently selected value
        if (currentValue === value) {
          onFiltersChange({
            [propertyName]: "",
          } as Partial<OpportunityFiltersType>);
        }
      }
    },
    [selectedFilters, onFiltersChange]
  );

  const handleSingleSelectChange = useCallback(
    (filterType: string, value: string) => {
      onFiltersChange({
        [filterType]: value,
      } as Partial<OpportunityFiltersType>);
    },
    [onFiltersChange]
  );

  const handleDateRangeChange = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
      if (range?.from && range?.to) {
        onFiltersChange({
          dateFrom: range.from.toISOString(),
          dateTo: range.to.toISOString(),
        });
      }
    },
    [onFiltersChange]
  );

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      category: "",
      type: "",
      sortBy: "newest",
      search: "",
    });
    setDateRange(undefined);
  }, [onFiltersChange]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(
    () =>
      Boolean(selectedFilters.categories?.[0]) ||
      Boolean(selectedFilters.types?.[0]) ||
      Boolean(selectedFilters.deadlines) ||
      Boolean(dateRange?.from || dateRange?.to),
    [selectedFilters, dateRange]
  );

  const showCustomDate = selectedFilters.deadlines === "custom";

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
            value={selectedFilters.sortBy}
            onValueChange={(value) => handleSingleSelectChange("sortBy", value)}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
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
            {filterOptions.types.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={selectedFilters.types?.[0] === type}
                  onCheckedChange={(checked) =>
                    handleMultiSelectChange("types", type, checked as boolean)
                  }
                  disabled={loading}
                />
                <label
                  htmlFor={`type-${type}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {TYPE_LABELS[type as keyof typeof TYPE_LABELS] || type}
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
            {filterOptions.categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedFilters.categories?.[0] === category}
                  onCheckedChange={(checked) =>
                    handleMultiSelectChange(
                      "categories",
                      category,
                      checked as boolean
                    )
                  }
                  disabled={loading}
                />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm text-foreground cursor-pointer"
                >
                  {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ||
                    category}
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
            value={selectedFilters.deadlines}
            onValueChange={(value) =>
              handleSingleSelectChange("deadlines", value)
            }
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select deadline filter" />
            </SelectTrigger>
            <SelectContent>
              {DEADLINE_OPTIONS.map((option) => (
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
                    disabled={loading}
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
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                    disabled={loading}
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
