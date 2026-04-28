import { errorEmitter, successEmitter } from '../../../App';
import { SuccessSnackbarEventType } from '../../components/snackbar/SuccessSnackbar';
import { useFetch } from '../useFetch';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RootContext from '../../context/RootContext';
import { ErrorSnackbarEventType } from '../../components/snackbar/ErrorSnackbar';

const AUTH_PATH = '/api/auth';

export const useLogout = () => {
  const { fetchData } = useFetch();
  const navigate = useNavigate();
  const { clearAuthContext } = useContext(RootContext);

  const logout = useCallback((forced = false) => {
    fetchData(`${AUTH_PATH}/logout`, {
      method: 'DELETE'
    }, {
      disableResponseParsing: true,
      disableErrorHandling: true
    }).then(
      () => {
        clearAuthContext();
        navigate('/');
        successEmitter.emit(forced ? SuccessSnackbarEventType.LOGOUT_FORCED_SUCCESS : SuccessSnackbarEventType.LOGOUT_SUCCESS);
      },
      () => errorEmitter.emit(ErrorSnackbarEventType.GENERIC_ERROR));
  }, [clearAuthContext, fetchData, navigate]);

  return { logout };
};

export const useRenew = () => {
  const { fetchData } = useFetch();
  const { setContext } = useContext(RootContext);

  const renew = useCallback(() => {
    return fetchData(`${AUTH_PATH}/renew`, {
      method: 'POST'
    }, {
      disableResponseParsing: true,
      forceAuthHeader: true
    }).then(() => setContext(true));
  }, [fetchData, setContext]);

  return { renew };
};
