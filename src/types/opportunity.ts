/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  type: "scholarship" | "internship" | "fellowship" | "grant";
  category: string;
  location: string;
  deadline: string;
  amount: string | null;
  link: string;
  status: "published" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
  views: number;
  applications: number;
  saves?: number;
  // Extended fields for detailed view
  applicationInstructions?: string[];
  eligibility?: string[];
  benefits?: string[];
  // Legacy fields for backward compatibility  
  company?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  tags?: string[];
  requirements?: string[];
  remote?: boolean;
  featured?: boolean;
  applicationDeadline?: string;
  contactEmail?: string;
  applicationUrl?: string;
}

export interface OpportunityFilters {
  search?: string;
  category?: string;
  location?: string;
  type?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  tags?: string[];
  sortBy?:
    | "newest"
    | "oldest"
    | "salary-high"
    | "salary-low"
    | "views"
    | "applications";
  page?: number;
  limit?: number;
}

export interface OpportunityListResponse {
  opportunities: Opportunity[];
  total: number;
  page: number;
  totalPages: number;
  filters: {
    categories: string[];
    locations: string[];
    types: string[];
    tags: string[];
  };
}

export interface CreateOpportunityData {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: Opportunity["type"];
  category: string;
  tags: string[];
  requirements: string[];
  benefits: string[];
  remote: boolean;
  applicationDeadline?: string;
  contactEmail?: string;
  applicationUrl?: string;
}

export interface ApplicationData {
  coverLetter?: string;
  resume?: File;
  additionalInfo?: string;
}

export interface ApplicationResponse {
  message: string;
  applicationId: string;
}

export interface UserApplication {
  opportunityId: string;
  opportunity: Opportunity;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: string;
  coverLetter?: string;
  additionalInfo?: string;
}

export interface ShareOpportunityData {
  method: "email" | "link" | "social";
  email?: string;
}

export interface SavedOpportunitiesFilters extends OpportunityFilters {
  // Additional filters specific to saved opportunities
}
