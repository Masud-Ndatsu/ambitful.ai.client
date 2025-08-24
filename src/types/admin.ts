/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AdminNotification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface SystemSettings {
  accessControl: {
    adminUsers: AdminUser[];
    rolePermissions: RolePermission[];
  };
  contentCrawling: {
    sources: CrawlingSource[];
    settings: CrawlingSettings;
  };
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  // Extended fields for user management
  country?: string;
  verified?: boolean;
  signupDate?: string;
  lastActive?: string;
  interests?: string[];
  savedOpportunities?: number;
  appliedOpportunities?: number;
  chatbotInteractions?: number;
}

export interface RolePermission {
  roleId: string;
  roleName: string;
  permissions: string[];
  description: string;
}

export interface CrawlingSource {
  id: string;
  name: string;
  url: string;
  status: "active" | "paused" | "disabled";
  frequency: "hourly" | "daily" | "weekly" | "monthly";
  maxResults: number;
  lastCrawl?: string;
  lastSuccess: boolean;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrawlingSettings {
  crawlInterval: number;
  maxResultsPerSource: number;
  enableAutoApproval: boolean;
  duplicateDetection: boolean;
  contentFilters: {
    minSalary?: number;
    excludeKeywords: string[];
    requiredKeywords: string[];
    locationFilters: string[];
  };
  retrySettings: {
    maxRetries: number;
    retryDelay: number;
  };
}

export interface NotificationSettings {
  dailyReports: boolean;
  draftAlerts: boolean;
  systemAlerts: boolean;
  userActivityAlerts: boolean;
  maintenanceAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  slackIntegration: boolean;
  channels: {
    email: {
      enabled: boolean;
      recipients: string[];
      smtpSettings?: {
        host: string;
        port: number;
        secure: boolean;
        username: string;
      };
    };
    slack: {
      enabled: boolean;
      webhookUrl: string;
      channel: string;
      username: string;
    };
    sms: {
      enabled: boolean;
      provider: string;
      numbers: string[];
    };
  };
  schedules: {
    dailyReport: {
      time: string;
      timezone: string;
      enabled: boolean;
    };
    weeklyDigest: {
      day: string;
      time: string;
      timezone: string;
      enabled: boolean;
    };
  };
}

export interface PrivacySettings {
  dataRetention: {
    userDataDays: number;
    analyticsDataDays: number;
    logDataDays: number;
    deletedUserDataDays: number;
  };
  cookieConsent: {
    enabled: boolean;
    consentTypes: string[];
    cookieBannerText: string;
    privacyPolicyUrl: string;
  };
  analyticsTracking: {
    enabled: boolean;
    googleAnalyticsId: string;
    trackingEvents: string[];
    anonymizeIp: boolean;
    respectDoNotTrack: boolean;
  };
  userDataExport: {
    enabled: boolean;
    automaticExport: boolean;
    exportFormats: string[];
    maxExportSize: string;
  };
  compliance: {
    gdprCompliant: boolean;
    ccpaCompliant: boolean;
    dataProcessingBasis: string;
    privacyOfficerEmail: string;
  };
  documents: {
    privacyPolicyUrl: string;
    termsOfServiceUrl: string;
    lastUpdated: string;
  };
}

export interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalOpportunities: number;
    totalApplications: number;
    conversionRate: number;
  };
  userMetrics: {
    newUsers: { date: string; count: number }[];
    activeUsers: { date: string; count: number }[];
    userRetention: { cohort: string; retention: number[] }[];
  };
  opportunityMetrics: {
    newOpportunities: { date: string; count: number }[];
    applicationsByOpportunity: {
      opportunityId: string;
      title: string;
      applications: number;
    }[];
    topCategories: { category: string; count: number }[];
  };
  searchMetrics: {
    topSearchTerms: { term: string; count: number }[];
    searchConversions: { term: string; applications: number }[];
  };
}

export interface OpportunityDraft {
  id: string;
  title: string;
  company: string;
  source: string;
  confidence: number;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  extractedData: Record<string, any>;
}

export interface CrawlJobStatus {
  jobId: string;
  status: "running" | "completed" | "failed";
  progress: number;
  resultCount: number;
  errors?: string[];
}

// Type definitions for API responses
export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface OpportunityDraftsResponse {
  drafts: OpportunityDraft[];
}

export interface ApproveDraftResponse {
  message: string;
  opportunityId: string;
}

export interface MessageResponse {
  message: string;
}

export interface TriggerCrawlResponse {
  message: string;
  jobId: string;
}

export interface ExportAnalyticsResponse {
  downloadUrl: string;
}

// Filter types for API requests
export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
  granularity?: "daily" | "weekly" | "monthly";
}

export interface ExportAnalyticsRequest {
  startDate: string;
  endDate: string;
  format: "csv" | "xlsx" | "json";
}