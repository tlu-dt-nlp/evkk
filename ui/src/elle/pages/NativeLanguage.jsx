import { useState } from 'react';
import { Button, FormControl, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../pages/styles/Login.css';
import { DefaultButtonStyle } from '../const/StyleConstants';
import { useNavigate } from 'react-router-dom';
import { RouteConstants } from '../const/RouteConstants';

export default function NativeLanguage() {
  const { t } = useTranslation();
  const [nativeLang, setNativeLang] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setNativeLang(event.target.value);
  };

  const handleSave = () => {
    navigate(`/${RouteConstants.ACCOUNT}/${RouteConstants.ACCOUNT_OVERVIEW}`);
  };

  return (
    <div className="native-language-page-container">
      <h2 className="login-title">{t('native_language_title')}</h2>
      <p className="login-subtitle">{t('native_language_subtitle')}</p>
      <div className="native-language-card">
        <FormControl fullWidth size="small">
          <div className="native-language-label">
            {t('query_author_data_native_language')}
          </div>
          <Select
            className="native-language-select"
            value={nativeLang}
            displayEmpty
            onChange={handleChange}
            renderValue={(value) => {
              if (!value) {
                return (
                  <span className="native-language-placeholder">
                    {t('native_language_placeholder')}
                  </span>
                );
              }
              if (value === 'et') return t('native_language_option_et');
              if (value === 'en') return t('native_language_option_en');
              if (value === 'ru') return t('native_language_option_ru');
              return value;
            }}
          >
            <MenuItem value="et">{t('native_language_option_et')}</MenuItem>
            <MenuItem value="en">{t('native_language_option_en')}</MenuItem>
            <MenuItem value="ru">{t('native_language_option_ru')}</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="native-language-button-container">
        <Button
          sx={DefaultButtonStyle}
          variant="contained"
          disabled={!nativeLang}
          onClick={handleSave}
        >
          {t('native_language_save_and_continue')}
        </Button>
      </div>
    </div>
  );
}


