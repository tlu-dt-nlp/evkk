import { FetchParseType, useFetch } from '../useFetch';
import { useCallback } from 'react';

export const useGetTextToSpeech = () => {
  const { fetchData } = useFetch();

  const getTextToSpeechData = useCallback(body => {
    return fetchData('/api/text-to-speech', {
      method: 'POST',
      body: JSON.stringify(body)
    }, {
      parseType: FetchParseType.TEXT
    });
  }, [fetchData]);

  return { getTextToSpeechData };
};
