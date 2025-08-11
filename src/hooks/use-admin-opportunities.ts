import { useState, useCallback } from "react";
import { useApi, useMutation } from "./use-api";
import { adminService } from "@/services/adminService";
import type {
  AdminOpportunity,
  AdminOpportunityFilters,
  AdminOpportunitiesResponse,
  CreateOpportunityData,
  UpdateOpportunityData,
  BulkActionData,
  OpportunityAnalytics,
  OpportunityStats,
} from "@/types/admin-opportunity";

export function useAdminOpportunities() {
  const [filters, setFilters] = useState<AdminOpportunityFilters>({
    page: 1,
    limit: 10,
  });

  // Get admin opportunities with pagination and stats
  const {
    data: opportunitiesData,
    loading: loadingOpportunities,
    error: opportunitiesError,
    refetch: refetchOpportunities,
  } = useApi<AdminOpportunitiesResponse>(
    () => adminService.getAdminOpportunities(filters),
    { deps: [filters] }
  );

  // Create opportunity mutation
  const createOpportunityMutation = useMutation<
    AdminOpportunity,
    CreateOpportunityData
  >((data: CreateOpportunityData) => adminService.createOpportunity(data));

  // Update opportunity mutation
  const updateOpportunityMutation = useMutation<
    AdminOpportunity,
    { id: string; data: UpdateOpportunityData }
  >(({ id, data }) => adminService.updateOpportunity(id, data));

  // Delete opportunity mutation
  const deleteOpportunityMutation = useMutation<{ message: string }, string>(
    (id: string) => adminService.deleteOpportunity(id)
  );

  // Bulk action mutation
  const bulkActionMutation = useMutation<
    { message: string; affected: number },
    BulkActionData
  >((data: BulkActionData) => adminService.bulkActionOpportunities(data));

  // Get opportunity analytics
  const getOpportunityAnalytics = useCallback(
    async (id: string): Promise<OpportunityAnalytics> => {
      return await adminService.getOpportunityAnalytics(id);
    },
    []
  );

  // Admin methods
  const createOpportunity = useCallback(
    async (data: CreateOpportunityData) => {
      const result = await createOpportunityMutation.mutate(data);
      await refetchOpportunities();
      return result;
    },
    [createOpportunityMutation, refetchOpportunities]
  );

  const updateOpportunity = useCallback(
    async (id: string, data: UpdateOpportunityData) => {
      const result = await updateOpportunityMutation.mutate({ id, data });
      await refetchOpportunities();
      return result;
    },
    [updateOpportunityMutation, refetchOpportunities]
  );

  const deleteOpportunity = useCallback(
    async (id: string) => {
      const result = await deleteOpportunityMutation.mutate(id);
      await refetchOpportunities();
      return result;
    },
    [deleteOpportunityMutation, refetchOpportunities]
  );

  const bulkAction = useCallback(
    async (ids: string[], action: "publish" | "archive" | "delete") => {
      const result = await bulkActionMutation.mutate({ ids, action });
      await refetchOpportunities();
      return result;
    },
    [bulkActionMutation, refetchOpportunities]
  );

  const publishOpportunity = useCallback(
    async (id: string) => {
      return await updateOpportunity(id, { status: "published" });
    },
    [updateOpportunity]
  );

  const archiveOpportunity = useCallback(
    async (id: string) => {
      return await updateOpportunity(id, { status: "archived" });
    },
    [updateOpportunity]
  );

  const draftOpportunity = useCallback(
    async (id: string) => {
      return await updateOpportunity(id, { status: "draft" });
    },
    [updateOpportunity]
  );

  // Filter management
  const updateFilters = useCallback(
    (newFilters: Partial<AdminOpportunityFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, limit: 10 });
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setStatus = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
  }, []);

  return {
    // Data
    opportunities: opportunitiesData?.opportunities || [],
    stats: opportunitiesData?.stats || { published: 0, draft: 0, archived: 0 },
    total: opportunitiesData?.total || 0,
    page: opportunitiesData?.page || 1,
    totalPages: opportunitiesData?.totalPages || 1,
    filters,

    // Loading states
    loading: loadingOpportunities,
    creating: createOpportunityMutation.loading,
    updating: updateOpportunityMutation.loading,
    deleting: deleteOpportunityMutation.loading,
    bulkActioning: bulkActionMutation.loading,

    // Error states
    error: opportunitiesError,
    createError: createOpportunityMutation.error,
    updateError: updateOpportunityMutation.error,
    deleteError: deleteOpportunityMutation.error,
    bulkActionError: bulkActionMutation.error,

    // Methods
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    publishOpportunity,
    archiveOpportunity,
    draftOpportunity,
    bulkAction,
    getOpportunityAnalytics,
    refetch: refetchOpportunities,

    // Filter methods
    updateFilters,
    resetFilters,
    setPage,
    setLimit,
    setSearch,
    setStatus,
    setCategory,

    // Mutation reset methods
    resetCreateError: createOpportunityMutation.reset,
    resetUpdateError: updateOpportunityMutation.reset,
    resetDeleteError: deleteOpportunityMutation.reset,
    resetBulkActionError: bulkActionMutation.reset,
  };
}
