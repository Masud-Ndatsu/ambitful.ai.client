// Default opportunity types and categories for filters
export const DEFAULT_TYPES = [
  "fulltime",
  "parttime",
  "freelance",
  "contract",
  "remote",
  "internship",
  "entrepreneurship",
  "volunteer",
  "scholarship",
  "fellowship",
  "grant",
];

export const DEFAULT_CATEGORIES = [
  "technology",
  "healthcare",
  "education",
  "business",
  "creative",
  "skilledtrades",
  "publicservice",
  "science",
];

// Default locations for filters
export const DEFAULT_LOCATIONS = [
  "Remote",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Netherlands",
  "Global",
];

// Deadline filter options
export const DEADLINE_OPTIONS = [
  { value: "next-7-days", label: "Next 7 days" },
  { value: "this-month", label: "This month" },
  { value: "next-3-months", label: "Next 3 months" },
  { value: "custom", label: "Custom range" },
];

// Sort options for opportunities
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "views", label: "Most popular" },
  { value: "applications", label: "Most applied" },
];

// Readable labels for types (for display purposes)
export const TYPE_LABELS = {
  fulltime: "Full-time",
  parttime: "Part-time",
  freelance: "Freelance",
  contract: "Contract",
  remote: "Remote",
  internship: "Internship",
  entrepreneurship: "Entrepreneurship",
  volunteer: "Volunteer",
  scholarship: "Scholarship",
  fellowship: "Fellowship",
  grant: "Grant",
} as const;

// Readable labels for categories (for display purposes)
export const CATEGORY_LABELS = {
  technology: "Technology",
  healthcare: "Healthcare",
  education: "Education",
  business: "Business",
  creative: "Creative & Arts",
  skilledtrades: "Skilled Trades",
  publicservice: "Public Service",
  science: "Science & Research",
} as const;
