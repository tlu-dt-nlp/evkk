import { errorEmitter, loadingEmitter } from '../../App';
import { LoadingSpinnerEventType } from '../components/LoadingSpinner';
import { ErrorSnackbarEventType } from '../components/snackbar/ErrorSnackbar';
import { useCallback, useContext, useState } from 'react';
import RootContext from '../context/RootContext';

const ErrorCode400 = {
  'UnsupportedMimeType': ErrorSnackbarEventType.UNSUPPORTED_MIMETYPE
};

const statusHandlers = {
  401: ErrorSnackbarEventType.UNAUTHORIZED,
  403: ErrorSnackbarEventType.FORBIDDEN,
  429: ErrorSnackbarEventType.TOO_MANY_REQUESTS
};

const hasNonExpiredToken = (token) => {
  if (!token) return false;
  return Date.now() < JSON.parse(atob(token.split('.')[1])).exp * 1000;
};

const parseByType = async (res, type) => {
  switch (type) {
    case FetchParseType.JSON:
      return await res.json();
    case FetchParseType.TEXT:
      return await res.text();
    case FetchParseType.BLOB:
      return await res.blob();
    default:
      throw new Error(`Unexpected fetch type: ${type}`);
  }
};

const handleError = async (res, finalOptions) => {
  if (statusHandlers[res.status]) {
    errorEmitter.emit(statusHandlers[res.status]);
    return;
  }

  if (res.status === 400) {
    const body = await res.json();
    errorEmitter.emit(ErrorCode400[body[0].code]);
    return;
  }

  if (res.status === 404 && finalOptions.ignoreNotFoundError) {
    return;
  }

  errorEmitter.emit(ErrorSnackbarEventType.GENERIC_ERROR);
};

export const useFetch = () => {
  const { accessToken } = useContext(RootContext) || {};
  const [response, setResponse] = useState(null);

  const fetchData = useCallback(async (url, params = {}, options = {}) => {
    const defaultOptions = {
      disableErrorHandling: false,
      disableResponseParsing: false,
      disableContentTypeJson: false,
      parseType: FetchParseType.JSON,
      ignoreNotFoundError: false
    };
    const finalOptions = { ...defaultOptions, ...options };

    loadingEmitter.emit(LoadingSpinnerEventType.LOADER_START);

    try {
      const fetchParams = { ...params };

      if (!finalOptions.disableContentTypeJson) {
        fetchParams.headers = {
          ...fetchParams.headers,
          'Content-Type': 'application/json'
        };
      }

      if (hasNonExpiredToken(accessToken)) {
        fetchParams.headers = {
          ...fetchParams.headers,
          Authorization: `Bearer ${accessToken}`
        };
      }

      const res = await fetch(url, fetchParams);

      if (!finalOptions.disableErrorHandling && !res.ok) {
        await handleError(res, finalOptions);
      }

      const result = finalOptions.disableResponseParsing
        ? res
        : await parseByType(res, finalOptions.parseType);

      setResponse(result);
      return result;
    } finally {
      loadingEmitter.emit(LoadingSpinnerEventType.LOADER_END);
    }
  }, [accessToken]);

  return { fetchData, response };
};

export const FetchParseType = {
  BLOB: 'blob',
  JSON: 'json',
  TEXT: 'text'
};

