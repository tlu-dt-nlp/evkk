import { Box } from '@mui/material';
import { Person } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import '../styles/ContactCard.css';
import etisLogo from '../../resources/images/misc/etis_logo.svg';
import NewTabHyperlink from '../NewTabHyperlink';

export default function ContactCard({ name, degree, degreeInProgress, role, email, etisUrl, icon, silhouette }) {
  const { t } = useTranslation();

  const renderImage = () => {
    if (icon) {
      return <img className="contact-image"
                  src={icon}
                  alt={name} />;
    }
    if (silhouette) {
      return <Box className="contact-image contact-image-silhouette"
                  style={{ maskImage: `url(${silhouette})`, WebkitMaskImage: `url(${silhouette})` }} />;
    }
    return <Box className="contact-image contact-image-placeholder">
      <Person />
    </Box>;
  };

  return (
    <Box className="contact-box">
      <Box className="icon-box">
        {renderImage()}
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
