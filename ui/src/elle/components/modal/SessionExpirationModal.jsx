import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLogout, useRenew } from '../../hooks/service/AuthService';
import ModalBase from './ModalBase';
import { useTranslation } from 'react-i18next';
import { DefaultButtonStyle, SecondaryButtonStyle } from '../../const/StyleConstants';
import { Button } from '@mui/material';
import '../styles/SessionExpirationModal.css';
import RootContext from '../../context/RootContext';

export default function SessionExpirationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(5);
  const timeoutId = useRef();
  const intervalId = useRef();
  const { t } = useTranslation();
  const { accessToken } = useContext(RootContext);
  const { logout } = useLogout();
  const { renew } = useRenew();

  const initTimeoutOrLogout = useCallback(() => {
    clearTimeout(timeoutId.current);
    setIsOpen(false);

    if (!accessToken) {
      return;
    }

    const jwtPayload = JSON.parse(atob(accessToken.split('.')[1]));
    const expirationTime = jwtPayload.exp * 1000;
    const dateNow = Date.now();
    const timeoutDuration = expirationTime - dateNow - 5 * 60 * 1000; // 5 minutes before expiration

    if (timeoutDuration > 0) {
      timeoutId.current = setTimeout(() => {
        setIsOpen(true);
        updateMinutesLeft(expirationTime);
      }, timeoutDuration);
    } else if (dateNow < expirationTime) {
      setIsOpen(true);
      updateMinutesLeft(expirationTime);
    }
  }, [accessToken]);

  useEffect(() => {
    clearInterval(intervalId.current);
    intervalId.current = setInterval(() => {
      if (!accessToken) return;

      const jwtPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = jwtPayload.exp * 1000;

      updateMinutesLeft(expirationTime);
      if (Date.now() > expirationTime) {
        setIsOpen(false);
        logout(true);
        clearInterval(intervalId.current);
      }
    }, 3000);

    initTimeoutOrLogout();

    return () => clearInterval(intervalId.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const updateMinutesLeft = (expirationTime) => {
    const minutes = Math.max(0, Math.ceil((expirationTime - Date.now()) / 60000));
    setMinutesLeft(minutes);
  };

  const handleClose = () => {
    setIsOpen(false);
    clearTimeout(timeoutId.current);
  };

  return (
    <ModalBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      disableComfortClosing={true}
      disableCloseButton={true}
      innerClassName="session-expiration-modal"
      title="session_expiration_modal_title"
    >
      {t('session_expiration_modal_content_1', {
        minutesLeft,
        unit: minutesLeft === 1 ? t('session_expiration_modal_unit_singular') : t('session_expiration_modal_unit_plural')
      })}
      <br />
      {t('session_expiration_modal_content_2')}
      <br /><br />
      <Button
        style={DefaultButtonStyle}
        size="small"
        variant="contained"
        onClick={renew}
      >
        {t('session_expiration_modal_renew_yes')}
      </Button>
      <Button
        style={SecondaryButtonStyle}
        size="small"
        variant="outlined"
        onClick={handleClose}
      >
        {t('session_expiration_modal_renew_no')}
      </Button>
    </ModalBase>
  );
};
