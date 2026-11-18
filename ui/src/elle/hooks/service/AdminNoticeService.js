import { useCallback } from 'react';
import { useFetch } from '../useFetch';

const NOTICES_URL = '/api/admin/notices';

export const useGetNotices = () => {
  const { fetchData } = useFetch();

  const getNotices = useCallback(() => {
    return fetchData(NOTICES_URL);
  }, [fetchData]);

  return { getNotices };
};

export const useCreateNotice = () => {
  const { fetchData } = useFetch();

  const createNotice = useCallback((notice) => {
    return fetchData(NOTICES_URL, {
      method: 'POST',
      body: JSON.stringify(notice)
    });
  }, [fetchData]);

  return { createNotice };
};

export const useUpdateNotice = () => {
  const { fetchData } = useFetch();

  const updateNotice = useCallback((id, notice) => {
    return fetchData(`${NOTICES_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(notice)
    });
  }, [fetchData]);

  return { updateNotice };
};

export const useDeleteNotice = () => {
  const { fetchData } = useFetch();

  const deleteNotice = useCallback((id) => {
    return fetchData(`${NOTICES_URL}/${id}`, {
      method: 'DELETE'
    }, { disableResponseParsing: true });
  }, [fetchData]);

  return { deleteNotice };
};

export const useReorderNotices = () => {
  const { fetchData } = useFetch();

  const reorderNotices = useCallback((orderedIds) => {
    return fetchData(`${NOTICES_URL}/order`, {
      method: 'PUT',
      body: JSON.stringify(orderedIds)
    });
  }, [fetchData]);

  return { reorderNotices };
};
