import { makeStyles } from '@mui/styles';
import { styled, tooltipClasses } from '@mui/material';
import { HashLink } from 'react-router-hash-link';

export const useStyles = makeStyles((_theme) => ({
  formControl: {
    margin: 1,
    width: 300
  },
  indeterminateColor: {
    color: '#f50057'
  },
  selectAllText: {
    fontWeight: 500
  },
  selectedAll: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
  }
}));

export const AccordionStyle = {
  '&:before': {
    backgroundColor: 'transparent !important'
  }
};

export const DefaultButtonStyle = {
  backgroundColor: '#9C27B0',
  fontWeight: 'bold',
  lineHeight: '30px',
  borderRadius: '15px',
  '&:hover': {
    backgroundColor: '#852197'
  },
  '&:disabled': {
    backgroundColor: 'lightgray'
  }
};

export const SecondaryButtonStyle = {
  backgroundColor: '#CDA9FD',
  fontWeight: 'bold',
  lineHeight: '30px',
  borderRadius: '15px',
  '&:hover': {
    backgroundColor: '#B593E1'
  },
  '&:disabled': {
    backgroundColor: 'lightgray'
  }
};

export const ToggleButtonGroupStyle = {
  borderRadius: '5px',
  overflow: 'hidden',
  display: 'inline-flex',
  height: '1.5rem',

  '.MuiToggleButton-root': {
    borderRadius: 0,
    border: '1px solid gray',

    '&.Mui-selected': {
      backgroundColor: '#E1BEE7',
      color: '#6A1B9A',
      '&:hover': {
        backgroundColor: '#D1A7E0'
      }
    },

    '&:hover': {
      backgroundColor: 'rgba(156, 39, 176, 0.08)'
    },

    '&.Mui-disabled': {
      color: '#aaa',
      borderColor: '#ccc'
    }
  },

  '.MuiToggleButtonGroup-grouped:not(:last-of-type)': {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  '.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
    borderLeft: 'none',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  '.MuiToggleButtonGroup-grouped:first-of-type': {
    borderTopLeftRadius: '5px',
    borderBottomLeftRadius: '5px'
  },
  '.MuiToggleButtonGroup-grouped:last-of-type': {
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px'
  }
};


export const DefaultSliderStyle = {
  color: '#9C27B0',
  '& .MuiSlider-rail': {
    backgroundColor: 'rgba(255, 208, 253, 1)'
  },
  '& .MuiSlider-track': {
    backgroundColor: '#9C27B0'
  }
};

export const DefaultInputStyle = {
  '& .MuiInputBase-input': {
    padding: '10px',
    transition: '0.3s',
    borderBottom: 'solid #FFCFFD 1px',
    '&:hover': {
      borderBottom: 'solid #CCA8FE 1px'
    },
    '&:focus': {
      borderBottom: 'solid #852197 1px'
    }
  }
};

export const DefaultButtonStyle5px = {
  ...DefaultButtonStyle,
  borderRadius: '5px'
};

export const DefaultCircularProgressStyle = {
  color: '#9C27B0'
};

export const FooterLink = styled(HashLink)({
  color: '#1B1B1BDD',
  fontSize: '0.9rem',
  fontWeight: 100,
  textDecoration: 'none',
  marginBottom: '0.5rem',
  '&:hover': {
    color: '#9C27B0',
    textDecoration: 'none'
  },
  '&.active': {
    color: '#9C27B0',
    textDecoration: 'none'
  }
});

export const TabStyle = {
  '& button:hover': { backgroundColor: 'rgba(204, 168, 253, 1)', transition: '0.5s' },
  '& button:active': { backgroundColor: '#9C27B0' },
  '& button': {
    backgroundColor: 'rgba(255, 208, 253, 1)',
    display: 'inline-block',
    color: 'black',
    fontWeight: 'bold',
    height: '60px',
    borderBottom: '4px solid #9C27B0',
    borderTop: '4px solid #9C27B0',
    transition: '0.5s'
  },
  '& button:first-of-type': {
    borderRadius: '25px 0 0 25px',
    paddingLeft: '25px',
    borderLeft: '4px solid #9C27B0'
  },
  '& button:last-child': {
    borderRadius: '0 25px 25px 0',
    paddingRight: '25px',
    borderRight: '4px solid #9C27B0'
  },
  '& button.Mui-selected': {
    backgroundColor: '#9C27B0',
    color: 'white',
    borderColor: 'rgba(204, 168, 253, 1)',
    transition: '0.5s'
  },
  '& .MuiTabs-flexContainer': {
    border: 'none',
    borderBottom: 'none'
  },
  '& .MuiTabs-root': {
    border: 'none',
    borderBottom: 'none'
  },
  '& .MuiTab-root': {
    textTransform: 'none'
  }
};

export const ITEM_HEIGHT = 48;

export const ITEM_PADDING_TOP = 8;

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 11.5 + ITEM_PADDING_TOP,
      width: 425
    }
  },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center'
  },
  variant: 'menu'
};

export const ElleDefaultChip = {
  borderColor: '#9C27B0',
  '& .MuiChip-deleteIcon:hover': {
    color: '#EB0014'
  },
  '& .MuiChip-avatar': {
    width: 'auto',
    minWidth: '24px',
    padding: '0 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60vw',
  bgcolor: '#FCFCFC',
  boxShadow: 24,
  borderRadius: '12px',
  p: 4,
  maxHeight: '80vh',
  overflow: 'auto'
};

export const ContentEditableDiv = {
  overflowY: 'auto',
  border: 'gray 1px solid',
  borderRadius: '5px',
  height: '20vw',
  minHeight: '200px',
  padding: '1rem',
  '&[contenteditable="true"]:focus': {
    outline: 'gray 1px solid'
  }

};

export const CorrectorErrorCircle = (color) => {
  return {
    backgroundColor: color,
    borderRadius: '25%',
    width: '1em',
    height: '1em',
    lineHeight: '100%',
    marginY: 'auto',
    marginRight: '1em'
  };
};

export const CorrectorAccordionStyle = {
  borderRadius: '10px',
  boxShadow: 'none',
  '&:before': {
    display: 'none'
  },
  '&.Mui-expanded': {
    margin: 0
  }
};

export const correctionTooltipSlotProps = {
  popper: {
    sx: {
      [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
        {
          marginBottom: '0px'
        }
    }
  },
  tooltip: {
    sx: {
      maxWidth: 1200,
      whiteSpace: 'normal',
      backgroundColor: 'transparent'
    }
  }
};

export const correctionTooltipComponentsProps = {
  tooltip: {
    sx: {
      bgcolor: 'rgba(0, 0, 0, 0)'
    }
  }
};

export const correctorDocxColors = {
  'red': 'ea9999',
  'punctuation': 'b6d7a8',
  'yellow': 'ffe599',
  'blue': 'c9daf8',
  'orange': 'f6b26a',
  'violet': 'ada1d4',
  'long-sentence-color': 'ea9999',
  'long-word-color': 'b6d7a8',
  'noun-color': 'c9daf8',
  'same-sentence-color': 'f6b26a',
  'next-sentence-color': 'ffe599',
  'both-sentence-color': 'ea9999',
  'uncommon-word-color': 'b6d7a8',
  'abstract-word-color': 'c9daf8',
  'content-word-color': 'ada1d4'
};
