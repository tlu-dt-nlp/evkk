import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Snackbar } from '@mui/material';
import { DefaultButtonStyle } from '../../const/StyleConstants';
import '../styles/CookieAcknowledgementSnackbar.css';

export default function CookieAcknowledgementSnackbar() {
  const [snackbarOpen, setSnackbarOpen] = useState(!localStorage.getItem('cookiesAcknowledged'));
  const { t } = useTranslation();

  const handleClose = () => {
    localStorage.setItem('cookiesAcknowledged', true);
    setSnackbarOpen(false);
  };

  return (
    <Snackbar
      open={snackbarOpen}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      className="cookie-snackbar"
      autoHideDuration={null}
    >
      <Alert severity="info">
        <div className="cookie-alert">
          <span className="cookie-alert-text">
            {t('cookie_acknowledgement_snackbar_content_1')}<br />
            {t('cookie_acknowledgement_snackbar_content_2')}
          </span>
          <Button
            style={DefaultButtonStyle}
            variant="contained"
            size="small"
            onClick={handleClose}
          >
            {t('cookie_acknowledgement_snackbar_button')}
          </Button>
        </div>
      </Alert>
    </Snackbar>
  );
}
