import { Box, Button } from '@mui/material';
import '../styles/HeroElement.css';
import heroImage from '../../resources/images/home/girl_with_laptop.png';
import { useTranslation } from 'react-i18next';
import { DefaultButtonStyle } from '../../const/StyleConstants';
import { useNavigate } from 'react-router-dom';

export default function HeroElement() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box className="hero-container">
      <Box className="d-flex align-items-center justify-content-center hero-container-inner">
        <Box className="hero-text-container">
          <p className="hero-text">
            <span className="elle-dark-text">
              {t('hero_main_text_highlighted')}
            </span>
            {t('hero_main_text_not_highlighted')}
          </p>
          <Button
            className="tool-intro-button"
            sx={DefaultButtonStyle}
            size="large"
            variant="contained"
            onClick={() => navigate('#tools')}
          >
            {t('hero_tools_button')}
          </Button>
        </Box>
      </Box>
      <Box className="hero-image-box">
        <img
          className="hero-img"
          src={heroImage}
          alt="Hero"
        />
      </Box>
    </Box>
  );
};
