import { useState, useCallback } from "react";
import { useApi, useMutation } from "./useApi";
import { useAuth } from "./useAuth";
import { opportunityService } from "@/services/opportunityService";
import type {
  Opportunity,
  OpportunityFilters,
  OpportunityListResponse,
  ApplicationData,
  ApplicationResponse,
  UserApplication,
  ShareOpportunityData,
} from "@/types/opportunity";

export function useOpportunities() {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<OpportunityFilters>({
    page: 1,
    limit: 10,
  });

  // Get opportunities with pagination and filters
  const {
    data: opportunitiesData,
    loading: loadingOpportunities,
    error: opportunitiesError,
    refetch: refetchOpportunities,
  } = useApi<OpportunityListResponse>(
    () => opportunityService.getOpportunities(filters),
    { deps: [filters] }
  );

  // Get featured opportunities
  const {
    data: featuredOpportunities,
    loading: loadingFeatured,
    error: featuredError,
    refetch: refetchFeatured,
  } = useApi<Opportunity[]>(
    () => opportunityService.getFeaturedOpportunities(),
    { deps: [] }
  );

  // Get trending opportunities
  const {
    data: trendingOpportunities,
    loading: loadingTrending,
    error: trendingError,
    refetch: refetchTrending,
  } = useApi<Opportunity[]>(
    () => opportunityService.getTrendingOpportunities(),
    { deps: [] }
  );

  // Get user applications (only if authenticated)
  const {
    data: userApplications,
    loading: loadingApplications,
    error: applicationsError,
    refetch: refetchApplications,
  } = useApi<UserApplication[]>(
    () => opportunityService.getUserApplications(),
    { deps: [isAuthenticated], immediate: isAuthenticated }
  );

  // Get saved opportunities (only if authenticated)
  const {
    data: savedOpportunities,
    loading: loadingSaved,
    error: savedError,
    refetch: refetchSaved,
  } = useApi<OpportunityListResponse>(
    () => opportunityService.getSavedOpportunities(),
    { deps: [isAuthenticated], immediate: isAuthenticated }
  );

  // Apply to opportunity mutation
  const applyToOpportunityMutation = useMutation<
    ApplicationResponse,
    { opportunityId: string; applicationData: ApplicationData }
  >(({ opportunityId, applicationData }) =>
    opportunityService.applyToOpportunity(opportunityId, applicationData)
  );

  // Save opportunity mutation
  const saveOpportunityMutation = useMutation<void, string>((opportunityId) =>
    opportunityService.saveOpportunity(opportunityId)
  );

  // Unsave opportunity mutation
  const unsaveOpportunityMutation = useMutation<void, string>((opportunityId) =>
    opportunityService.unsaveOpportunity(opportunityId)
  );

  // Share opportunity mutation
  const shareOpportunityMutation = useMutation<
    { message: string },
    { opportunityId: string; shareData: ShareOpportunityData }
  >(({ opportunityId, shareData }) =>
    opportunityService.shareOpportunity(opportunityId, shareData)
  );

  // Record view mutation
  const recordViewMutation = useMutation<void, string>((opportunityId) =>
    opportunityService.recordOpportunityView(opportunityId)
  );

  // Methods
  const getOpportunityById = useCallback(
    async (id: string): Promise<Opportunity> => {
      return await opportunityService.getOpportunityById(id);
    },
    []
  );

  const getSimilarOpportunities = useCallback(
    async (id: string, limit?: number): Promise<Opportunity[]> => {
      return await opportunityService.getSimilarOpportunities(id, limit);
    },
    []
  );

  const applyToOpportunity = useCallback(
    async (opportunityId: string, applicationData: ApplicationData) => {
      const result = await applyToOpportunityMutation.mutate({
        opportunityId,
        applicationData,
      });
      if (isAuthenticated) {
        await refetchApplications();
      }
      return result;
    },
    [applyToOpportunityMutation, refetchApplications, isAuthenticated]
  );

  const saveOpportunity = useCallback(
    async (opportunityId: string) => {
      const result = await saveOpportunityMutation.mutate(opportunityId);
      if (isAuthenticated) {
        await refetchSaved();
      }
      return result;
    },
    [saveOpportunityMutation, refetchSaved, isAuthenticated]
  );

  const unsaveOpportunity = useCallback(
    async (opportunityId: string) => {
      const result = await unsaveOpportunityMutation.mutate(opportunityId);
      if (isAuthenticated) {
        await refetchSaved();
      }
      return result;
    },
    [unsaveOpportunityMutation, refetchSaved, isAuthenticated]
  );

  const shareOpportunity = useCallback(
    async (opportunityId: string, shareData: ShareOpportunityData) => {
      return await shareOpportunityMutation.mutate({
        opportunityId,
        shareData,
      });
    },
    [shareOpportunityMutation]
  );

  const recordOpportunityView = useCallback(
    async (opportunityId: string) => {
      return await recordViewMutation.mutate(opportunityId);
    },
    [recordViewMutation]
  );

  // Filter management
  const updateFilters = useCallback(
    (newFilters: Partial<OpportunityFilters>) => {
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
    setFilters((prev) => ({
      ...prev,
      search: search.trim() || undefined,
      page: 1,
    }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category || undefined,
      page: 1,
    }));
  }, []);

  const setLocation = useCallback((location: string) => {
    setFilters((prev) => ({
      ...prev,
      location: location || undefined,
      page: 1,
    }));
  }, []);

  const setType = useCallback((type: string) => {
    setFilters((prev) => ({
      ...prev,
      type: type || undefined,
      page: 1,
    }));
  }, []);

  const setSortBy = useCallback((sortBy: OpportunityFilters["sortBy"]) => {
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  }, []);

  const setRemote = useCallback((remote: boolean) => {
    setFilters((prev) => ({ ...prev, remote, page: 1 }));
  }, []);

  const setSalaryRange = useCallback(
    (salaryMin?: number, salaryMax?: number) => {
      setFilters((prev) => ({ ...prev, salaryMin, salaryMax, page: 1 }));
    },
    []
  );

  const setTags = useCallback((tags: string[]) => {
    setFilters((prev) => ({ ...prev, tags, page: 1 }));
  }, []);

  return {
    // Data
    opportunities: opportunitiesData?.opportunities || [],
    total: opportunitiesData?.total || 0,
    page: opportunitiesData?.page || 1,
    totalPages: opportunitiesData?.totalPages || 1,
    availableFilters: opportunitiesData?.filters || {
      categories: [],
      locations: [],
      types: [],
      tags: [],
    },
    featuredOpportunities: featuredOpportunities || [],
    trendingOpportunities: trendingOpportunities || [],
    userApplications: userApplications || [],
    savedOpportunities: savedOpportunities?.opportunities || [],
    filters,

    // Loading states
    loading: loadingOpportunities,
    loadingFeatured,
    loadingTrending,
    loadingApplications,
    loadingSaved,
    applying: applyToOpportunityMutation.loading,
    saving: saveOpportunityMutation.loading,
    unsaving: unsaveOpportunityMutation.loading,
    sharing: shareOpportunityMutation.loading,
    recordingView: recordViewMutation.loading,

    // Error states
    error: opportunitiesError,
    featuredError,
    trendingError,
    applicationsError,
    savedError,
    applyError: applyToOpportunityMutation.error,
    saveError: saveOpportunityMutation.error,
    unsaveError: unsaveOpportunityMutation.error,
    shareError: shareOpportunityMutation.error,
    recordViewError: recordViewMutation.error,

    // Methods
    getOpportunityById,
    getSimilarOpportunities,
    applyToOpportunity,
    saveOpportunity,
    unsaveOpportunity,
    shareOpportunity,
    recordOpportunityView,
    refetch: refetchOpportunities,
    refetchFeatured,
    refetchTrending,
    refetchApplications,
    refetchSaved,

    // Filter methods
    updateFilters,
    resetFilters,
    setPage,
    setLimit,
    setSearch,
    setCategory,
    setLocation,
    setType,
    setSortBy,
    setRemote,
    setSalaryRange,
    setTags,

    // Mutation reset methods
    resetApplyError: applyToOpportunityMutation.reset,
    resetSaveError: saveOpportunityMutation.reset,
    resetUnsaveError: unsaveOpportunityMutation.reset,
    resetShareError: shareOpportunityMutation.reset,
    resetRecordViewError: recordViewMutation.reset,
  };
}
