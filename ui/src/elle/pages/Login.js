import { useTranslation } from 'react-i18next';
import React from 'react';
import './styles/Login.css';
import i18n from 'i18next';
import CookieAcknowledgementSnackbar from '../components/snackbar/CookieAcknowledgementSnackbar';
import haridLogo from '../resources/images/misc/harid_logo.png';

export default function Login() {

  const { t } = useTranslation();

  const handleClick = () => {
    const urlBase = `api/auth/login/harid?language=${i18n.language}`;
    window.location.href = process.env.NODE_ENV === 'production' ? urlBase : `http://localhost:9090/${urlBase}`;
  };

  return (
    <div>
      <h2 className="tool-title">{t('common_login_for_admins')}</h2>
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
