// Types extracted from AdminService return types
import { AdminUser } from "./admin";
import { AnalyticsData } from "./index";
import {
  AdminOpportunity,
  AdminOpportunitiesResponse,
  OpportunityAnalytics,
} from "./admin-opportunity";

export interface GetUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetOpportunityDraftsResponse {
  drafts: Array<{
    id: string;
    title: string;
    company: string;
    source: string;
    confidence: number;
    createdAt: string;
    status: "pending" | "approved" | "rejected";
    extractedData: Record<string, unknown>;
  }>;
}

export interface ApproveDraftResponse {
  message: string;
  opportunityId: string;
}

export interface RejectDraftResponse {
  message: string;
}

export interface RegenerateDraftResponse {
  message: string;
}

// Use AnalyticsData directly for GetAnalyticsResponse

export interface ExportAnalyticsResponse {
  downloadUrl: string;
}

export interface TriggerCrawlResponse {
  message: string;
  jobId: string;
}

export interface GetCrawlStatusResponse {
  jobId: string;
  status: "running" | "completed" | "failed";
  progress: number;
  resultCount: number;
  errors?: string[];
}

// Use AdminOpportunitiesResponse directly for GetAdminOpportunitiesResponse

// Use AdminOpportunity directly for CreateOpportunityResponse

// Use AdminOpportunity directly for UpdateOpportunityResponse

export interface DeleteOpportunityResponse {
  message: string;
}

export interface BulkActionOpportunitiesResponse {
  message: string;
  affected: number;
}

// Use OpportunityAnalytics directly for GetOpportunityAnalyticsResponse

export interface GetDashboardSummaryResponse {
  overview: {
    totalVisits: number;
    activeOpportunities: number;
    pendingDrafts: number;
    avgCTR: number;
    visitTrend: Array<{
      date: string;
      visits: number;
    }>;
    topRegions: Array<{
      country: string;
      visits: number;
      percentage: number;
    }>;
  };
  topPerformingOpportunities: Array<{
    opportunityId: string;
    title: string;
    views: number;
    applications: number;
    ctr: number;
    avgTimeOnPage: string;
  }>;
  userGrowth: {
    totalUsers: number;
    newUsersThisWeek: number;
    growthRate: number;
  };
  systemHealth: {
    uptime: string;
    responseTime: string;
    errorRate: number;
  };
}

export interface GetAIDraftStatsResponse {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byPriority: { high: number; medium: number; low: number };
}

export interface GetDetailedMetricsResponse {
  overview: {
    totalVisits: number;
    activeOpportunities: number;
    pendingDrafts: number;
    avgCTR: number;
    visitTrend: Array<{ date: string; visits: number }>;
    topRegions: Array<{
      country: string;
      visits: number;
      percentage: number;
    }>;
  };
  opportunities: {
    totalOpportunities: number;
    publishedOpportunities: number;
    draftOpportunities: number;
    archivedOpportunities: number;
    avgViewsPerOpportunity: number;
    avgApplicationsPerOpportunity: number;
    topCategories: Array<{
      category: string;
      count: number;
    }>;
  };
  users: {
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    avgInteractions: number;
    signupTrend: Array<{ date: string; visits: number }>;
    engagementMetrics: {
      chatbotInteractions: number;
      opportunitiesSaved: number;
      applicationsSubmitted: number;
    };
    usersByCountry: Array<{
      country: string;
      visits: number;
      percentage: number;
    }>;
    activeUsersTrend: Array<{ date: string; visits: number }>;
  };
  engagement: {
    totalPageViews: number;
    avgSessionDuration: string;
    bounceRate: number;
    conversionRate: number;
    topPages: Array<{
      page: string;
      views: number;
    }>;
  };
}

export interface GetAIDraftsResponse {
  drafts: Array<{
    id: string;
    title: string;
    source: string;
    status: "pending" | "approved" | "rejected";
    priority: "high" | "medium" | "low";
    createdAt: string;
  }>;
  total: number;
  pending: number;
  page: number;
  totalPages: number;
}
