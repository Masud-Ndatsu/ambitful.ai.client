import { apiService } from './api';

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
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
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
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
  type: 'web_scraping' | 'rss_feed' | 'api';
  status: 'active' | 'inactive';
  lastCrawled: string;
  crawlFrequency: 'hourly' | 'daily' | 'weekly';
  selectors?: Record<string, string>;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
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
    applicationsByOpportunity: { opportunityId: string; title: string; applications: number }[];
    topCategories: { category: string; count: number }[];
  };
  searchMetrics: {
    topSearchTerms: { term: string; count: number }[];
    searchConversions: { term: string; applications: number }[];
  };
}

export class AdminService {
  // System Settings
  async getSystemSettings(): Promise<SystemSettings> {
    const response = await apiService.get<SystemSettings>('/admin/settings');
    return response.data;
  }

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const response = await apiService.put<SystemSettings>('/admin/settings', settings);
    return response.data;
  }

  // Notifications
  async getAdminNotifications(): Promise<AdminNotification[]> {
    const response = await apiService.get<AdminNotification[]>('/admin/notifications');
    return response.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<{ message: string }> {
    const response = await apiService.put<{ message: string }>(`/admin/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead(): Promise<{ message: string }> {
    const response = await apiService.put<{ message: string }>('/admin/notifications/mark-all-read');
    return response.data;
  }

  // User Management
  async getUsers(filters: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiService.get<{
      users: AdminUser[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/admin/users?${queryParams.toString()}`);
    return response.data;
  }

  async updateUserRole(userId: string, role: string): Promise<AdminUser> {
    const response = await apiService.put<AdminUser>(`/admin/users/${userId}/role`, { role });
    return response.data;
  }

  async updateUserStatus(userId: string, status: 'active' | 'inactive'): Promise<AdminUser> {
    const response = await apiService.put<AdminUser>(`/admin/users/${userId}/status`, { status });
    return response.data;
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(`/admin/users/${userId}`);
    return response.data;
  }

  // Opportunity Management
  async getOpportunityDrafts(): Promise<{
    drafts: Array<{
      id: string;
      title: string;
      company: string;
      source: string;
      confidence: number;
      createdAt: string;
      status: 'pending' | 'approved' | 'rejected';
      extractedData: Record<string, any>;
    }>;
  }> {
    const response = await apiService.get<{
      drafts: Array<{
        id: string;
        title: string;
        company: string;
        source: string;
        confidence: number;
        createdAt: string;
        status: 'pending' | 'approved' | 'rejected';
        extractedData: Record<string, any>;
      }>;
    }>('/admin/opportunities/drafts');
    return response.data;
  }

  async approveDraft(draftId: string): Promise<{ message: string; opportunityId: string }> {
    const response = await apiService.post<{ message: string; opportunityId: string }>(`/admin/opportunities/drafts/${draftId}/approve`);
    return response.data;
  }

  async rejectDraft(draftId: string, reason?: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(`/admin/opportunities/drafts/${draftId}/reject`, { reason });
    return response.data;
  }

  async regenerateDraft(draftId: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(`/admin/opportunities/drafts/${draftId}/regenerate`);
    return response.data;
  }

  // Analytics
  async getAnalytics(dateRange: {
    startDate: string;
    endDate: string;
    granularity?: 'daily' | 'weekly' | 'monthly';
  }): Promise<AnalyticsData> {
    const queryParams = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      granularity: dateRange.granularity || 'daily',
    });

    const response = await apiService.get<AnalyticsData>(`/admin/analytics?${queryParams.toString()}`);
    return response.data;
  }

  async exportAnalytics(dateRange: {
    startDate: string;
    endDate: string;
    format: 'csv' | 'xlsx' | 'json';
  }): Promise<{ downloadUrl: string }> {
    const response = await apiService.post<{ downloadUrl: string }>('/admin/analytics/export', dateRange);
    return response.data;
  }

  // Content Crawling
  async triggerCrawl(sourceId?: string): Promise<{ message: string; jobId: string }> {
    const response = await apiService.post<{ message: string; jobId: string }>('/admin/crawl/trigger', {
      sourceId,
    });
    return response.data;
  }

  async getCrawlStatus(jobId: string): Promise<{
    jobId: string;
    status: 'running' | 'completed' | 'failed';
    progress: number;
    resultCount: number;
    errors?: string[];
  }> {
    const response = await apiService.get<{
      jobId: string;
      status: 'running' | 'completed' | 'failed';
      progress: number;
      resultCount: number;
      errors?: string[];
    }>(`/admin/crawl/status/${jobId}`);
    return response.data;
  }

  async addCrawlSource(source: Omit<CrawlingSource, 'id' | 'lastCrawled'>): Promise<CrawlingSource> {
    const response = await apiService.post<CrawlingSource>('/admin/crawl/sources', source);
    return response.data;
  }

  async updateCrawlSource(sourceId: string, source: Partial<CrawlingSource>): Promise<CrawlingSource> {
    const response = await apiService.put<CrawlingSource>(`/admin/crawl/sources/${sourceId}`, source);
    return response.data;
  }

  async deleteCrawlSource(sourceId: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(`/admin/crawl/sources/${sourceId}`);
    return response.data;
  }
}

export const adminService = new AdminService();