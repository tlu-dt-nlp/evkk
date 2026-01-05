import { Alert, Button } from '@mui/material';
import './styles/ServerOfflinePage.css';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import FooterElement from './FooterElement';
import { DefaultButtonStyle } from '../const/StyleConstants';

export default function ServerOfflinePage({ retry }) {

  const { t } = useTranslation();

  return (
    <div className="server-error-container">
      <div>
        <Navbar />
        <span className="server-error-page">
          <Alert severity="error">
            {t('server_offline_page_error')}
          </Alert>
          <Button
            variant="contained"
            sx={DefaultButtonStyle}
            onClick={retry}
          >
            {t('try_again')}
          </Button>
        </span>
      </div>
      <FooterElement />
    </div>
  );
}
