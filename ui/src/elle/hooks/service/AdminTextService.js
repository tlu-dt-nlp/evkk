import { useCallback } from 'react';
import { useFetch } from '../useFetch';

export const useGetTextsToReview = () => {
  const { fetchData } = useFetch();

  const getTextsToReview = useCallback(() => {
    return fetchData('/api/admin/texts/to-review');
  }, [fetchData]);

  return { getTextsToReview };
};

export const useGetDonatedTexts = () => {
  const { fetchData } = useFetch();

  const getDonatedTexts = useCallback((textsRequest) => {
    return fetchData(`/api/admin/texts/donated`, {
      method: 'POST',
      body: JSON.stringify(textsRequest)
    });
  }, [fetchData]);

  return { getDonatedTexts };
};

export const useGetDonatedTextDetails = () => {
  const { fetchData } = useFetch();

  const getDonatedTextDetails = useCallback((id) => {
    return fetchData(`/api/admin/texts/donated/${id}`);
  }, [fetchData]);

  return { getDonatedTextDetails };
};

export const useUpdateDonatedText = () => {
  const { fetchData } = useFetch();

  const updateDonatedText = useCallback((id, textUpdateRequest) => {
    return fetchData(`/api/admin/texts/donated/${id}`, {
      method: 'PUT',
      body: JSON.stringify(textUpdateRequest)
    });
  }, [fetchData]);

  return { updateDonatedText };
};

export const useDeleteDonatedText = () => {
  const { fetchData } = useFetch();

  const deleteDonatedText = useCallback((id) => {
    return fetchData(`/api/admin/texts/donated/${id}`, {
      method: 'DELETE'
    });
  }, [fetchData]);

  return { deleteDonatedText };
};

export const usePublishDonatedText = () => {
  const { fetchData } = useFetch();

  const publishDonatedText = useCallback((id, textUpdateRequest) => {
    return fetchData(`/api/admin/texts/donated/${id}/publish`, {
      method: 'POST',
      ...(textUpdateRequest != null && { body: JSON.stringify(textUpdateRequest) })
    });
  }, [fetchData]);

  return { publishDonatedText };
};

export const useGetPublishedTexts = () => {
  const { fetchData } = useFetch();

  const getPublishedTexts = useCallback((textsRequest) => {
    return fetchData(`/api/admin/texts/published`, {
      method: 'POST',
      body: JSON.stringify(textsRequest)
    });
  }, [fetchData]);

  return { getPublishedTexts };
};

export const useGetPublishedTextDetails = () => {
  const { fetchData } = useFetch();

  const getPublishedTextDetails = useCallback((id) => {
    return fetchData(`/api/admin/texts/published/${id}`);
  }, [fetchData]);

  return { getPublishedTextDetails };
};

export const useUpdatePublishedText = () => {
  const { fetchData } = useFetch();

  const updatePublishedText = useCallback((id, textUpdateRequest) => {
    return fetchData(`/api/admin/texts/published/${id}`, {
      method: 'PUT',
      body: JSON.stringify(textUpdateRequest)
    });
  }, [fetchData]);

  return { updatePublishedText };
};

export const useDeletePublishedText = () => {
  const { fetchData } = useFetch();

  const deletePublishedText = useCallback((id) => {
    return fetchData(`/api/admin/texts/published/${id}`, {
      method: 'DELETE'
    });
  }, [fetchData]);

  return { deletePublishedText };
};

export const useGetPropertyNames = () => {
  const { fetchData } = useFetch();

  const getPropertyNames = useCallback(() => {
    return fetchData('/api/admin/texts/property-names');
  }, [fetchData]);

  return { getPropertyNames };
};

export const useGetPropertyValues = () => {
  const { fetchData } = useFetch();

  const getPropertyValues = useCallback((propertyName) => {
    return fetchData(`/api/admin/texts/property-values/${encodeURIComponent(propertyName)}`);
  }, [fetchData]);

  return { getPropertyValues };
};

export const useCheckNovelValues = () => {
  const { fetchData } = useFetch();

  const checkNovelValues = useCallback((properties) => {
    return fetchData('/api/admin/texts/check-novel-values', {
      method: 'POST',
      body: JSON.stringify(properties)
    });
  }, [fetchData]);

  return { checkNovelValues };
};

export const useGetPropertyCheckConfig = () => {
  const { fetchData } = useFetch();

  const getPropertyCheckConfig = useCallback(() => {
    return fetchData('/api/admin/texts/property-check-config');
  }, [fetchData]);

  return { getPropertyCheckConfig };
};

export const useUpdatePropertyCheckConfig = () => {
  const { fetchData } = useFetch();

  const updatePropertyCheckConfig = useCallback((config) => {
    return fetchData('/api/admin/texts/property-check-config', {
      method: 'PUT',
      body: JSON.stringify(config)
    });
  }, [fetchData]);

  return { updatePropertyCheckConfig };
};
