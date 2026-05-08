import { useTranslation } from 'react-i18next';
import { Box, Button, Link, Paper, Slide, Stack, Typography } from '@mui/material';
import i18n from 'i18next';
import { Languages } from '../translations/i18n';
import './styles/AnalyticsBanner.css';

const CONSENT_KEY = 'analytics_consent';

export function getAnalyticsConsent() {
  return localStorage.getItem(CONSENT_KEY);
}

export function resetAnalyticsConsent() {
  localStorage.removeItem(CONSENT_KEY);
}

export function AnalyticsBanner({ onConsent, open }) {
  const { t } = useTranslation();
  const privacyLink = 'https://policies.google.com/technologies/partner-sites'
    + (i18n.language === Languages.ESTONIAN ? '?hl=et' : '');

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    onConsent('granted');
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    onConsent('denied');
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
            <Link
              href={privacyLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('cookie_consent_learn_more')}
            </Link>
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
