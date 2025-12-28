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
    <Alert
      icon={<InfoIcon fontSize="large" />}
      action={<ActionButton>{t('corrector_test_version_na_action')}</ActionButton>}
      severity="info"
      className="correction-not-available-alert">
      <div>
        <b>{t('corrector_test_version_na_title')}</b>
      </div>
      <div>{t('corrector_test_version_na_text')}</div>
    </Alert>
  );
}
