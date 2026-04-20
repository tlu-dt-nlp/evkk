import { useCallback } from 'react';

import { useFetch } from '../useFetch';

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

export const useGetTextsToReview = () => {
  const { fetchData } = useFetch();

  const getTextsToReview = useCallback(() => {
    return fetchData('/api/admin/texts-to-review');
  }, [fetchData]);

  return { getTextsToReview };
};

export const useGetDonatedTextDetails = () => {
  const { fetchData } = useFetch();

  const getDonatedTextDetails = useCallback((id) => {
    return fetchData(`/api/admin/donated-texts/${id}`);
  }, [fetchData]);

  return { getDonatedTextDetails };
};

export const useUpdateDonatedText = () => {
  const { fetchData } = useFetch();

  const updateDonatedText = useCallback((id, textUpdateRequest) => {
    return fetchData(`/api/admin/donated-texts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(textUpdateRequest)
    });
  }, [fetchData]);

  return { updateDonatedText };
};

export const useDeleteDonatedText = () => {
  const { fetchData } = useFetch();

  const deleteDonatedText = useCallback((id) => {
    return fetchData(`/api/admin/donated-texts/${id}`, {
      method: 'DELETE'
    });
  }, [fetchData]);

  return { deleteDonatedText };
};

export const useGetPublishedTextDetails = () => {
  const { fetchData } = useFetch();

  const getPublishedTextDetails = useCallback((id) => {
    return fetchData(`/api/admin/published-texts/${id}`);
  }, [fetchData]);

  return { getPublishedTextDetails };
};

export const useUpdatePublishedText = () => {
  const { fetchData } = useFetch();

  const updatePublishedText = useCallback((id, textUpdateRequest) => {
    return fetchData(`/api/admin/published-texts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(textUpdateRequest)
    });
  }, [fetchData]);

  return { updatePublishedText };
};

export const useDeletePublishedText = () => {
  const { fetchData } = useFetch();

  const deletePublishedText = useCallback((id) => {
    return fetchData(`/api/admin/published-texts/${id}`, {
      method: 'DELETE'
    });
  }, [fetchData]);

  return { deletePublishedText };
};
