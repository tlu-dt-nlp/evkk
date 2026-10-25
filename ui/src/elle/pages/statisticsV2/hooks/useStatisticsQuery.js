import { useEffect, useState } from 'react';
import { useGetStatistics } from '../../../hooks/service/ToolsService';
import { toRequestPayload } from '../helpers';

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
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [appliedFilters, getStatistics]);

  return { response, isLoading };
};
