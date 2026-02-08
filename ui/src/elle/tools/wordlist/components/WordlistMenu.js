import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RouteConstants } from '../../../const/RouteConstants';

export default function WordlistMenu({ word, type, keepCapitalization, showCollocatesButton }) {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWordContext = () => {
    handleClose();
    navigate(`../${RouteConstants.WORDCONTEXT}?word=${word}&type=${type}&keepCapitalization=${keepCapitalization}`);
  };

  const handleCollocates = () => {
    handleClose();
    navigate(`../${RouteConstants.COLLOCATES}?word=${word}&type=${type}&keepCapitalization=${keepCapitalization}`);
  };

  const handleWordMeaning = () => {
    handleClose();
    window.open(`https://sonaveeb.ee/search/unif/dlall/dsall/${word}/1/est`);
  };

  const handleWordTranslation = () => {
    handleClose();
    window.open(`https://translate.google.com/?sl=et&text=${word}`);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        style={{ padding: 0 }}
      >
        <MoreHoriz />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleWordContext}>
          {t('concordances')}
        </MenuItem>
        {showCollocatesButton &&
          <MenuItem onClick={handleCollocates}>
            {t('common_neighbouring_words')}
          </MenuItem>
        }
        <MenuItem onClick={handleWordMeaning}>
          {t('common_definition')}
        </MenuItem>
        <MenuItem onClick={handleWordTranslation}>
          {t('common_translation')}
        </MenuItem>
      </Menu>
    </>
  );
}
