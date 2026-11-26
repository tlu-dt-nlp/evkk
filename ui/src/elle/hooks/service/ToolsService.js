import { useFetch } from '../useFetch';
import { useCallback } from 'react';

export const useGetWordlistResult = () => {
  const { fetchData } = useFetch();

  const getWordlistResult = useCallback(body => {
    return fetchData('/api/tools/wordlist', {
      method: 'POST',
      body
    });
  }, [fetchData]);

  return { getWordlistResult };
};

export const useGetCollocatesResult = () => {
  const { fetchData } = useFetch();

  const getCollocatesResult = useCallback(body => {
    return fetchData('/api/tools/collocates', {
      method: 'POST',
      body
    });
  }, [fetchData]);

  return { getCollocatesResult };
};

export const useGetWordContextResult = () => {
  const { fetchData } = useFetch();

  const getWordContextResult = useCallback(body => {
    return fetchData('/api/tools/wordcontext', {
      method: 'POST',
      body
    });
  }, [fetchData]);

  return { getWordContextResult };
};

export const useGetWordAnalyserResult = () => {
  const { fetchData } = useFetch();

  const getWordAnalyserResult = useCallback(body => {
    return fetchData('/api/tools/wordanalyser', {
      method: 'POST',
      body
    });
  }, [fetchData]);

  return { getWordAnalyserResult };
};

export const useGetCorrectorResult = () => {
  const { fetchData } = useFetch();

  const getCorrectorResult = useCallback(body => {
    return fetchData('/api/texts/keerukus-sonaliigid-mitmekesisus', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }, [fetchData]);

  return { getCorrectorResult };
};

export const useGetLanguageDetection = () => {
  const { fetchData } = useFetch();
  // on a server error return null without an error snackbar, so the analysis can still run
  const getLanguageDetection = useCallback(async body => {
    const url = '/api/texts/keeletuvastus';
    const request = { method: 'POST', body: JSON.stringify(body) };
    const options = { disableErrorHandling: true };

    try {
      return await fetchData(url, request, options);
    } catch {
      return null;
    }
  }, [fetchData]);

  return { getLanguageDetection };
};
