import { useTranslation } from 'react-i18next';
import { Box, Button, Paper, Slide, Stack, Typography } from '@mui/material';
import i18n from 'i18next';
import { Languages } from '../translations/i18n';
import './styles/AnalyticsBanner.css';
import { GOOGLE_PRIVACY_PATH } from '../const/PathConstants';
import { ANALYTICS_CONSENT_KEY } from '../const/Constants';
import NewTabHyperlink from './NewTabHyperlink';

export function AnalyticsBanner({ onConsent, open }) {
  const { t } = useTranslation();
  const privacyLink = GOOGLE_PRIVACY_PATH + (i18n.language === Languages.ESTONIAN ? '?hl=et' : '');

  const handleAccept = () => {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, true);
    onConsent(true);
  };

  const handleDecline = () => {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, false);
    onConsent(false);
  };

  if (!open) return null;

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={6}
        className="analytics-banner"
      >
        <Box className="analytics-banner-content">
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {t('cookie_consent_title')}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {t('cookie_consent_text')}{' '}
            <NewTabHyperlink path={privacyLink} content={t('cookie_consent_learn_more')} />
          </Typography>
          <Stack direction="row" spacing={2} className="analytics-banner-buttons">
            <Button variant="contained" color="primary" onClick={handleAccept}>
              {t('cookie_consent_accept')}
            </Button>
            <Button variant="outlined" onClick={handleDecline}>
              {t('cookie_consent_decline')}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Slide>
  );
}
