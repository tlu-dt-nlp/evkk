import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultButtonStyle, ModalScrollStyle, SecondaryButtonStyle } from '../../const/StyleConstants';
import ModalBase from '../modal/ModalBase';
import { getNoticeStatus, NoticeSeverity, NoticeStatus, toAlertSeverity } from '../notice/NoticeConstants';
import { fromDateTimeLocalInputValue, toDateTimeLocalInputValue } from '../../util/DateUtils';
import { getNoticePageLabel, isPageKeyCoveredBy, mapPagesByKey, removeCoveredPageKeys } from '../notice/NoticePages';

const EMPTY_FORM = {
  contentEt: '',
  contentEn: '',
  severity: NoticeSeverity.INFO,
  allPages: true,
  pages: [],
  dismissible: true,
  validFrom: '',
  validTo: ''
};

const toForm = (notice) => notice
  ? {
    contentEt: notice.contentEt,
    contentEn: notice.contentEn,
    severity: notice.severity,
    allPages: !notice.pages.length,
    pages: notice.pages,
    dismissible: notice.dismissible,
    validFrom: toDateTimeLocalInputValue(notice.validFrom),
    validTo: toDateTimeLocalInputValue(notice.validTo)
  }
  : EMPTY_FORM;

const validate = (form) => {
  const errors = {};
  if (!form.contentEt.trim()) errors.contentEt = 'admin_notices.errors.content_required';
  if (!form.contentEn.trim()) errors.contentEn = 'admin_notices.errors.content_required';
  if (!form.allPages && !form.pages.length) errors.pages = 'admin_notices.errors.pages_required';
  if (form.validTo && !form.validFrom) {
    errors.validTo = 'admin_notices.errors.valid_to_without_valid_from';
  } else if (form.validTo && form.validFrom && new Date(form.validTo) <= new Date(form.validFrom)) {
    errors.validTo = 'admin_notices.errors.valid_to_before_valid_from';
  }
  return errors;
};

// dropdown rows: sections in bold, subpages by their own name only (they are indented under the section)
const renderPageOptionLabel = (key, pagesByKey, t) => {
  const page = pagesByKey.get(key);
  if (page?.isSection) {
    return <b>{getNoticePageLabel(key, pagesByKey, t)}</b>;
  }
  if (page?.section) {
    return t(page.labelKey);
  }
  return getNoticePageLabel(key, pagesByKey, t);
};

// Safari shows the current date and time in an empty date field, which looks like a filled-in value,
// so the native date text is hidden while the field is empty and not being edited
const emptyDateTimeStyle = {
  '& input[data-empty="true"]:not(:focus)::-webkit-datetime-edit': { opacity: 0 }
};

const dateTimeInputProps = (value) => ({
  inputLabel: { shrink: true },
  htmlInput: { 'data-empty': !value }
});

export default function NoticeFormModal({ isOpen, setIsOpen, notice, pages, onSubmit }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const pagesByKey = useMemo(() => mapPagesByKey(pages), [pages]);

  // keys that no longer exist in the UI are kept as options so they can be seen and removed
  const pageOptions = useMemo(() => [
    ...pages.map(page => page.key),
    ...form.pages.filter(key => !pagesByKey.has(key))
  ], [pages, pagesByKey, form.pages]);

  // a layout effect, so the modal is first drawn with the right content instead of changing right after opening
  useLayoutEffect(() => {
    if (isOpen) {
      setForm(toForm(notice));
      setSubmitted(false);
    }
  }, [isOpen, notice]);

  const errors = submitted ? validate(form) : {};

  // dismissals are stored per notice id in users' browsers, so edits never reach users who already closed it
  const isEditingAndShownClosableNotice = !!notice
    && notice.dismissible
    && getNoticeStatus(notice) === NoticeStatus.ACTIVE;

  const setField = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (Object.keys(validate(form)).length) return;

    onSubmit({
      contentEt: form.contentEt.trim(),
      contentEn: form.contentEn.trim(),
      severity: form.severity,
      pages: form.allPages ? [] : form.pages,
      dismissible: form.dismissible,
      validFrom: fromDateTimeLocalInputValue(form.validFrom),
      validTo: fromDateTimeLocalInputValue(form.validTo)
    });
  };

  return (
    <ModalBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      disableComfortClosing
      sx={ModalScrollStyle}
      title={notice ? 'admin_notices.form.edit_title' : 'admin_notices.form.add_title'}
    >
      <Stack spacing={2.5}>
        {isEditingAndShownClosableNotice && (
          <Alert severity="warning">
            {t('admin_notices.form.dismissed_edit_warning')}
          </Alert>
        )}
        <TextField
          label={t('admin_notices.form.content_et')}
          value={form.contentEt}
          onChange={setField('contentEt')}
          error={!!errors.contentEt}
          helperText={errors.contentEt && t(errors.contentEt)}
          multiline
          minRows={2}
          fullWidth
          required
        />
        <TextField
          label={t('admin_notices.form.content_en')}
          value={form.contentEn}
          onChange={setField('contentEn')}
          error={!!errors.contentEn}
          helperText={errors.contentEn && t(errors.contentEn)}
          multiline
          minRows={2}
          fullWidth
          required
        />

        <TextField
          select
          label={t('admin_notices.severity.label')}
          value={form.severity}
          onChange={setField('severity')}
          fullWidth
        >
          {Object.values(NoticeSeverity).map(severity => (
            <MenuItem key={severity} value={severity}>
              {t(`admin_notices.severity.${severity.toLowerCase()}`)}
            </MenuItem>
          ))}
        </TextField>

        <Stack spacing={1} useFlexGap>
          <FormControlLabel
            control={<Switch checked={form.allPages} onChange={setField('allPages')} />}
            label={t('admin_notices.pages.all_pages')}
          />
          {!form.allPages && (
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={pageOptions}
              value={form.pages}
              onChange={(_, value) => setForm(prev => ({ ...prev, pages: removeCoveredPageKeys(value) }))}
              getOptionLabel={key => getNoticePageLabel(key, pagesByKey, t)}
              getOptionDisabled={key => form.pages.some(selected => selected !== key && isPageKeyCoveredBy(key, selected))}
              renderOption={({ key: _, ...props }, key) => {
                const isSubpage = !!pagesByKey.get(key)?.section;
                return (
                  <li key={key} {...props} style={{ ...props.style, paddingLeft: isSubpage ? 32 : 16 }}>
                    {renderPageOptionLabel(key, pagesByKey, t)}
                  </li>
                );
              }}
              renderValue={(value, getItemProps) => value.map((key, index) => {
                const { key: itemKey, ...itemProps } = getItemProps({ index });
                return (
                  <Chip
                    key={itemKey}
                    size="small"
                    color={pagesByKey.has(key) ? 'default' : 'warning'}
                    label={getNoticePageLabel(key, pagesByKey, t)}
                    {...itemProps}
                  />
                );
              })}
              renderInput={({ InputProps, inputProps, InputLabelProps, ...params }) => (
                <TextField
                  {...params}
                  slotProps={{ input: InputProps, htmlInput: inputProps, inputLabel: InputLabelProps }}
                  label={t('admin_notices.pages.label')}
                  error={!!errors.pages}
                  helperText={errors.pages ? t(errors.pages) : t('admin_notices.pages.helper')}
                />
              )}
            />
          )}
        </Stack>

        <FormControl>
          <FormControlLabel
            control={<Switch checked={form.dismissible} onChange={setField('dismissible')} />}
            label={t('admin_notices.dismissible.label')}
          />
          <FormHelperText sx={{ mt: 0 }}>{t('admin_notices.dismissible.helper')}</FormHelperText>
        </FormControl>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            type="datetime-local"
            label={t('admin_notices.validity.valid_from')}
            value={form.validFrom}
            onChange={setField('validFrom')}
            slotProps={dateTimeInputProps(form.validFrom)}
            sx={emptyDateTimeStyle}
            fullWidth
          />
          <TextField
            type="datetime-local"
            label={t('admin_notices.validity.valid_to')}
            value={form.validTo}
            onChange={setField('validTo')}
            error={!!errors.validTo}
            helperText={errors.validTo && t(errors.validTo)}
            slotProps={dateTimeInputProps(form.validTo)}
            sx={emptyDateTimeStyle}
            fullWidth
          />
        </Stack>
        <FormHelperText sx={{ mt: '0 !important' }}>{t('admin_notices.validity.helper')}</FormHelperText>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('admin_notices.form.preview')}</Typography>
          <Stack spacing={1}>
            {[form.contentEt, form.contentEn].map((content, index) => (
              <Alert
                key={index}
                severity={toAlertSeverity(form.severity)}
                onClose={form.dismissible ? () => {} : undefined}
                sx={{ whiteSpace: 'pre-line' }}
              >
                {content || '…'}
              </Alert>
            ))}
          </Stack>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" size="small" sx={DefaultButtonStyle} onClick={handleSubmit}>
            {t('common_save')}
          </Button>
          <Button variant="outlined" size="small" sx={SecondaryButtonStyle} onClick={() => setIsOpen(false)}>
            {t('common_cancel')}
          </Button>
        </Stack>
      </Stack>
    </ModalBase>
  );
}
