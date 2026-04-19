import { useContext, useState } from 'react';
import { Box, Link as MuiLink } from '@mui/material';
import './styles/FooterElement.css';
import dtiEt from '../resources/images/footer/dti_et.svg';
import dtiEn from '../resources/images/footer/dti_en.svg';
import { useTranslation } from 'react-i18next';
import { FooterLink } from '../const/StyleConstants';
import i18n from 'i18next';
import { Languages } from '../translations/i18n';
import RootContext from '../context/RootContext';
import NewTabHyperlink from './NewTabHyperlink';
import { EVKK_GITHUB_RELEASE_BASE_PATH } from '../const/PathConstants';
import {
  FooterAboutValues,
  FooterLinksValues,
  FooterReferencesValues,
  FooterToolsValues
} from '../const/RouteConstants';
import { useAnalytics } from '../../analytics.jsx';

export default function FooterElement() {
  const { t } = useTranslation();
  const { version } = useContext(RootContext);
  const { openConsentBanner } = useAnalytics();
  const [dtiLogo, setDtiLogo] = useState(i18n.language === Languages.ESTONIAN ? dtiEt : dtiEn);

  i18n.on('languageChanged', () => {
    setDtiLogo(i18n.language === Languages.ESTONIAN ? dtiEt : dtiEn);
  });

  const renderBlock = (values) => {
    return values.map(link => (
      <FooterLink
        target={link.newTab ? '_blank' : ''}
        key={link.target}
        to={(link.prefix ?? '') + (link.connector ?? '') + link.target}
        state={link.state}
      >
        {t(link.title)}
      </FooterLink>
    ));
  };

  return (
    <Box className="footer-container">
      <Box className="footer-inner">
        <Box className="footer-logo-box">
          <img className="dti-logo" src={dtiLogo} alt="DTI logo" />
          <p><b>{t('footer_contact')}:</b> elle@tlu.ee</p>
          <MuiLink
            component="button"
            variant="body2"
            onClick={openConsentBanner}
            className="footer-consent-link"
          >
            {t('cookie_consent_settings')}
          </MuiLink>
          {version ?
            <NewTabHyperlink
              className="footer-version"
              path={`${EVKK_GITHUB_RELEASE_BASE_PATH}v${version}`}
              content={`ELLE v${version}`}
            /> :
            <span className="footer-version no-link">
              ELLE, {new Date().getFullYear()}
            </span>
          }
        </Box>
        <Box className="footer-inner-right">
          <Box className="footer-middle-box">
            <p className="font-weight-bold">{t('footer_references')}</p>
            {renderBlock(FooterReferencesValues)}
          </Box>
          <Box className="footer-middle-box">
            <p className="font-weight-bold">{t('footer_tools')}</p>
            {renderBlock(FooterToolsValues)}
          </Box>
          <Box className="footer-middle-box">
            <p className="font-weight-bold">{t('common_links')}</p>
            {renderBlock(FooterLinksValues)}
          </Box>
          <Box className="footer-box-right">
            <p className="font-weight-bold">{t('common_about')}</p>
            {renderBlock(FooterAboutValues)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
