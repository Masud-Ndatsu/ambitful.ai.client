import { useState, useEffect, useCallback } from 'react';
import { opportunityService } from '@/services/opportunityService';
import { Opportunity } from '@/types/opportunity';

interface UseFeaturedOpportunitiesReturn {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFeaturedOpportunities(limit: number = 6): UseFeaturedOpportunitiesReturn {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await opportunityService.getFeaturedOpportunities(limit);
      setOpportunities(response);
    } catch (err) {
      console.error('Error fetching featured opportunities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch featured opportunities');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeaturedOpportunities();
  }, [fetchFeaturedOpportunities]);

  return {
    opportunities,
    loading,
    error,
    refetch: fetchFeaturedOpportunities
  };
}