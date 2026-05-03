import { useFetch } from '../useFetch';
import { useCallback } from 'react';

export const useGetExerciseGeneratorResult = () => {
  const { fetchData } = useFetch();

  const getExerciseGeneratorResult = useCallback(queryParams => {
    const queryString = new URLSearchParams(queryParams).toString();
    return fetchData(`/api/exercise-generator/generate?${queryString}`, {
      method: 'GET'
    });
  }, [fetchData]);

  return { getExerciseGeneratorResult };
};

export const useSubmitExerciseAnswers = () => {
  const { fetchData } = useFetch();

  const submitExerciseAnswers = useCallback((exerciseId, body) => {
    return fetchData(`/api/exercise-generator/submit/${exerciseId}`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }, [fetchData]);

  return { submitExerciseAnswers };
};
