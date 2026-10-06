import {
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { successEmitter } from '../../../App';
import { useGetPropertyCheckConfig, useUpdatePropertyCheckConfig } from '../../hooks/service/AdminTextService';
import { SuccessSnackbarEventType } from '../snackbar/SuccessSnackbar';

export default function PropertyCheckConfig() {
  const { t } = useTranslation();
  const { getPropertyCheckConfig } = useGetPropertyCheckConfig();
  const { updatePropertyCheckConfig } = useUpdatePropertyCheckConfig();
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    getPropertyCheckConfig().then((data) => setConfig(data ?? []));
  }, [getPropertyCheckConfig]);

  const handleToggle = useCallback((propertyName, newValue) => {
    setSaving(propertyName);
    updatePropertyCheckConfig([{ propertyName, isActive: newValue }]).then((ok) => {
      if (ok !== undefined) {
        setConfig((prev) =>
          prev.map((c) => c.propertyName === propertyName ? { ...c, isActive: newValue } : c)
        );
        successEmitter.emit(SuccessSnackbarEventType.GENERIC_SUCCESS);
      }
      setSaving(null);
    });
  }, [updatePropertyCheckConfig]);

  if (!config) return null;

  return (
    <>
      <h2 className="text-center pb-3">
        {t('admin_property_check_config_title')}
      </h2>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('admin_property_check_config_description')}
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>{t('admin_text_property_name')}</strong></TableCell>
              <TableCell align="right"><strong>{t('admin_property_check_active')}</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {config.map(({ propertyName, isActive }) => (
              <TableRow key={propertyName}>
                <TableCell>{propertyName}</TableCell>
                <TableCell align="right">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
                        disabled={saving === propertyName}
                        onChange={(e) => handleToggle(propertyName, e.target.checked)}
                        size="small"
                      />
                    }
                    label=""
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
