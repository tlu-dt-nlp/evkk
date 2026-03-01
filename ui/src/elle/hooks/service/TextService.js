import { queryStore } from '../../store/QueryStore';
import { sanitizeTexts } from '../../util/TextUtils';
import { FetchParseType, useFetch } from '../useFetch';
import { useCallback } from 'react';
import { errorEmitter, successEmitter } from '../../../App';
import { SuccessSnackbarEventType } from '../../components/snackbar/SuccessSnackbar';
import { ErrorSnackbarEventType } from '../../components/snackbar/ErrorSnackbar';

export const useGetSelectedTexts = setStoreData => {
  const { fetchData } = useFetch();

  const getSelectedTexts = useCallback(() => {
    const queryStoreState = queryStore.getState();
    if (queryStoreState.corpusTextIds) {
      fetchData('/api/texts/kysitekstid', {
        method: 'POST',
        body: JSON.stringify({ ids: queryStoreState.corpusTextIds })
      }, {
        parseType: FetchParseType.TEXT
      }).then(response => {
        if (!response) return;
        const queryStoreState = queryStore.getState();
        let result = response;
        if (queryStoreState.ownTexts) {
          result = result.concat(' ', queryStoreState.ownTexts);
        }
        setStoreData(sanitizeTexts(result));
      });
    } else if (queryStoreState.ownTexts) {
      setStoreData(queryStoreState.ownTexts);
    }
  }, [fetchData, setStoreData]);

  return { getSelectedTexts };
};

export const useGetTextFromFile = () => {
  const { fetchData } = useFetch();

  const getTextFromFile = useCallback(body => {
    return fetchData('/api/textfromfile', {
      method: 'POST',
      body
    }, {
      parseType: FetchParseType.TEXT,
      disableContentTypeJson: true
    });
  }, [fetchData]);

  return { getTextFromFile };
};

export const useAddText = () => {
  const { fetchData } = useFetch();

  const addText = useCallback((body, onComplete, onSuccess, onFailure) => {
    fetchData('/api/texts/lisatekst', {
      method: 'POST',
      body
    }, {
      parseType: FetchParseType.TEXT,
      disableErrorHandling: true
    }).then(
      () => {
        successEmitter.emit(SuccessSnackbarEventType.GENERIC_SUCCESS);
        if (onSuccess) onSuccess();
      },
      () => {
        errorEmitter.emit(ErrorSnackbarEventType.GENERIC_ERROR);
        if (onFailure) onFailure();
      }).finally(() => onComplete && onComplete());
  }, [fetchData]);

  return { addText };
};

export const useGetQueryResults = () => {
  const { fetchData } = useFetch();

  const getQueryResults = useCallback(body => {
    return fetchData('/api/texts/detailneparing', {
      method: 'POST',
      body
    });
  }, [fetchData]);

  return { getQueryResults };
};

export const useDownloadQueryResults = () => {
  const { fetchData } = useFetch();

  const downloadQueryResults = useCallback((form, fileType, fileList) => {
    return fetchData('/api/texts/tekstidfailina', {
      method: 'POST',
      body: JSON.stringify({
        form,
        fileType,
        fileList: Array.from(fileList)
      })
    }, {
      parseType: FetchParseType.BLOB
    });
  }, [fetchData]);

  return { downloadQueryResults };
};

export const useGetTextAndMetadata = () => {
  const { fetchData } = useFetch();

  const getTextAndMetadata = useCallback(textId => {
    return fetchData('/api/texts/kysitekstjametainfo?id=' + textId);
  }, [fetchData]);

  return { getTextAndMetadata };
};
