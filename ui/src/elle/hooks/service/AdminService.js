import { useEffect } from 'react';

import { useFetch } from '../useFetch';

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

export const useGetTextsToReviewCount = () => {
  const { fetchData, response } = useFetch();

  useEffect(() => {
    fetchData('/api/admin/texts-to-review');
  }, [fetchData]);

  return response;
};

export const useGetDonatedTextDetails = (id) => {
  const { fetchData, response } = useFetch();

  useEffect(() => {
    if (id) {
      fetchData(`/api/admin/donated-texts/${id}`);
    }
  }, [fetchData, id]);

  return response;
};

export const useGetPublishedTextDetails = (id) => {
  const { fetchData, response } = useFetch();

  useEffect(() => {
    if (id) {
      fetchData(`/api/admin/published-texts/${id}`);
    }
  }, [fetchData, id]);

  return response;
};
