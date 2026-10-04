import { useEffect, useState } from 'react';
import { useGetStatistics } from '../../../hooks/service/ToolsService';
import { toRequestPayload } from '../helpers';

// Fetches statistics whenever the applied filters change. Keeps the previous
// response visible while a new one loads and ignores responses from superseded requests.
export const useStatisticsQuery = (appliedFilters) => {
  const { getStatistics } = useGetStatistics();
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    getStatistics(toRequestPayload(appliedFilters))
      .then(data => {
        if (!cancelled && data) setResponse(data);
      })
      // useFetch already reports the failure to the user; this only has to make sure
      // the page leaves its loading state instead of hanging on it forever.
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [appliedFilters, getStatistics]);

  return { response, isLoading };
};
