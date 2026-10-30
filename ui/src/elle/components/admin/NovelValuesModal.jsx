import { Box, Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DefaultButtonStyle, SecondaryButtonStyle } from '../../const/StyleConstants';
import ModalBase from '../modal/ModalBase';
import Translate from '../Translate';

function NovelTable({ rows, t }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell><strong>{t('admin_text_property_name')}</strong></TableCell>
          <TableCell><strong>{t('admin_text_property_value')}</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(({ propertyName, propertyValue }, idx) => (
          <TableRow key={idx}>
            <TableCell>{propertyName}</TableCell>
            <TableCell>{propertyValue}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function NovelValuesModal({ isOpen, novelValues, onCancel, onConfirm }) {
  const { t } = useTranslation();

  const novelNames = novelValues.filter((v) => v.isNovelName);
  const novelValueRows = novelValues.filter((v) => !v.isNovelName);

  return (
    <ModalBase
      disableCloseButton
      disableComfortClosing
      innerClassName="confirmation-modal"
      isOpen={isOpen}
      title="admin_novel_values_modal_title"
    >
      <Stack spacing={3}>
        {novelNames.length > 0 && (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Translate i18nKey="admin_novel_names_modal_message" />
            </Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              <NovelTable rows={novelNames} t={t} />
            </Box>
          </Box>
        )}

        {novelValueRows.length > 0 && (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Translate i18nKey="admin_novel_values_modal_message" />
            </Typography>
            <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
              <NovelTable rows={novelValueRows} t={t} />
            </Box>
          </Box>
        )}

        <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
          {t('admin_novel_values_modal_helper')}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>{t('admin_novel_values_confirm_message')}</strong>
        </Typography>

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
