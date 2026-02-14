import '../styles/ServicesElement.css';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ServicesElement() {
  const {t} = useTranslation();

  const serviceContainer = (text) => {
    return (
      <Box className="service-detail global-page-content-container">
        <Box className="service-text">
          <strong>{text}</strong>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="service-container-outer" id="service-container">
      <h3 className="mb-4">{t('homepage_services_title')}</h3>
      <Box className="services-container">
        {serviceContainer(t('homepage_summary_text_1'))}
        {serviceContainer(t('homepage_summary_text_2'))}
        {serviceContainer(t('homepage_summary_text_3'))}
        {serviceContainer(t('homepage_summary_text_4'))}
      </Box>
    </Box>
  );
};
