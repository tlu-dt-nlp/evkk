import { Container } from '@mui/material';
import BreadcrumbLinks from '../components/BreadcrumbLinks';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <Container
      disableGutters
      maxWidth={false}
      className="global-page-container"
    >
      <BreadcrumbLinks />
      <Outlet />
    </Container>
  );
}
