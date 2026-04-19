import { useFetch } from '../useFetch';
import { useCallback, useEffect } from 'react';

export const useGetStatus = (setStatus, setIsLoading, setDataSuccess) => {
  const { fetchData, response } = useFetch();

  const getStatus = useCallback(async () => {
    await fetchData('/api/status', {}, { disableErrorHandling: true })
      .catch(() => {
        setStatus(false);
        setIsLoading(false);
      });
  }, [fetchData, setStatus, setIsLoading]);

  useEffect(() => {
    if (response) {
      setDataSuccess(response);
    }
    setIsLoading(false);
  }, [response, setIsLoading, setDataSuccess]);

  return { getStatus };
};
