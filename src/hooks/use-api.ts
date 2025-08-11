/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { ApiError } from "@/services/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  immediate?: boolean;
  deps?: any[];
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { immediate = true, deps = [] } = options;
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const apiError = error as ApiError;
      setState({ data: null, loading: false, error: apiError });
      console.log({ apiError });
      throw error;
    }
  }, deps);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return {
    ...state,
    execute,
    refetch,
  };
}

// Specialized hook for mutations (POST, PUT, DELETE)
export function useMutation<T, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await mutationFn(variables);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        setState((prev) => ({ ...prev, loading: false, error: apiError }));
        throw error;
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
