import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExpandLess, ExpandMore, MenuOpen } from '@mui/icons-material';
import './styles/ResponsiveDrawer.css';
import throttle from 'lodash/throttle';

export default function ResponsiveDrawer({
                                           lists,
                                           children,
                                           onCustomActionClick,
                                           disableOutletRender
                                         }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMap, setOpenMap] = useState({});
  const [activeSection, setActiveSection] = useState('');
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);
  const manualScrollRef = useRef(false);

  const segments = location.pathname.split('/').filter(Boolean);
  const baseSegment = segments[0] || '';
  const basePath = `/${baseSegment}`;
  const drawerWidth = 270;

  const addAnchorNameToList = (item, ids) => {
    if (item.navigateTo?.includes('#')) {
      const parts = item.navigateTo.split('#');
      if (parts[1]) {
        ids.push(parts[1]);
      }
    }
  };

  const sectionIds = useMemo(() =>
    lists.flatMap(list =>
      list.items.flatMap(item => {
        const ids = [];
        addAnchorNameToList(item, ids);
        item.children?.forEach(child => {
          addAnchorNameToList(child, ids);
        });
        return ids;
      })
    ), [lists]
  );

  // swap the anchor in url when it comes into viewport
  useEffect(() => {
    if (!sectionIds.length) return;
    const onScroll = throttle(() => {
      let currentSection = '';
      sectionIds.forEach(id => {
        const element = document.getElementById(id);
        if (!element) return;

        const top = element.getBoundingClientRect().top;
        // header height +1px so two anchors would not be "selected" at the same time
        if (top <= 81) currentSection = id;
      });
      if (currentSection && currentSection !== window.location.hash.slice(1)) {
        const newHash = `#${currentSection}`;
        const newPath = `${location.pathname}${newHash}`;
        window.history.replaceState(null, '', newPath);
        setCurrentHash(newHash);
      }
      setActiveSection(currentSection);
    }, 10);

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      onScroll.cancel();
    };
  }, [sectionIds, location.pathname]);

  useEffect(() => {
    if (currentHash) {
      const id = currentHash.slice(1);
      const element = document.getElementById(id);
      if (element && manualScrollRef.current) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      manualScrollRef.current = false; // smooth scroll on hash change only for manual clicks
    }
  }, [currentHash]);

  const getNormalizedPath = (rawPath) => {
    const path = rawPath === baseSegment ? basePath : `${basePath}/${rawPath}`;
    return path.endsWith('/') ? path.slice(0, -1) : path;
  };

  const handleNavigate = (item) => {
    const navigateTo = item?.navigateTo;
    if (!navigateTo) {
      if (item?.customAction) {
        onCustomActionClick(item);
      }
      setMobileOpen(false);
      return;
    }

    const [rawPath, rawHash = ''] = navigateTo.split('#');
    const normalizedPath = getNormalizedPath(rawPath);
    const fullPath = rawHash ? `${normalizedPath}#${rawHash}` : normalizedPath;

    manualScrollRef.current = true; // allow smooth scroll with manual click
    navigate(fullPath);
    setCurrentHash(rawHash ? `#${rawHash}` : '');
    setMobileOpen(false);
  };

  const isActive = (item) => {
    const navigateTo = item?.navigateTo;
    if (!navigateTo) return false;

    const [rawPath, rawHash = ''] = navigateTo.split('#');
    if (rawHash) {
      return currentHash === `#${rawHash}` || activeSection === rawHash;
    }

    return location.pathname === getNormalizedPath(rawPath);
  };

  const isParentActive = (item) => item.children?.some(child => isActive(child));

  const toggleOpen = (item, listIndex, itemIndex) => {
    const key = `${listIndex}-${itemIndex}`;
    const isCurrentlyNotOpen = !Boolean(openMap[key]);

    setOpenMap(prev => ({
      ...prev,
      [key]: isCurrentlyNotOpen
    }));

    if (isCurrentlyNotOpen && !isMobile) {
      handleNavigate(item);
    }
  };

  const drawer = lists.map((list, listIndex) => (
    <div key={list.key}>
      <List>
        {list.items.map((item, itemIndex) => (
          <div key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive(item) || isParentActive(item)}
                onClick={() =>
                  item.children
                    ? toggleOpen(item, listIndex, itemIndex)
                    : handleNavigate(item)
                }
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={t(item.text)} />
                {item.children && (
                  openMap[`${listIndex}-${itemIndex}`] ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>

            {item.children && (
              <Collapse
                in={openMap[`${listIndex}-${itemIndex}`]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.children.map(child => (
                    <ListItemButton
                      key={child.text}
                      sx={{ paddingLeft: '2em' }}
                      selected={isActive(child)}
                      onClick={() => handleNavigate(child)}
                    >
                      <ListItemIcon>
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText primary={t(child.text)} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
      {listIndex < lists.length - 1 && <Divider />}
    </div>
  ));

  return (
    <Box className="global-page-content-container">
      <Box className="global-page-content-container-inner">
        <Box className="responsive-drawer-main-box">
          <Box
            component="nav"
            sx={{
              width: { md: drawerWidth },
              flexShrink: { md: 0 },
              position: { xs: 'static', md: 'sticky' },
              top: { xs: 'auto', md: '100px' },
              alignSelf: { xs: 'auto', md: 'flex-start' },
              maxHeight: { xs: 'auto', md: '100vh' }
            }}
          >
            <Drawer
              variant="temporary"
              className="responsive-drawer"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
              }}
              slotProps={{
                root: {
                  keepMounted: true // better open performance on mobile
                }
              }}
            >
              {drawer}
            </Drawer>

            <Drawer
              variant="permanent"
              className="responsive-drawer"
              sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': {
                  boxSizing: 'border-box',
                  width: drawerWidth,
                  position: 'relative',
                  overflowY: 'auto'
                }
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>

          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
          >
            <Button
              variant="contained"
              className="drawer-toggle-button"
              onClick={() => setMobileOpen(open => !open)}
              sx={{ display: { md: 'none' } }}
            >
              <MenuOpen className="drawer-toggle-icon" />
            </Button>
            {!disableOutletRender && <Outlet />}
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
