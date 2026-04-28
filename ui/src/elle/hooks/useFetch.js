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
    case FetchParseType.JSON: {
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    }
    case FetchParseType.TEXT:
      return await res.text();
    case FetchParseType.BLOB:
      return await res.blob();
    default:
      throw new Error(`Unexpected fetch type: ${type}`);
  }
};

const handleError = async (res, options) => {
  const statusHandler = statusHandlers[res.status];

  if (statusHandler) {
    errorEmitter.emit(statusHandler);
    return;
  }

  if (res.status === 400) {
    const body = await parseByType(res, FetchParseType.JSON);
    const code = body?.[0]?.code;

    const errorCode400Handler = ErrorCode400[code];
    if (errorCode400Handler) {
      errorEmitter.emit(errorCode400Handler);
    } else {
      errorEmitter.emit(ErrorSnackbarEventType.GENERIC_ERROR);
    }
    return;
  }

  if (res.status === 404 && options.ignoreNotFoundError) {
    return;
  }

  errorEmitter.emit(ErrorSnackbarEventType.GENERIC_ERROR);
};

export const useFetch = () => {
  const { accessToken } = useContext(RootContext) || {};
  const [response, setResponse] = useState(null);

  const fetchData = useCallback(async (url, params = {}, userOptions = {}) => {
    const defaultOptions = {
      disableErrorHandling: false,
      disableResponseParsing: false,
      disableContentTypeJson: false,
      parseType: FetchParseType.JSON,
      ignoreNotFoundError: false,
      forceAuthHeader: false
    };
    const options = { ...defaultOptions, ...userOptions };

    loadingEmitter.emit(LoadingSpinnerEventType.LOADER_START);

    try {
      const fetchParams = { ...params };

      if (!options.disableContentTypeJson) {
        fetchParams.headers = {
          ...fetchParams.headers,
          'Content-Type': 'application/json'
        };
      }

      if (options.forceAuthHeader || hasNonExpiredToken(accessToken)) {
        fetchParams.headers = {
          ...fetchParams.headers,
          Authorization: `Bearer ${accessToken}`
        };
      }

      let res;
      try {
        res = await fetch(url, fetchParams);
      } catch (e) {
        if (navigator.onLine) {
          errorEmitter.emit(ErrorSnackbarEventType.GENERIC_ERROR);
        } else {
          errorEmitter.emit(ErrorSnackbarEventType.NO_INTERNET_CONNECTION);
        }
        return;
      }

      if (!res.ok) {
        if (options.disableErrorHandling) {
          throw new Error(`HTTP request failed: ${res}`);
        }
        await handleError(res, options);
      }

      const result = options.disableResponseParsing
        ? res
        : res.ok
          ? await parseByType(res, options.parseType)
          : null;

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
