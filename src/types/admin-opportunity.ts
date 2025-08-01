export interface AdminOpportunity {
  id: string;
  title: string;
  type: "scholarship" | "internship" | "fellowship" | "grant";
  description: string;
  fullDescription: string;
  deadline: string;
  location: string;
  amount?: string;
  link: string;
  eligibility: string[];
  benefits: string[];
  applicationInstructions: string;
  category: string;
  status: "published" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
  views: number;
  applications: number;
  saves: number;
  applicationCount: number;
  viewCount: number;
  saveCount: number;
}

export interface OpportunityStats {
  published: number;
  draft: number;
  archived: number;
}

export interface OpportunityAnalytics {
  views: number;
  applications: number;
  saves: number;
  ctr: number;
  avgTimeOnPage: string;
  viewsHistory: { date: string; views: number }[];
}

export interface AdminOpportunityFilters {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateOpportunityData {
  title: string;
  type: "scholarship" | "internship" | "fellowship" | "grant";
  description: string;
  fullDescription: string;
  deadline: string;
  location: string;
  amount?: string;
  link: string;
  eligibility?: string[];
  benefits?: string[];
  applicationInstructions?: string;
  category: string;
  status?: "published" | "draft";
}

export interface UpdateOpportunityData {
  title?: string;
  type?: "scholarship" | "internship" | "fellowship" | "grant";
  description?: string;
  fullDescription?: string;
  deadline?: string;
  location?: string;
  amount?: string;
  link?: string;
  eligibility?: string[];
  benefits?: string[];
  applicationInstructions?: string;
  category?: string;
  status?: "published" | "draft" | "archived";
}

export interface BulkActionData {
  ids: string[];
  action: "publish" | "archive" | "delete";
}

export interface AdminOpportunitiesResponse {
  opportunities: AdminOpportunity[];
  total: number;
  page: number;
  totalPages: number;
  stats: OpportunityStats;
}
