import { useTranslation } from 'react-i18next';
import './styles/Login.css';
import haridLogo from '../resources/images/misc/harid_logo.png';
import { useAnalytics } from '../context/AnalyticsContext';

export default function Login() {

  const { t, i18n } = useTranslation();
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent('Auth', 'click', 'harid-login');
    const urlBase = `api/auth/login/harid?language=${i18n.language}`;
    globalThis.location.href = import.meta.env.MODE === 'production' ? urlBase : `http://localhost:9090/${urlBase}`;
  };

  return (
    <div>
      <h2 className="page-title">{t('common_login_for_admins')}</h2>
      <img
        src={haridLogo}
        alt="HarID logo"
        onClick={handleClick}
        className="harid-image"
      />
    </div>
  );
}
