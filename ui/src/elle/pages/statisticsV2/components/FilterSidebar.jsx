import { Box, Drawer } from '@mui/material';

const FilterSidebar = ({ mobileOpen, onMobileClose, children }) => (
  <Box component="nav" className="sv2-sidebar">
    <Drawer
      variant="temporary"
      className="responsive-drawer statistics-app sv2-drawer-temporary"
      open={mobileOpen}
      onClose={onMobileClose}
      slotProps={{ root: { keepMounted: true } }}
    >
      {children}
    </Drawer>

    <Drawer
      variant="permanent"
      className="responsive-drawer statistics-app sv2-drawer-permanent"
      open
    >
      {children}
    </Drawer>
  </Box>
);

export default FilterSidebar;
