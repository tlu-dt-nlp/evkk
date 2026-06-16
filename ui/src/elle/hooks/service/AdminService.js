import { useFetch } from '../useFetch';
import { useCallback } from 'react';

export const useGetDatabaseHealth = () => {
  const { fetchData } = useFetch();

  const getDatabaseHealth = useCallback(() => {
    return fetchData('/api/actuator/health');
  }, [fetchData]);

  return { getDatabaseHealth };
};

export const useGetWordAnalyserMetrics = () => {
  const { fetchData } = useFetch();

  const getWordAnalyserMetrics = useCallback(() => {
    return fetchData('/api/actuator/metrics/tools.wordanalyser', {}, { ignoreNotFoundError: true });
  }, [fetchData]);

  return { getWordAnalyserMetrics };
};

export const useGetInternalServerErrorMetrics = () => {
  const { fetchData } = useFetch();

  const getInternalServerErrorMetrics = useCallback(() => {
    return fetchData('/api/actuator/metrics/http.errors.500.total');
  }, [fetchData]);

  return { getInternalServerErrorMetrics };
};
