import { Box, Drawer } from '@mui/material';

const FilterSidebar = ({ mobileOpen, onMobileClose, children }) => (
  <Box component="nav" className="stats-sidebar">
    <Drawer
      variant="temporary"
      className="responsive-drawer statistics-app stats-drawer-temporary"
      open={mobileOpen}
      onClose={onMobileClose}
      slotProps={{ root: { keepMounted: true } }}
    >
      {children}
    </Drawer>

    <Drawer
      variant="permanent"
      className="responsive-drawer statistics-app stats-drawer-permanent"
      open
    >
      {children}
    </Drawer>
  </Box>
);

export default FilterSidebar;
