import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { successEmitter } from '../../../App';
import '../styles/SuccessSnackbar.css';

export default function SuccessSnackbar() {

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('success_generic');
  const { t } = useTranslation();

  const handleEvent = typeValue => {
    setSnackbarOpen(true);
    setSuccessMessage(typeValue);
  };

  useEffect(() => {
    Object.values(SuccessSnackbarEventType).forEach(eventTypeValue => {
      successEmitter.on(eventTypeValue, () => handleEvent(eventTypeValue));
    });

    return () => {
      Object.values(SuccessSnackbarEventType).forEach(eventTypeValue => {
        successEmitter.off(eventTypeValue, () => handleEvent(eventTypeValue));
      });
    };
  }, []);

  const handleSnackbarClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Snackbar open={snackbarOpen}
              autoHideDuration={5000}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              onClose={handleSnackbarClose}>
      <Alert onClose={handleSnackbarClose}
             className="success-alert"
             severity="success">
        {t(successMessage)}
      </Alert>
    </Snackbar>
  );
}

export const SuccessSnackbarEventType = {
  GENERIC_SUCCESS: 'success_generic',
  LOGOUT_SUCCESS: 'success_logout',
  LOGOUT_FORCED_SUCCESS: 'success_logout_forced',
  SESSION_RENEW_SUCCESS: 'success_session_renew'
};
