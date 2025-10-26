import { Box, IconButton, Modal } from '@mui/material';
import { modalStyle } from '../../const/StyleConstants';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/ModalBase.css';
import TooltipButton from '../tooltip/TooltipButton';

export default function ModalBase({
                                    isOpen,
                                    setIsOpen,
                                    innerClassName,
                                    title,
                                    titleTooltip,
                                    disableComfortClosing = false,
                                    disableCloseButton = false,
                                    children
                                  }) {

  const { t } = useTranslation();

  return (
    <Modal
      open={isOpen}
      onClose={(_, reason) => {
        if (disableComfortClosing && reason === 'backdropClick') {
          return;
        }
        setIsOpen(false);
      }}
      disableAutoFocus
      disableEscapeKeyDown={disableComfortClosing}
    >
      <Box
        sx={modalStyle}
        className={`modal-base-root ${innerClassName ?? ''}`.trim()}
      >
        <div className="modal-head">
          {t(title)}
          {titleTooltip &&
            <TooltipButton>
              {t(titleTooltip)}
            </TooltipButton>}
        </div>
        {!disableCloseButton && (
          <IconButton
            aria-label="close"
            onClick={() => {
              setIsOpen(false);
            }}
            className="close-button"
          >
            <CloseIcon />
          </IconButton>
        )}
        <br />
        <div>
          {children}
        </div>
      </Box>
    </Modal>
  );
}
