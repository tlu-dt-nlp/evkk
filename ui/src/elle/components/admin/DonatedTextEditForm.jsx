import { Grid, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { DonatedTextDetailsFormMode } from '../../const/Constants';
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
    setText(event.target.value.replaceAll('\n', '\\n'));
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
          value={text.replaceAll('\\n', '\n')}
        />
      </Grid>

      <DonatedTextDetailsForm
        formData={formData}
        mode={DonatedTextDetailsFormMode.PUBLISH}
        onChange={handleChange}
        onMultiValueChange={handleMultiValueChange}
      />
    </Grid>
  );
}
