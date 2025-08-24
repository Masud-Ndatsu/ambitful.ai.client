/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { useApi, useMutation } from "./use-api";
import { adminService } from "@/services/adminService";
import { CrawlingSource } from "@/types/admin";

export interface CrawlerFilters {
  page?: number;
  limit?: number;
  status?: "active" | "paused" | "disabled";
}

export interface CrawlStats {
  totalSources: number;
  activeSources: number;
  totalCrawls: number;
  successfulCrawls: number;
  failedCrawls: number;
  avgCrawlTime: number;
  lastCrawlTime?: string;
}

export interface CrawlSourcesResponse {
  sources: CrawlingSource[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateCrawlSourceData {
  name: string;
  url: string;
  frequency: "hourly" | "daily" | "weekly" | "monthly";
  maxResults: number;
  status: "active" | "paused" | "disabled";
}

export function useCrawler(initialFilters: CrawlerFilters = {}) {
  const [filters, setFilters] = useState<CrawlerFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  // Get crawl sources with pagination and filters
  const {
    data: sourcesData,
    loading: loadingSources,
    error: sourcesError,
    refetch: refetchSources,
  } = useApi<CrawlSourcesResponse>(
    () => adminService.getCrawlSources(filters),
    {
      deps: [filters],
    }
  );

  console.log({ sourcesData });

  // Get crawler statistics
  const {
    data: stats,
    loading: loadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useApi<CrawlStats>(() => adminService.getCrawlStats(), { deps: [] });

  // Create source mutation
  const createSourceMutation = useMutation<
    CrawlingSource,
    CreateCrawlSourceData
  >((sourceData) => adminService.createCrawlSource(sourceData));

  // Update source mutation
  const updateSourceMutation = useMutation<
    CrawlingSource,
    { id: string; data: Partial<CrawlingSource> }
  >(({ id, data }) => adminService.updateCrawlSource(id, data));

  // Delete source mutation
  const deleteSourceMutation = useMutation<{ message: string }, string>((id) =>
    adminService.deleteCrawlSource(id)
  );

  // Pause source mutation
  const pauseSourceMutation = useMutation<{ message: string }, string>((id) =>
    adminService.pauseCrawlSource(id)
  );

  // Resume source mutation
  const resumeSourceMutation = useMutation<{ message: string }, string>((id) =>
    adminService.resumeCrawlSource(id)
  );

  // Disable source mutation
  const disableSourceMutation = useMutation<{ message: string }, string>((id) =>
    adminService.disableCrawlSource(id)
  );

  // Start crawl mutation
  const startCrawlMutation = useMutation<
    { message: string; jobId?: string },
    string
  >((id) => adminService.startCrawl(id));

  // Methods
  const getSourceById = useCallback(
    async (id: string): Promise<CrawlingSource> => {
      return await adminService.getCrawlSourceById(id);
    },
    []
  );

  const createSource = useCallback(
    async (sourceData: CreateCrawlSourceData) => {
      const result = await createSourceMutation.mutate(sourceData);
      await refetchSources();
      await refetchStats();
      return result;
    },
    [createSourceMutation, refetchSources, refetchStats]
  );

  const updateSource = useCallback(
    async (id: string, data: Partial<CrawlingSource>) => {
      const result = await updateSourceMutation.mutate({ id, data });
      await refetchSources();
      await refetchStats();
      return result;
    },
    [updateSourceMutation, refetchSources, refetchStats]
  );

  const deleteSource = useCallback(
    async (id: string) => {
      const result = await deleteSourceMutation.mutate(id);
      await refetchSources();
      await refetchStats();
      return result;
    },
    [deleteSourceMutation, refetchSources, refetchStats]
  );

  const pauseSource = useCallback(
    async (id: string) => {
      const result = await pauseSourceMutation.mutate(id);
      await refetchSources();
      await refetchStats();
      return result;
    },
    [pauseSourceMutation, refetchSources, refetchStats]
  );

  const resumeSource = useCallback(
    async (id: string) => {
      const result = await resumeSourceMutation.mutate(id);
      await refetchSources();
      await refetchStats();
      return result;
    },
    [resumeSourceMutation, refetchSources, refetchStats]
  );

  const disableSource = useCallback(
    async (id: string) => {
      const result = await disableSourceMutation.mutate(id);
      await refetchSources();
      await refetchStats();
      return result;
    },
    [disableSourceMutation, refetchSources, refetchStats]
  );

  const startCrawl = useCallback(
    async (id: string) => {
      const result = await startCrawlMutation.mutate(id);
      await refetchSources();
      await refetchStats();
      return result;
    },
    [startCrawlMutation, refetchSources, refetchStats]
  );

  // Filter management
  const updateFilters = useCallback((newFilters: Partial<CrawlerFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 10 });
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const setStatus = useCallback((status: "active" | "paused" | "disabled") => {
    setFilters((prev) => ({ ...prev, status: status || undefined, page: 1 }));
  }, []);

  const refetch = useCallback(() => {
    refetchSources();
    refetchStats();
  }, [refetchSources, refetchStats]);

  console.log({ sourcesData });

  return {
    // Data
    sources: sourcesData?.sources || [],
    total: sourcesData?.total || 0,
    page: sourcesData?.page || 1,
    totalPages: sourcesData?.totalPages || 1,
    stats: stats || null,
    filters,

    // Loading states
    loading: loadingSources,
    loadingStats,
    creating: createSourceMutation.loading,
    updating: updateSourceMutation.loading,
    deleting: deleteSourceMutation.loading,
    pausing: pauseSourceMutation.loading,
    resuming: resumeSourceMutation.loading,
    disabling: disableSourceMutation.loading,
    crawling: startCrawlMutation.loading,

    // Error states
    error: sourcesError,
    statsError,
    createError: createSourceMutation.error,
    updateError: updateSourceMutation.error,
    deleteError: deleteSourceMutation.error,
    pauseError: pauseSourceMutation.error,
    resumeError: resumeSourceMutation.error,
    disableError: disableSourceMutation.error,
    crawlError: startCrawlMutation.error,

    // Methods
    getSourceById,
    createSource,
    updateSource,
    deleteSource,
    pauseSource,
    resumeSource,
    disableSource,
    startCrawl,
    refetch,
    refetchSources,
    refetchStats,

    // Filter methods
    updateFilters,
    resetFilters,
    setPage,
    setLimit,
    setStatus,

    // Mutation reset methods
    resetCreateError: createSourceMutation.reset,
    resetUpdateError: updateSourceMutation.reset,
    resetDeleteError: deleteSourceMutation.reset,
    resetPauseError: pauseSourceMutation.reset,
    resetResumeError: resumeSourceMutation.reset,
    resetDisableError: disableSourceMutation.reset,
    resetCrawlError: startCrawlMutation.reset,
  };
}
