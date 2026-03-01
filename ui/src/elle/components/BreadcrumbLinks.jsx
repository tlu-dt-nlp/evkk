import { Box, Breadcrumbs, Link, styled } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './styles/BreadcrumbLinks.css';

const MenuLink = styled(Link)({
  color: '#1B1B1B',
  textDecoration: 'none',
  fontFamily: ['\'Exo 2\'', 'sans-serif'].join(','),
  '&:hover': {
    color: '#9C27B0',
    textDecoration: 'none'
  }
});

export default function BreadcrumbLinks() {
  const { t } = useTranslation();
  const matches = useMatches();

  const breadcrumbs = matches
    .map(m => typeof m.handle?.crumb === 'function'
      ? m.handle.crumb()
      : null
    )
    .filter(Boolean);

  if (breadcrumbs.length <= 1) return null;

  return (
    <Box className="breadcrumb-box">
      <Breadcrumbs>
        {breadcrumbs.map((crumb, index) => (
          <MenuLink
            to={crumb.to}
            key={crumb.to}
            className="crumb"
            component={crumb.to ? RouterLink : 'span'}
          >
            {index !== 0 ? t(crumb.translateKey) : <HomeIcon />}
          </MenuLink>
        ))}
      </Breadcrumbs>
    </Box>
  );
}
