import { errorMap, modelKeyMap } from '../const/maps';

const removeErrorById = (errorsObj, errorId) => {
  const updated = {};
  for (const errorType in errorsObj) {
    const arr = errorsObj[errorType];
    if (Array.isArray(arr)) {
      updated[errorType] = arr.filter(item => item.error_id !== errorId);
    } else {
      updated[errorType] = arr;
    }
  }
  return updated;
};

const changeErrorArray = (modelErrorResponse, isAcceptSelected, errorId) => {
  return modelErrorResponse.map(entry => {
    if (entry.error_id === errorId) {
      return {
        ...entry,
        corrected: false,
        text: isAcceptSelected ? entry.corrected_text : entry.text
      };
    }
    return entry;
  });
};


export const changeHandler = (isAcceptSelected = false, modelErrorResponse, modelKey, errorId) => {

  return {
    ...modelErrorResponse,
    [modelKeyMap[modelKey]]: changeErrorArray(modelErrorResponse[modelKeyMap[modelKey]], isAcceptSelected, errorId),
    [errorMap[modelKey]]: removeErrorById(modelErrorResponse[errorMap[modelKey]], errorId)
  };
};
