/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiService } from "./api";
import {
  AdminNotification,
  SystemSettings,
  AdminUser,
  CrawlingSource,
  AnalyticsData,
  OpportunityDraft,
  CrawlJobStatus,
  AdminUsersResponse,
  OpportunityDraftsResponse,
  ApproveDraftResponse,
  MessageResponse,
  TriggerCrawlResponse,
  ExportAnalyticsResponse,
  UserFilters,
  AnalyticsDateRange,
  ExportAnalyticsRequest,
} from "@/types";

export class AdminService {
  // System Settings
  async getSystemSettings(): Promise<SystemSettings> {
    const response = await apiService.get<SystemSettings>("/admin/settings");
    return response.data;
  }

  async updateSystemSettings(
    settings: Partial<SystemSettings>
  ): Promise<SystemSettings> {
    const response = await apiService.put<SystemSettings>(
      "/admin/settings",
      settings
    );
    return response.data;
  }

  // Notifications
  async getAdminNotifications(): Promise<AdminNotification[]> {
    const response = await apiService.get<AdminNotification[]>(
      "/admin/notifications"
    );
    return response.data;
  }

  async markNotificationAsRead(
    notificationId: string
  ): Promise<{ message: string }> {
    const response = await apiService.put<{ message: string }>(
      `/admin/notifications/${notificationId}/read`
    );
    return response.data;
  }

  async markAllNotificationsAsRead(): Promise<{ message: string }> {
    const response = await apiService.put<{ message: string }>(
      "/admin/notifications/mark-all-read"
    );
    return response.data;
  }

  // User Management
  async getUsers(
    filters: {
      search?: string;
      role?: string;
      status?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
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
    const response = await apiService.put<AdminUser>(
      `/admin/users/${userId}/role`,
      { role }
    );
    return response.data;
  }

  async updateUserStatus(
    userId: string,
    status: "active" | "inactive"
  ): Promise<AdminUser> {
    const response = await apiService.put<AdminUser>(
      `/admin/users/${userId}/status`,
      { status }
    );
    return response.data;
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(
      `/admin/users/${userId}`
    );
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
      status: "pending" | "approved" | "rejected";
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
        status: "pending" | "approved" | "rejected";
        extractedData: Record<string, any>;
      }>;
    }>("/admin/opportunities/drafts");
    return response.data;
  }

  async approveDraft(
    draftId: string
  ): Promise<{ message: string; opportunityId: string }> {
    const response = await apiService.post<{
      message: string;
      opportunityId: string;
    }>(`/admin/opportunities/drafts/${draftId}/approve`);
    return response.data;
  }

  async rejectDraft(
    draftId: string,
    reason?: string
  ): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(
      `/admin/opportunities/drafts/${draftId}/reject`,
      { reason }
    );
    return response.data;
  }

  async regenerateDraft(draftId: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(
      `/admin/opportunities/drafts/${draftId}/regenerate`
    );
    return response.data;
  }

  // Analytics
  async getAnalytics(dateRange: {
    startDate: string;
    endDate: string;
    granularity?: "daily" | "weekly" | "monthly";
  }): Promise<AnalyticsData> {
    const queryParams = new URLSearchParams({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      granularity: dateRange.granularity || "daily",
    });

    const response = await apiService.get<AnalyticsData>(
      `/admin/analytics?${queryParams.toString()}`
    );
    return response.data;
  }

  async exportAnalytics(dateRange: {
    startDate: string;
    endDate: string;
    format: "csv" | "xlsx" | "json";
  }): Promise<{ downloadUrl: string }> {
    const response = await apiService.post<{ downloadUrl: string }>(
      "/admin/analytics/export",
      dateRange
    );
    return response.data;
  }

  // Content Crawling
  async triggerCrawl(
    sourceId?: string
  ): Promise<{ message: string; jobId: string }> {
    const response = await apiService.post<{ message: string; jobId: string }>(
      "/admin/crawl/trigger",
      {
        sourceId,
      }
    );
    return response.data;
  }

  async getCrawlStatus(jobId: string): Promise<{
    jobId: string;
    status: "running" | "completed" | "failed";
    progress: number;
    resultCount: number;
    errors?: string[];
  }> {
    const response = await apiService.get<{
      jobId: string;
      status: "running" | "completed" | "failed";
      progress: number;
      resultCount: number;
      errors?: string[];
    }>(`/admin/crawl/status/${jobId}`);
    return response.data;
  }

  async addCrawlSource(
    source: Omit<CrawlingSource, "id" | "lastCrawled">
  ): Promise<CrawlingSource> {
    const response = await apiService.post<CrawlingSource>(
      "/admin/crawl/sources",
      source
    );
    return response.data;
  }

  async updateCrawlSource(
    sourceId: string,
    source: Partial<CrawlingSource>
  ): Promise<CrawlingSource> {
    const response = await apiService.put<CrawlingSource>(
      `/admin/crawl/sources/${sourceId}`,
      source
    );
    return response.data;
  }

  async deleteCrawlSource(sourceId: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(
      `/admin/crawl/sources/${sourceId}`
    );
    return response.data;
  }
}

export const adminService = new AdminService();
