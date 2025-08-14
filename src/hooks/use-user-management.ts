import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/services/adminService';
import { AdminUser } from '@/types/admin';

interface UserFilters {
  search?: string;
  status?: string;
  country?: string;
  page?: number;
  limit?: number;
}

interface UseUserManagementReturn {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  setFilters: (filters: Partial<UserFilters>) => void;
  updateUserStatus: (userId: string, status: 'active' | 'inactive' | 'suspended') => Promise<void>;
  getUserActivity: (userId: string) => Promise<Array<{
    id: string;
    type: string;
    action: string;
    details: string;
    timestamp: string;
    date: string;
  }>>;
  refetch: () => void;
}

export function useUserManagement(): UseUserManagementReturn {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    country: 'all'
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiFilters = {
        ...filters,
        status: filters.status === 'all' ? undefined : filters.status,
        country: filters.country === 'all' ? undefined : filters.country,
        search: filters.search || undefined
      };

      const response = await adminService.getUsers(apiFilters);
      
      setUsers(response.users);
      setTotal(response.total);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Reset to page 1 when changing filters (except when explicitly setting page)
    }));
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      await adminService.updateUserStatus(userId, status as 'active' | 'inactive');
      
      // Update the user in the local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      throw err;
    }
  }, []);

  const getUserActivity = useCallback(async (userId: string) => {
    try {
      const activity = await adminService.getUserActivity(userId);
      return activity;
    } catch (err) {
      console.error('Error fetching user activity:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    total,
    page,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    updateUserStatus,
    getUserActivity,
    refetch: fetchUsers
  };
}