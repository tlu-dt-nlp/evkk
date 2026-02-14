import { Box, Button } from '@mui/material';
import { DefaultButtonStyle } from '../../const/StyleConstants';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Popover from '@mui/material/Popover';
import './styles/TableFilterButton.css';

export default function TableFilterButton({
                                            children,
                                            popoverId,
                                            handlePopoverOpen,
                                            popoverToggle,
                                            popoverAnchorEl,
                                            handlePopoverClose
                                          }) {

  return (
    <Box>
      <Button
        style={DefaultButtonStyle}
        aria-describedby={popoverId}
        variant="contained"
        onClick={handlePopoverOpen}
      >
        <FilterAltIcon fontSize="large" />
      </Button>
      <Popover
        id={popoverId}
        open={popoverToggle}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          horizontal: 'center',
          vertical: 'top'
        }}
      >
        <Box className="popover-box">
          {children}
        </Box>
      </Popover>
    </Box>
  );
}
