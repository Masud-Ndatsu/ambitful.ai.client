export interface Opportunity {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: "full-time" | "part-time" | "contract" | "internship";
  category: string;
  tags: string[];
  requirements: string[];
  benefits: string[];
  remote: boolean;
  featured: boolean;
  status: "active" | "inactive" | "closed";
  createdAt: string;
  updatedAt: string;
  applicationDeadline?: string;
  contactEmail?: string;
  applicationUrl?: string;
  views: number;
  applications: number;
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