import { Grid, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  ageOptions,
  corpuses,
  countryOptionsForQueryResults,
  degreeOptions,
  domainSaveOptions,
  educationOptions,
  genderOptions,
  languageOptionsForNativeLangs,
  nationalityOptions,
  studyLevelOptions,
  textLanguageOptions,
  textTypeList,
  usedMaterialsDisplayOptions,
  usedMaterialsMultiList
} from '../../const/Constants';
import { translateOption, translateOptions } from '../../util/AdminUtils';
import ReadOnlyField from './ReadOnlyField';

export default function PublishedTextReadOnlyForm({ formData }) {
  const { t } = useTranslation();

  const isAcademic = formData.korpus === 'cwUSEqQLt';
  const isL1Estonian = formData.korpus === 'cYDRkpymb';
  const isL2Exams = formData.korpus === 'clWmOIrLa';

  return (
    <Grid container
          spacing={{ xs: 6, sm: 3 }}
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
    >
      <Grid item size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          <b>{t('query_subcorpus')}</b>

          <Grid container spacing={2}>
            <span>{translateOption(t, corpuses, formData.korpus)}</span>
          </Grid>
        </Stack>
      </Grid>

      <Grid item size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          <b>{t('common_text_data')}</b>

          <Grid container spacing={2}>
            <ReadOnlyField
              label={t('query_text_data_type')}
              value={translateOption(t, textTypeList, formData.tekstityyp)}
            />
            <ReadOnlyField
              label={t('query_text_data_language')}
              value={translateOption(t, textLanguageOptions, formData.tekstikeel)}
            />
            {!isAcademic && !isL1Estonian && (
              <ReadOnlyField
                label={t('query_text_data_level')}
                value={formData.keeletase}
              />
            )}
            {isL1Estonian && (
              <ReadOnlyField
                label={t('query_text_data_score')}
                value={formData.tulemusvahemik}
              />
            )}
            {!isAcademic && (
              <ReadOnlyField
                label={t('query_text_data_used_supporting_materials')}
                value={translateOption(t, usedMaterialsDisplayOptions, formData.abivahendid)}
              />
            )}
            {isAcademic && (
              <>
                <ReadOnlyField
                  label={t('common_text_data_field_of_research')}
                  value={translateOption(t, domainSaveOptions, formData.valdkond)}
                />
                <ReadOnlyField
                  label={t('publish_your_text_text_data_supporting_material')}
                  value={translateOptions(t, usedMaterialsMultiList, formData.akadOppematerjal)}
                />
              </>
            )}
            <ReadOnlyField
              label={t('query_text_data_year_of_publication')}
              value={formData.ajavahemik}
            />
          </Grid>
        </Stack>
      </Grid>

      <Grid item size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          <b>{t('common_author_data')}</b>

          <Grid container spacing={2}>
            <ReadOnlyField
              label={t('query_author_data_age')}
              value={translateOption(t, ageOptions, formData.vanusevahemik)}
            />
            <ReadOnlyField
              label={t('query_author_data_gender')}
              value={translateOption(t, genderOptions, formData.sugu)}
            />
            {!isAcademic && (
              <ReadOnlyField
                label={t('query_author_data_education')}
                value={translateOption(t, educationOptions, formData.haridus)}
              />
            )}
            {isAcademic && (
              <>
                <ReadOnlyField
                  label={t('query_author_data_level_of_study')}
                  value={translateOption(t, studyLevelOptions, formData.oppeaste)}
                />
                <ReadOnlyField
                  label={t('query_author_data_degree')}
                  value={translateOption(t, degreeOptions, formData.teaduskraad)}
                />
              </>
            )}
            {!isL2Exams && (
              <ReadOnlyField
                label={t('query_author_data_native_language')}
                value={translateOption(t, languageOptionsForNativeLangs, formData.emakeel)}
              />
            )}
            {isAcademic && (
              <ReadOnlyField
                label={t('query_author_data_other_languages')}
                value={formData.muudkeeled}
              />
            )}
            {isL2Exams && (
              <ReadOnlyField
                label={t('query_author_data_nationality')}
                value={translateOption(t, nationalityOptions, formData.kodakondsus)}
              />
            )}
            <ReadOnlyField
              label={t('query_author_data_country')}
              value={translateOption(t, countryOptionsForQueryResults, formData.riik)}
            />
          </Grid>
        </Stack>
      </Grid>
    </Grid>
  );
}
