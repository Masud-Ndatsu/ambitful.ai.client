/* eslint-disable @typescript-eslint/no-explicit-any */
import { AIDraft } from "@/hooks/use-ai-drafts";
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
import {
  GetDashboardSummaryResponse,
  GetDetailedMetricsResponse,
} from "@/types/admin-service";

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

  async getUserActivity(userId: string): Promise<
    Array<{
      id: string;
      type: string;
      action: string;
      details: string;
      timestamp: string;
      date: string;
    }>
  > {
    const response = await apiService.get<
      Array<{
        id: string;
        type: string;
        action: string;
        details: string;
        timestamp: string;
        date: string;
      }>
    >(`/admin/users/${userId}/activity`);
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

  // Crawler Management - Updated to match backend routes

  // Crawl Source Management
  async getCrawlSources(
    filters: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<{
    sources: CrawlingSource[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Convert status to uppercase for backend
        const apiValue =
          key === "status" ? value.toString().toUpperCase() : value.toString();
        queryParams.append(key, apiValue);
      }
    });

    const result = await apiService.get<any>(
      `/crawler/sources?${queryParams.toString()}`
    );

    console.log({ result });

    // Convert backend response to lowercase for frontend
    return {
      ...result,
      sources: result?.map((source: any) => ({
        ...source,
        status: source.status.toLowerCase(),
        frequency: source.frequency.toLowerCase(),
      })),
    };
  }

  async getActiveCrawlSources(): Promise<CrawlingSource[]> {
    const result = await apiService.get<any[]>("/crawler/sources/active");
    // Convert backend response to lowercase for frontend
    return result?.map((source: any) => ({
      ...source,
      status: source.status.toLowerCase(),
      frequency: source.frequency.toLowerCase(),
    }));
  }

  async getCrawlSourcesDueForCrawl(): Promise<CrawlingSource[]> {
    const result = await apiService.get<any[]>("/crawler/sources/due");
    // Convert backend response to lowercase for frontend
    return result?.map((source: any) => ({
      ...source,
      status: source.status.toLowerCase(),
      frequency: source.frequency.toLowerCase(),
    }));
  }

  async getCrawlSourceById(id: string): Promise<CrawlingSource> {
    const result = await apiService.get<any>(`/crawler/sources/${id}`);
    // Convert backend response to lowercase for frontend
    return {
      ...result,
      status: result.status.toLowerCase(),
      frequency: result.frequency.toLowerCase(),
    };
  }

  async createCrawlSource(
    source: Omit<
      CrawlingSource,
      "id" | "lastCrawl" | "lastSuccess" | "createdAt" | "updatedAt"
    >
  ): Promise<CrawlingSource> {
    // Convert frontend lowercase to backend uppercase
    const backendSource = {
      ...source,
      status: source.status.toUpperCase(),
      frequency: source.frequency.toUpperCase(),
    };

    const result = await apiService.post<any>(
      "/crawler/sources",
      backendSource
    );

    // Convert backend response back to lowercase for frontend
    return {
      ...result,
      status: result.status.toLowerCase(),
      frequency: result.frequency.toLowerCase(),
    };
  }

  async updateCrawlSource(
    id: string,
    source: Partial<CrawlingSource>
  ): Promise<CrawlingSource> {
    // Convert frontend lowercase to backend uppercase
    const backendSource = {
      ...source,
      ...(source.status && { status: source.status.toUpperCase() }),
      ...(source.frequency && { frequency: source.frequency.toUpperCase() }),
    };

    const result = await apiService.put<any>(
      `/crawler/sources/${id}`,
      backendSource
    );

    // Convert backend response back to lowercase for frontend
    return {
      ...result,
      status: result.status.toLowerCase(),
      frequency: result.frequency.toLowerCase(),
    };
  }

  async deleteCrawlSource(id: string): Promise<{ message: string }> {
    return await apiService.delete<{ message: string }>(
      `/crawler/sources/${id}`
    );
  }

  // Crawl Source Actions
  async pauseCrawlSource(id: string): Promise<{ message: string }> {
    return await apiService.post<{ message: string }>(
      `/crawler/sources/${id}/pause`
    );
  }

  async resumeCrawlSource(id: string): Promise<{ message: string }> {
    return await apiService.post<{ message: string }>(
      `/crawler/sources/${id}/resume`
    );
  }

  async disableCrawlSource(id: string): Promise<{ message: string }> {
    return await apiService.post<{ message: string }>(
      `/crawler/sources/${id}/disable`
    );
  }

  async startCrawl(id: string): Promise<{ message: string; jobId?: string }> {
    return await apiService.post<{ message: string; jobId?: string }>(
      `/crawler/sources/${id}/crawl`
    );
  }

  // Monitoring & Logs
  async getSourceHealth(id: string): Promise<{
    sourceId: string;
    status: string;
    lastCrawl: string;
    lastSuccess: boolean;
    errorCount: number;
    avgResponseTime: number;
  }> {
    return await apiService.get<{
      sourceId: string;
      status: string;
      lastCrawl: string;
      lastSuccess: boolean;
      errorCount: number;
      avgResponseTime: number;
    }>(`/crawler/sources/${id}/health`);
  }

  async getCrawlLogs(
    id: string,
    filters: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<{
    logs: Array<{
      id: string;
      status: string;
      startTime: string;
      endTime?: string;
      itemsFound: number;
      errorMessage?: string;
    }>;
    total: number;
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiService.get<{
      logs: Array<{
        id: string;
        status: string;
        startTime: string;
        endTime?: string;
        itemsFound: number;
        errorMessage?: string;
      }>;
      total: number;
    }>(`/crawler/sources/${id}/logs?${queryParams.toString()}`);
  }

  async getRecentCrawlLogs(
    filters: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    logs: Array<{
      id: string;
      sourceId: string;
      sourceName: string;
      status: string;
      startTime: string;
      endTime?: string;
      itemsFound: number;
      errorMessage?: string;
    }>;
    total: number;
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiService.get<{
      logs: Array<{
        id: string;
        sourceId: string;
        sourceName: string;
        status: string;
        startTime: string;
        endTime?: string;
        itemsFound: number;
        errorMessage?: string;
      }>;
      total: number;
    }>(`/crawler/logs?${queryParams.toString()}`);
  }

  async getCrawlStats(): Promise<{
    totalSources: number;
    activeSources: number;
    totalCrawls: number;
    successfulCrawls: number;
    failedCrawls: number;
    avgCrawlTime: number;
    lastCrawlTime?: string;
  }> {
    return await apiService.get<{
      totalSources: number;
      activeSources: number;
      totalCrawls: number;
      successfulCrawls: number;
      failedCrawls: number;
      avgCrawlTime: number;
      lastCrawlTime?: string;
    }>("/crawler/stats");
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

  // Dashboard specific endpoints
  async getDashboardSummary(): Promise<GetDashboardSummaryResponse> {
    return await apiService.get<GetDashboardSummaryResponse>(
      "/admin/analytics/dashboard"
    );
  }

  async getAIDraftStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byPriority: { high: number; medium: number; low: number };
  }> {
    return await apiService.get<{
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      byPriority: { high: number; medium: number; low: number };
    }>("/admin/ai-drafts-stats");
  }

  async getDetailedMetrics(
    period: "7d" | "30d" | "90d" = "30d"
  ): Promise<GetDetailedMetricsResponse> {
    return await apiService.get<GetDetailedMetricsResponse>(
      `/admin/analytics/detailed?period=${period}`
    );
  }

  async getAIDrafts(
    filters: {
      page?: number;
      limit?: number;
      status?: "pending" | "approved" | "rejected";
      priority?: "high" | "medium" | "low";
    } = {}
  ): Promise<{
    drafts: Array<AIDraft>;
    total: number;
    pending: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return await apiService.get<{
      drafts: Array<AIDraft>;
      total: number;
      pending: number;
      page: number;
      totalPages: number;
    }>(`/admin/ai-drafts?${queryParams.toString()}`);
  }

  async getAIDraftById(id: string): Promise<any> {
    return await apiService.get(`/admin/ai-drafts/${id}`);
  }

  async reviewAIDraft(
    id: string,
    action: "approve" | "reject" | "edit",
    feedback?: string,
    edits?: any
  ): Promise<{ message: string; opportunity?: any }> {
    return await apiService.post(`/admin/ai-drafts/${id}/review`, {
      action,
      feedback,
      edits,
    });
  }

  async deleteAIDraft(id: string): Promise<{ message: string }> {
    return await apiService.delete(`/admin/ai-drafts/${id}`);
  }

  async regenerateAIDraft(
    id: string
  ): Promise<{ message: string; draft: any }> {
    return await apiService.post(`/admin/ai-drafts/${id}/regenerate`);
  }

  async updateAIDraftPriority(
    id: string,
    priority: "high" | "medium" | "low"
  ): Promise<{ message: string }> {
    return await apiService.put(`/admin/ai-drafts/${id}/priority`, {
      priority,
    });
  }

  async bulkReviewAIDrafts(
    draftIds: string[],
    action: "approve" | "reject"
  ): Promise<{ message: string; processed: number }> {
    return await apiService.post(`/admin/ai-drafts/bulk-review`, {
      draftIds,
      action,
    });
  }

  async bulkDeleteAIDrafts(
    draftIds: string[]
  ): Promise<{ message: string; deleted: number }> {
    return await apiService.post(`/admin/ai-drafts/bulk-delete`, { draftIds });
  }
}

export const adminService = new AdminService();
