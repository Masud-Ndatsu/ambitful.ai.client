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
import {
  AdminOpportunity,
  AdminOpportunityFilters,
  AdminOpportunitiesResponse,
  CreateOpportunityData,
  UpdateOpportunityData,
  BulkActionData,
  OpportunityAnalytics,
} from "@/types/admin-opportunity";

export class AdminService {
  // System Settings
  async getSystemSettings(): Promise<SystemSettings> {
    return await apiService.get<SystemSettings>("/admin/settings");
  }

  async updateSystemSettings(
    settings: Partial<SystemSettings>
  ): Promise<SystemSettings> {
    return await apiService.put<SystemSettings>("/admin/settings", settings);
  }

  // Notifications
  async getAdminNotifications(): Promise<AdminNotification[]> {
    const response = await apiService.get<AdminNotification[]>(
      "/admin/notifications"
    );
    return response;
  }

  async markNotificationAsRead(
    notificationId: string
  ): Promise<{ message: string }> {
    const response = await apiService.put<{ message: string }>(
      `/admin/notifications/${notificationId}/read`
    );
    return response;
  }

  async markAllNotificationsAsRead(): Promise<{ message: string }> {
    const response = await apiService.put<{ message: string }>(
      "/admin/notifications/mark-all-read"
    );
    return response;
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
    return response;
  }

  async updateUserRole(userId: string, role: string): Promise<AdminUser> {
    const response = await apiService.put<AdminUser>(
      `/admin/users/${userId}/role`,
      { role }
    );
    return response;
  }

  async updateUserStatus(
    userId: string,
    status: "active" | "inactive"
  ): Promise<AdminUser> {
    const response = await apiService.put<AdminUser>(
      `/admin/users/${userId}/status`,
      { status }
    );
    return response;
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(
      `/admin/users/${userId}`
    );
    return response;
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
    return response;
  }

  async approveDraft(
    draftId: string
  ): Promise<{ message: string; opportunityId: string }> {
    const response = await apiService.post<{
      message: string;
      opportunityId: string;
    }>(`/admin/opportunities/drafts/${draftId}/approve`);
    return response;
  }

  async rejectDraft(
    draftId: string,
    reason?: string
  ): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(
      `/admin/opportunities/drafts/${draftId}/reject`,
      { reason }
    );
    return response;
  }

  async regenerateDraft(draftId: string): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>(
      `/admin/opportunities/drafts/${draftId}/regenerate`
    );
    return response;
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
    return response;
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
    return response;
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
    return response;
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
    return response;
  }

  async addCrawlSource(
    source: Omit<CrawlingSource, "id" | "lastCrawled">
  ): Promise<CrawlingSource> {
    const response = await apiService.post<CrawlingSource>(
      "/admin/crawl/sources",
      source
    );
    return response;
  }

  async updateCrawlSource(
    sourceId: string,
    source: Partial<CrawlingSource>
  ): Promise<CrawlingSource> {
    const response = await apiService.put<CrawlingSource>(
      `/admin/crawl/sources/${sourceId}`,
      source
    );
    return response;
  }

  async deleteCrawlSource(sourceId: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(
      `/admin/crawl/sources/${sourceId}`
    );
    return response;
  }

  // Opportunity Management
  async getAdminOpportunities(
    filters: AdminOpportunityFilters = {}
  ): Promise<AdminOpportunitiesResponse> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiService.get<AdminOpportunitiesResponse>(
      `/admin/opportunities?${queryParams.toString()}`
    );
  }

  async createOpportunity(
    data: CreateOpportunityData
  ): Promise<AdminOpportunity> {
    return await apiService.post<AdminOpportunity>(
      "/admin/opportunities",
      data
    );
  }

  async updateOpportunity(
    id: string,
    data: UpdateOpportunityData
  ): Promise<AdminOpportunity> {
    return await apiService.put<AdminOpportunity>(
      `/admin/opportunities/${id}`,
      data
    );
  }

  async deleteOpportunity(id: string): Promise<{ message: string }> {
    return await apiService.delete<{ message: string }>(
      `/admin/opportunities/${id}`
    );
  }

  async bulkActionOpportunities(
    data: BulkActionData
  ): Promise<{ message: string; affected: number }> {
    return await apiService.post<{ message: string; affected: number }>(
      "/admin/opportunities/bulk-action",
      data
    );
  }

  async getOpportunityAnalytics(id: string): Promise<OpportunityAnalytics> {
    return await apiService.get<OpportunityAnalytics>(
      `/admin/opportunities/${id}/analytics`
    );
  }
}

export const adminService = new AdminService();
