/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { useApi, useMutation } from "./use-api";
import { adminService } from "@/services/adminService";

type DraftStatus = "pending" | "approved" | "rejected" | "draft";
type DraftPriority = "high" | "medium" | "low";
type OpportunityType =
  | "scholarship"
  | "grant"
  | "job"
  | "internship"
  | "competition"
  | "training"
  | "fellowship";

export interface AIDraft {
  id: string;
  source: string;
  status: DraftStatus;
  priority: DraftPriority;
  dateScraped: Date;
  rawContent: string;

  // Extracted opportunity fields
  extractedTitle: string;
  extractedType: OpportunityType;
  extractedDescription: string;
  extractedDeadline?: Date | null;
  extractedLocation?: string | null;
  extractedAmount?: string | null;
  extractedLink?: string | null;
  extractedCategory?: string | null;

  // Extracted detail fields
  extractedFullDescription?: string | null;
  extractedApplicationInstructions: string[];
  extractedEligibility: string[];
  extractedBenefits: string[];

  // Review fields
  feedback?: string | null;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
  opportunityId?: string | null;
}

export interface DraftFilters {
  status?: string;
  priority?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DraftStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byPriority: { high: number; medium: number; low: number };
}

export interface AIDraftsApiResponse {
  drafts: Array<AIDraft>;
  total: number;
  pending: number;
  page: number;
  totalPages: number;
}

export function useAIDrafts(initialFilters: DraftFilters = {}) {
  const [filters, setFilters] = useState<DraftFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  // Get AI drafts with pagination and filters
  const {
    data: draftsData,
    loading: loadingDrafts,
    error: draftsError,
    refetch: refetchDrafts,
  } = useApi<AIDraftsApiResponse>(
    () =>
      adminService.getAIDrafts({
        ...filters,
        status:
          filters.status === "pending" ||
          filters.status === "approved" ||
          filters.status === "rejected"
            ? (filters.status as "pending" | "approved" | "rejected")
            : undefined,
        priority:
          filters.priority === "high" ||
          filters.priority === "medium" ||
          filters.priority === "low"
            ? (filters.priority as "high" | "medium" | "low")
            : undefined,
      }),
    {
      deps: [filters],
    }
  );

  // Get draft statistics
  const {
    data: stats,
    loading: loadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useApi<DraftStats>(() => adminService.getAIDraftStats(), { deps: [] });

  // Review draft mutation
  const reviewDraftMutation = useMutation<
    { message: string; opportunity?: any },
    {
      id: string;
      action: "approve" | "reject" | "edit";
      feedback?: string;
      edits?: any;
    }
  >(({ id, action, feedback, edits }) =>
    adminService.reviewAIDraft(id, action, feedback, edits)
  );

  // Delete draft mutation
  const deleteDraftMutation = useMutation<{ message: string }, string>((id) =>
    adminService.deleteAIDraft(id)
  );

  // Regenerate draft mutation
  const regenerateDraftMutation = useMutation<
    { message: string; draft: any },
    string
  >((id) => adminService.regenerateAIDraft(id));

  // Update priority mutation
  const updatePriorityMutation = useMutation<
    { message: string },
    { id: string; priority: "high" | "medium" | "low" }
  >(({ id, priority }) => adminService.updateAIDraftPriority(id, priority));

  // Bulk review mutation
  const bulkReviewMutation = useMutation<
    { message: string; processed: number },
    { ids: string[]; action: "approve" | "reject" }
  >(({ ids, action }) => adminService.bulkReviewAIDrafts(ids, action));

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation<
    { message: string; deleted: number },
    string[]
  >((ids) => adminService.bulkDeleteAIDrafts(ids));

  // Methods
  const getDraftById = useCallback(async (id: string): Promise<AIDraft> => {
    const response = await adminService.getAIDraftById(id);
    // Transform the API response to match AIDraft interface using individual extracted fields
    return {
      id: response.id,
      source: response.source,
      status: response.status.toLowerCase() as DraftStatus,
      priority: response.priority.toLowerCase() as DraftPriority,
      dateScraped: new Date(response.dateScraped || response.createdAt),
      rawContent: response.rawContent || "",
      extractedTitle: response.extractedTitle || response.title || "",
      extractedType: response.extractedType || "scholarship",
      extractedDescription: response.extractedDescription || "",
      extractedDeadline: response.extractedDeadline
        ? new Date(response.extractedDeadline)
        : null,
      extractedLocation: response.extractedLocation || null,
      extractedAmount: response.extractedAmount || null,
      extractedLink: response.extractedLink || null,
      extractedCategory: response.extractedCategory || null,
      extractedFullDescription: response.extractedFullDescription || null,
      extractedApplicationInstructions:
        response.extractedApplicationInstructions || [],
      extractedEligibility: response.extractedEligibility || [],
      extractedBenefits: response.extractedBenefits || [],
      feedback: response.feedback || null,
      reviewedAt: response.reviewedAt ? new Date(response.reviewedAt) : null,
      reviewedBy: response.reviewedBy || null,
      opportunityId: response.opportunityId || null,
    };
  }, []);

  const reviewDraft = useCallback(
    async (
      id: string,
      action: "approve" | "reject" | "edit",
      feedback?: string,
      edits?: any
    ) => {
      const result = await reviewDraftMutation.mutate({
        id,
        action,
        feedback,
        edits,
      });
      await refetchDrafts();
      await refetchStats();
      return result;
    },
    [reviewDraftMutation, refetchDrafts, refetchStats]
  );

  const deleteDraft = useCallback(
    async (id: string) => {
      const result = await deleteDraftMutation.mutate(id);
      await refetchDrafts();
      await refetchStats();
      return result;
    },
    [deleteDraftMutation, refetchDrafts, refetchStats]
  );

  const regenerateDraft = useCallback(
    async (id: string) => {
      const result = await regenerateDraftMutation.mutate(id);
      await refetchDrafts();
      await refetchStats();
      return result;
    },
    [regenerateDraftMutation, refetchDrafts, refetchStats]
  );

  const updateDraftPriority = useCallback(
    async (id: string, priority: "high" | "medium" | "low") => {
      const result = await updatePriorityMutation.mutate({ id, priority });
      await refetchDrafts();
      await refetchStats();
      return result;
    },
    [updatePriorityMutation, refetchDrafts, refetchStats]
  );

  const bulkReview = useCallback(
    async (ids: string[], action: "approve" | "reject") => {
      const result = await bulkReviewMutation.mutate({ ids, action });
      await refetchDrafts();
      await refetchStats();
      return result;
    },
    [bulkReviewMutation, refetchDrafts, refetchStats]
  );

  const bulkDeleteDrafts = useCallback(
    async (ids: string[]) => {
      const result = await bulkDeleteMutation.mutate(ids);
      await refetchDrafts();
      await refetchStats();
      return result;
    },
    [bulkDeleteMutation, refetchDrafts, refetchStats]
  );

  // Filter management
  const updateFilters = useCallback((newFilters: Partial<DraftFilters>) => {
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

  const setStatus = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status: status || undefined, page: 1 }));
  }, []);

  const setPriority = useCallback((priority: string) => {
    setFilters((prev) => ({
      ...prev,
      priority: priority || undefined,
      page: 1,
    }));
  }, []);

  const setSource = useCallback((source: string) => {
    setFilters((prev) => ({
      ...prev,
      source: source || undefined,
      page: 1,
    }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search: search.trim() || undefined,
      page: 1,
    }));
  }, []);

  const refetch = useCallback(() => {
    refetchDrafts();
    refetchStats();
  }, [refetchDrafts, refetchStats]);

  return {
    // Data - Use the drafts as they come from the API (they should have extracted fields)
    drafts: draftsData?.drafts || [],
    total: draftsData?.total || 0,
    page: draftsData?.page || 1,
    totalPages: draftsData?.totalPages || 1,
    stats: stats || null,
    filters,

    // Loading states
    loading: loadingDrafts,
    loadingStats,
    reviewing: reviewDraftMutation.loading,
    deleting: deleteDraftMutation.loading,
    regenerating: regenerateDraftMutation.loading,
    updatingPriority: updatePriorityMutation.loading,
    bulkReviewing: bulkReviewMutation.loading,
    bulkDeleting: bulkDeleteMutation.loading,

    // Error states
    error: draftsError,
    statsError,
    reviewError: reviewDraftMutation.error,
    deleteError: deleteDraftMutation.error,
    regenerateError: regenerateDraftMutation.error,
    updatePriorityError: updatePriorityMutation.error,
    bulkReviewError: bulkReviewMutation.error,
    bulkDeleteError: bulkDeleteMutation.error,

    // Methods
    getDraftById,
    reviewDraft,
    deleteDraft,
    regenerateDraft,
    updateDraftPriority,
    bulkReview,
    bulkDeleteDrafts,
    refetch,
    refetchDrafts,
    refetchStats,

    // Filter methods
    updateFilters,
    resetFilters,
    setPage,
    setLimit,
    setStatus,
    setPriority,
    setSource,
    setSearch,

    // Mutation reset methods
    resetReviewError: reviewDraftMutation.reset,
    resetDeleteError: deleteDraftMutation.reset,
    resetRegenerateError: regenerateDraftMutation.reset,
    resetUpdatePriorityError: updatePriorityMutation.reset,
    resetBulkReviewError: bulkReviewMutation.reset,
    resetBulkDeleteError: bulkDeleteMutation.reset,
  };
}
