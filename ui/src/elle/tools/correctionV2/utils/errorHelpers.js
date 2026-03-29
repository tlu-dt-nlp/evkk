import { errorMap, modelKeyMap } from '../constants/maps';

const removeErrorById = (errorsObj, errorId) => {
  const updated = {};
  for (const errorType in errorsObj) {
    const arr = errorsObj[errorType];
    updated[errorType] = Array.isArray(arr)
      ? arr.filter(item => item.error_id !== errorId)
      : arr;
  }
  return updated;
};

const changeErrorArray = (
  modelErrorResponse,
  isAcceptSelected,
  errorId
) =>
  modelErrorResponse.map(entry => {
    if (entry.error_id === errorId) {
      return {
        ...entry,
        corrected: false,
        text: isAcceptSelected
          ? entry.corrected_text
          : entry.text
      };
    }
    return entry;
  });

export const changeHandler = (
  modelErrorResponse,
  modelKey,
  errorId,
  isAcceptSelected = false
) => ({
  ...modelErrorResponse,
  [modelKeyMap[modelKey]]: changeErrorArray(
    modelErrorResponse[modelKeyMap[modelKey]],
    isAcceptSelected,
    errorId
  ),
  [errorMap[modelKey]]: removeErrorById(
    modelErrorResponse[errorMap[modelKey]],
    errorId
  )
});
