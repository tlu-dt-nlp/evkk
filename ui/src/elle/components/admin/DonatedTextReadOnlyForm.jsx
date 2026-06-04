import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  countryOptionsForAddingText,
  degreeOptions,
  domainSaveOptions,
  educationOptions,
  genderOptions,
  studyLevelOptions,
  textPublishMainTextTypesOptions,
  textTypeList,
  usedMaterialsMultiList,
  usedMaterialsSaveOptions
} from '../../const/Constants';
import { translateOption, translateOptions } from '../../util/AdminUtils';
import ReadOnlyField from './ReadOnlyField';

export default function DonatedTextReadOnlyForm({ formData, text }) {
  const { t } = useTranslation();

  return (
    <Grid container
          spacing={{ xs: 6, sm: 3 }}
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
    >
      <Grid item
            size={{ xs: 12, md: 6 }}
            sx={{ paddingTop: '2em' }}
      >
        <Grid container spacing={2}>
          <ReadOnlyField
            label={t('publish_your_text_title')}
            value={formData.title}
          />
          <ReadOnlyField
            label={t('publish_your_text_exercise_description')}
            value={formData.kirjeldus}
          />
          <ReadOnlyField
            label={t('publish_your_text_content')}
            value={text}
            multiline
          />
        </Grid>
      </Grid>

      <Grid item size={{ xs: 12, md: 3 }}>
        <h5>{t('common_text_data')}</h5>

        <Grid container spacing={2}>
          <ReadOnlyField
            label={t('publish_your_text_text_data_main_text_type')}
            value={translateOption(t, textPublishMainTextTypesOptions, formData.liik)}
          />
          <ReadOnlyField
            label={t('common_text_data_field_of_research')}
            value={translateOption(t, domainSaveOptions, formData.autoriValdkond)}
          />
          <ReadOnlyField
            label={t('publish_your_text_text_data_sub_text_type')}
            value={translateOption(t, textTypeList, formData.mitteakadAlamliik || formData.akadAlamliik)}
          />
          <ReadOnlyField
            label={t('publish_your_text_text_data_publication')}
            value={formData.artikkelValjaanne}
          />
          <ReadOnlyField
            label={t('publish_your_text_text_data_year')}
            value={formData.artikkelAasta}
          />
          <ReadOnlyField
            label={t('publish_your_text_text_data_number')}
            value={formData.artikkelNumber}
          />
          <ReadOnlyField
            label={t('publish_your_text_text_data_pages')}
            value={formData.artikkelLehekyljed}
          />
          <ReadOnlyField
            label={t('query_text_data_used_study_or_supporting_materials')}
            value={translateOption(t, usedMaterialsSaveOptions, formData.oppematerjal)}
          />
          <ReadOnlyField
            label={t('publish_your_text_text_data_supporting_material')}
            value={translateOptions(t, usedMaterialsMultiList, formData.akadOppematerjal)}
          />
        </Grid>
      </Grid>

      <Grid item size={{ xs: 12, md: 3 }}>
        <h5>{t('common_author_data')}</h5>

        <Grid container spacing={2}>
          <ReadOnlyField
            label={t('query_author_data_age')}
            value={formData.autoriVanus}
          />
          <ReadOnlyField
            label={t('query_author_data_gender')}
            value={translateOption(t, genderOptions, formData.autoriSugu)}
          />
          <ReadOnlyField
            label={t('query_author_data_native_language')}
            value={formData.autoriEmakeel}
          />
          <ReadOnlyField
            label={t('query_author_data_other_languages_plural')}
            value={formData.autoriMuudKeeled}
          />
          <ReadOnlyField
            label={t('query_author_data_country')}
            value={translateOption(t, countryOptionsForAddingText, formData.autoriElukohariik)}
          />
          <ReadOnlyField
            label={t('query_author_data_education')}
            value={translateOption(t, educationOptions, formData.autoriHaridus)}
          />
          <ReadOnlyField
            label={t('query_author_data_level_of_study')}
            value={translateOption(t, studyLevelOptions, formData.autoriOppeaste)}
          />
          <ReadOnlyField
            label={t('query_author_data_degree')}
            value={translateOption(t, degreeOptions, formData.autoriTeaduskraad)}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
