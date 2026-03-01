import { Alert, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import '../styles/CorrectionNotAvailableAlert.css';

const ActionButton = ({ children }) => {
  return (
    <Button
      variant="text"
      href="/corrector"
      sx={{ fontWeight: 'bold' }}
    >
      {children}
    </Button>
  );
};

export default function CorrectionNotAvailableAlert() {
  const { t } = useTranslation();

  return (
    <div className="global-page-content-container">
      <div className="global-page-content-container-inner">
        <Alert
          icon={<InfoIcon fontSize="large" />}
          action={<ActionButton><br />{t('corrector_test_version_not_available_action')}</ActionButton>}
          severity="info"
          className="correction-not-available-alert">
          <b>{t('corrector_test_version_not_available_title')}</b>
          <br /><br />
          <div>{t('corrector_test_version_not_available_text')}</div>
        </Alert>
      </div>
    </div>
  );
}
