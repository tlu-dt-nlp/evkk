import elleLogo from '../resources/images/header/elle_logo.png';
import { AppBar, Box, Drawer, IconButton, Link, List, ListItem, Menu, MenuItem, styled, Toolbar } from '@mui/material';
import { Close, Language, Logout, Menu as MenuIcon } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import '@fontsource/exo-2/600.css';
import { useEffect, useState } from 'react';
import './styles/Navbar.css';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { Languages } from '../translations/i18n';
import Can from './security/Can';
import { useLogout } from '../hooks/service/AuthService';
import TextToSpeechMenu from './text-to-speech/TextToSpeechMenu';
import flagEst from '../resources/images/flags/est.png';
import flagEng from '../resources/images/flags/eng.png';
import { NavbarPages } from '../const/RouteConstants';

const MenuLink = styled(Link)({
  fontWeight: 600,
  color: '#1B1B1B',
  textDecoration: 'none',
  fontFamily: ['Exo 2', 'sans-serif'].join(','),
  '&:hover': {
    color: '#9C27B0',
    textDecoration: 'none'
  },
  '&.active': {
    color: '#9C27B0',
    textDecoration: 'none'
  }
});

const BurgerLink = styled(Link)({
  fontWeight: 400,
  color: '#1B1B1B',
  textDecoration: 'none',
  fontFamily: ['Exo 2', 'sans-serif'].join(','),
  '&:hover': {
    color: '#1B1B1B',
    textDecoration: 'underline'
  },
  '&.active': {
    color: '#1B1B1B',
    textDecoration: 'none'
  }
});

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [navColor, setNavColor] = useState('sticking');
  const [langAnchorEl, setLangAnchorEl] = useState(false);
  const langOpen = Boolean(langAnchorEl);
  const { logout } = useLogout();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLangOpen = event => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(false);
  };

  const handleLangSelect = (lang) => {
    i18n.changeLanguage(lang).then(r => r);
    localStorage.setItem('language', lang);
    setLangAnchorEl(false);
    setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  const languageMenu = () => {
    return (
      <div>
        <Language className="language-icon" onClick={handleLangOpen} />
        <Menu
          anchorEl={langAnchorEl}
          open={langOpen}
          onClose={handleLangClose}
        >
          <MenuItem onClick={() => handleLangSelect(Languages.ESTONIAN)}>
            <img
              src={flagEst}
              className="lang-icon"
              alt="Eesti"
            />Eesti
          </MenuItem>
          <MenuItem onClick={() => handleLangSelect(Languages.ENGLISH)}>
            <img
              src={flagEng}
              className="lang-icon"
              alt="English"
            />English
          </MenuItem>
        </Menu>
      </div>
    );
  };

  const logoutItem = (isDesktop) => {
    return (
      <Can requireAuth={true}>
        <div
          className={`nav-logout ${isDesktop ? 'desktop' : ''}`}
          onClick={handleLogout}
        >
          <Logout />
          <span className="logout-text">
            {t('navbar_logout')}
          </span>
        </div>
      </Can>
    );
  };

  const handleScroll = () => {
    const position = window.scrollY;
    if (position > 20) {
      setNavColor('not-sticking');
    } else if (position <= 20) {
      setNavColor('sticking');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AppBar
      elevation={0}
      className={navColor}
    >
      <Toolbar>
        <div className="navbar-container">
          <div className="nav-logo-container">
            <NavLink to="/">
              <Box
                component="img"
                className="elle-nav-logo"
                alt="Logo"
                src={elleLogo}
              />
            </NavLink>
          </div>
          <div className="nav-menu-link-container">
            {NavbarPages.map((page) => {
              return (
                <Can role={page.role} key={page.id}>
                  <span style={{ height: '100%' }}>
                    <Box className="nav-menu-item my-0 mx-4">
                      <MenuLink
                        to={page.target}
                        component={NavLink}
                      >
                        {t(page.title)}
                      </MenuLink>
                    </Box>
                  </span>
                </Can>
              );
            })}
          </div>
          <div className="nav-icons-container">
            {logoutItem(true)}
            <Box className="language-menu-desktop">
              {languageMenu()}
              <TextToSpeechMenu />
            </Box>
            <IconButton
              onClick={() => toggleDrawer()}
              className="navbar-icon-button mr-2"
            >
              <MenuIcon className="burger-menu-icon" />
            </IconButton>
          </div>
        </div>
      </Toolbar>
      <Drawer
        open={open}
        anchor="left"
        onClose={toggleDrawer}
        slotProps={{
          paper: {
            sx: {
              width: '100%'
            }
          }
        }}
      >
        <div className="nav-drawer-container">
          <div className="d-flex flex-column w-50">
            <div className="d-flex align-items-center w-100 nav-50px-height">
              <NavLink to="/">
                <Box
                  component="img"
                  className="elle-nav-logo"
                  alt="Logo"
                  src={elleLogo}
                  onClick={() => setOpen(false)}
                />
              </NavLink>
            </div>
            <List>
              {NavbarPages.map((page) => {
                return (
                  <Can role={page.role} key={page.id}>
                    <ListItem sx={{ pl: 0 }}>
                      <BurgerLink
                        to={page.target}
                        component={NavLink}
                        onClick={toggleDrawer}
                      >
                        {t(page.title)}
                      </BurgerLink>
                    </ListItem>
                  </Can>
                );
              })}
            </List>
          </div>
          <div className="d-flex justify-content-end align-items-center nav-50px-height">
            {logoutItem(false)}
            {languageMenu()}
            <TextToSpeechMenu />
            <IconButton onClick={() => toggleDrawer()}>
              <Close className="nav-close-icon" />
            </IconButton>
          </div>
        </div>
      </Drawer>
    </AppBar>
  );
}
