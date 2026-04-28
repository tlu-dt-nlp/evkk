import { useTranslation } from 'react-i18next';
import './styles/Login.css';
import i18n from 'i18next';
import CookieAcknowledgementSnackbar from '../components/snackbar/CookieAcknowledgementSnackbar';
import haridLogo from '../resources/images/misc/harid_logo.png';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    const urlBase = `api/auth/login/harid?language=${i18n.language}`;

    if (import.meta.env.MODE === 'production') {
      window.location.href = urlBase;
    } else {
      navigate('/native-language');
    }
  };

  return (
    <div className="login-page-container">
      <h2 className="login-title">{t('login_title')}</h2>
      <p className="login-subtitle">{t('login_subtitle')}</p>
      <img
        src={haridLogo}
        alt="HarID logo"
        onClick={handleClick}
        className="harid-image"
      />
      <CookieAcknowledgementSnackbar />
    </div>
  );
}
