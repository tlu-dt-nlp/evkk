import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { corpuses, DonatedTextDetailsFormMode, textLanguageOptions } from '../../const/Constants';
import DonatedTextDetailsForm from '../form/DonatedTextDetailsForm';

export default function DonatedTextEditForm({ formData, setFormData, setText, text }) {
  const { t } = useTranslation();

  const handleChange = (event) => {
    setFormData(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleTextChange = (event) => {
    setText(event.target.value.replaceAll('\n', String.raw`\n`));
  };

  const handleMultiValueChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <Grid container
          spacing={{ xs: 6, sm: 3 }}
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
    >
      <Grid item
            size={{ xs: 12, md: 6 }}
            sx={{ paddingTop: '2em' }}
      >
        <TextField
          label={t('publish_your_text_title')}
          multiline
          name="title"
          onChange={handleChange}
          required
          size="small"
          value={formData.title}
        />
        <TextField
          label={t('publish_your_text_exercise_description')}
          multiline
          name="kirjeldus"
          onChange={handleChange}
          rows={2}
          value={formData.kirjeldus}
        />
        <TextField
          label={t('publish_your_text_content')}
          multiline
          name="sisu"
          onChange={handleTextChange}
          required
          rows={8}
          value={text.replaceAll(String.raw`\n`, '\n')}
        />
      </Grid>

      <DonatedTextDetailsForm
        formData={formData}
        mode={DonatedTextDetailsFormMode.PUBLISH}
        onChange={handleChange}
        onMultiValueChange={handleMultiValueChange}
      />

      <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
        <div className="mb-2 font-weight-bold">{t('query_inferred_data')}</div>
        <FormControl size="small">
          <InputLabel>{t('query_subcorpus')}</InputLabel>
          <Select
            name="korpus"
            value={formData.korpus}
            onChange={handleChange}
          >
            {Object.keys(corpuses).map(corpus => (
              <MenuItem key={corpus} value={corpus}>{t(corpuses[corpus])}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>{t('query_text_data_language')}</InputLabel>
          <Select
            name="tekstikeel"
            value={formData.tekstikeel}
            onChange={handleChange}
          >
            {Object.keys(textLanguageOptions).map(lang => (
              <MenuItem key={lang} value={lang}>{t(textLanguageOptions[lang])}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
