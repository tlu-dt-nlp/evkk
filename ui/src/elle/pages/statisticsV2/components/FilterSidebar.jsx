import { Box, Drawer } from '@mui/material';

// Renders the same drawer content twice: a temporary drawer on mobile and a permanent one
// on desktop. Both carry .statistics-app because MUI portals the temporary drawer out of
// the page, where the page-scoped CSS would otherwise not reach it.
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
