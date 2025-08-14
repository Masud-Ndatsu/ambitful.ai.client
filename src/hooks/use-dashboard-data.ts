import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import {
  GetDashboardSummaryResponse,
  GetDetailedMetricsResponse,
} from "@/types/admin-service";

interface DashboardData {
  summary: GetDashboardSummaryResponse;
  metrics: GetDetailedMetricsResponse;
  draftStats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byPriority: { high: number; medium: number; low: number };
  };
  pendingDrafts: Array<{
    id: string;
    title: string;
    source: string;
    status: "pending" | "approved" | "rejected";
    priority: "high" | "medium" | "low";
    createdAt: string;
  }>;
}

interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summary, metrics, draftStats, draftsResponse] = await Promise.all([
        adminService.getDashboardSummary(),
        adminService.getDetailedMetrics("30d"),
        adminService.getAIDraftStats(),
        adminService.getAIDrafts({ status: "pending", limit: 10 }),
      ]);

      setData({
        summary,
        metrics,
        draftStats,
        pendingDrafts: draftsResponse.drafts,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
