import { useFetch } from '../useFetch';
import { useEffect } from 'react';

export const useGetTextsToReviewCount = () => {
  const { fetchData, response } = useFetch();

  useEffect(() => {
    fetchData('/api/admin/texts-to-review');
  }, [fetchData]);

  return response;
};

export const useGetDatabaseHealth = () => {
  const { fetchData, response } = useFetch();

  useEffect(() => {
    fetchData('/api/actuator/health');
  }, [fetchData]);

  return response;
};

export const useGetWordAnalyserMetrics = () => {
  const { fetchData, response } = useFetch();

  useEffect(() => {
    fetchData('/api/actuator/metrics/tools.wordanalyser', {}, { ignoreNotFoundError: true });
  }, [fetchData]);

  return response;
};

export const useGetInternalServerErrorMetrics = () => {
  const { fetchData, response } = useFetch();

  useEffect(() => {
    fetchData('/api/actuator/metrics/http.errors.500.total');
  }, [fetchData]);

  return response;
};
