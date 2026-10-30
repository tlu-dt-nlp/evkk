import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../styles/ContactCard.css';
import etisLogo from '../../resources/images/misc/etis_logo.svg';
import NewTabHyperlink from '../NewTabHyperlink';

export default function ContactCard({ name, degree, degreeInProgress, role, email, etisUrl, icon }) {
  const { t } = useTranslation();

  return (
    <Box className="contact-box">
      <Box className="icon-box">
        <img className="contact-image"
             src={icon}
             alt={name} />
      </Box>
      <Box className="contact-info">
        <div className="contact-name">
          {name}, <span className="contact-degree">
            {degreeInProgress ? t('people_degree_in_progress', { degree }) : degree}
          </span>
        </div>
        <div className="contact-role">{t(role)}</div>
        <div className="contact-links">
          <a href={`mailto:${email}`} className="contact-email">
            {email}
          </a>
          {etisUrl &&
            <NewTabHyperlink path={etisUrl}
                             content={<img src={etisLogo} alt="ETIS" />}
                             className="etis-link" />
          }
        </div>
      </Box>
    </Box>
  );
}
