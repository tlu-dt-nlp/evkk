import { Box, Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { DefaultButtonStyle, SecondaryButtonStyle } from '../../const/StyleConstants';
import ModalBase from './ModalBase';
import '../styles/ConfirmationModal.css';

export default function ConfirmationModal({
  isOpen,
  message,
  onCancel,
  onConfirm,
  setIsOpen,
  title
}) {
  const { t } = useTranslation();

  return (
    <ModalBase
      disableCloseButton
      disableComfortClosing
      innerClassName="confirmation-modal"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={title}
    >
      <Stack spacing={3}>
        <Box>{message}</Box>

        <Stack direction="row" spacing={2}>
          <Button
            onClick={onConfirm}
            size="small"
            sx={DefaultButtonStyle}
            variant="contained"
          >
            {t('common_yes')}
          </Button>

          <Button
            onClick={onCancel}
            size="small"
            sx={SecondaryButtonStyle}
            variant="outlined"
          >
            {t('common_no')}
          </Button>
        </Stack>
      </Stack>
    </ModalBase>
  );
}
