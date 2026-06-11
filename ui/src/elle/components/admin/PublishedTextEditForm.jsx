import {
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  addedYearOptions,
  ageOptions,
  corpuses,
  countryOptionsForQueryResults,
  degreeOptions,
  domainDisplayOptions,
  educationOptions,
  genderOptions,
  languageOptionsForNativeLangs,
  nationalityOptions,
  scoreOptions,
  studyLevelOptions,
  textLanguageOptions,
  textLevelOptions,
  textTypeList,
  textTypesOptions,
  usedMaterialsDisplayOptions,
  usedMaterialsMultiList,
  usedMaterialsMultiOptions
} from '../../const/Constants';
import SelectMultiple, { SelectMultipleType } from '../SelectMultiple';

export default function PublishedTextEditForm({ formData, setFormData }) {
  const { t } = useTranslation();

  const isAcademic = formData.korpus === 'cwUSEqQLt';
  const isL1Estonian = formData.korpus === 'cYDRkpymb';
  const isL2Exams = formData.korpus === 'clWmOIrLa';

  const getCorpusTypeOptions = () => {
    const corpusTypes = textTypesOptions[formData.korpus];
    if (!corpusTypes) {
      return [];
    }

    const result = [];

    Object.entries(corpusTypes).forEach(([key, value]) => {
      if (typeof value === 'string') {
        result.push({ key, label: textTypeList[key] });
      } else {
        Object.keys(value).forEach(subKey => {
          result.push({ key: subKey, label: textTypeList[subKey] });
        });
      }
    });

    return result;
  };

  const setAkadOppematerjal = (newValues) => {
    const yesItems = Object.keys(usedMaterialsMultiOptions['query_text_data_used_study_or_supporting_materials_yes']);
    const hadNo = formData.akadOppematerjal.includes('ei');
    const hasNo = newValues.includes('ei');
    const hasYesItem = newValues.some(v => yesItems.includes(v));

    let result;

    if (hasNo && !hadNo) {
      result = ['ei'];
    } else if (hasYesItem && hasNo) {
      result = newValues.filter(v => v !== 'ei');
    } else {
      result = newValues;
    }

    setFormData(prev => ({
      ...prev,
      akadOppematerjal: result
    }));
  };

  const handleChange = (event) => {
    setFormData(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <Grid container
          spacing={{ xs: 6, sm: 3 }}
          sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
    >
      <Grid item size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          <b>{t('query_subcorpus')}</b>

          <Grid container spacing={2}>
            <FormControl required size="small">
              <RadioGroup
                name="korpus"
                value={formData.korpus}
                onChange={handleChange}
              >
                {Object.keys(corpuses).map(corpus => (
                  <FormControlLabel
                    control={<Radio />}
                    key={corpus}
                    label={t(corpuses[corpus])}
                    value={corpus}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Stack>
      </Grid>

      <Grid item size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          <b>{t('common_text_data')}</b>

          <Grid container spacing={2}>
            <FormControl size="small">
              <InputLabel>{t('query_text_data_type')}</InputLabel>
              <Select
                name="tekstityyp"
                onChange={handleChange}
                value={formData.tekstityyp}
              >
                {getCorpusTypeOptions().map(({ key, label }) => (
                  <MenuItem key={key} value={key}>{t(label)}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>{t('query_text_data_language')}</InputLabel>
              <Select
                name="tekstikeel"
                onChange={handleChange}
                value={formData.tekstikeel}
              >
                {Object.keys(textLanguageOptions).map(language => (
                  <MenuItem key={language} value={language}>{t(textLanguageOptions[language])}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {!isAcademic && !isL1Estonian && (
              <FormControl size="small">
                <InputLabel>{t('query_text_data_level')}</InputLabel>
                <Select
                  name="keeletase"
                  onChange={handleChange}
                  value={formData.keeletase}
                >
                  {textLevelOptions.map(level => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {isL1Estonian && (
              <FormControl size="small">
                <InputLabel>{t('query_text_data_score')}</InputLabel>
                <Select
                  name="tulemusvahemik"
                  onChange={handleChange}
                  value={formData.tulemusvahemik}
                >
                  {scoreOptions.map(option => (
                    <MenuItem key={option.key} value={option.range}>{t(option.key)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {!isAcademic && (
              <FormControl size="small">
                <InputLabel>{t('query_text_data_used_supporting_materials')}</InputLabel>
                <Select
                  name="abivahendid"
                  value={formData.abivahendid}
                  onChange={handleChange}
                >
                  {Object.keys(usedMaterialsDisplayOptions).map(material => (
                    <MenuItem key={material} value={material}>{t(usedMaterialsDisplayOptions[material])}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {isAcademic && (
              <>
                <FormControl size="small">
                  <InputLabel>{t('common_text_data_field_of_research')}</InputLabel>
                  <Select
                    name="valdkond"
                    onChange={handleChange}
                    value={formData.valdkond}
                  >
                    {Object.keys(domainDisplayOptions).map(domain => (
                      <MenuItem key={domain} value={domain}>{t(domainDisplayOptions[domain])}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <InputLabel>{t('publish_your_text_text_data_supporting_material')}</InputLabel>
                  <SelectMultiple
                    name="akadOppematerjal"
                    optionList={usedMaterialsMultiOptions}
                    pluralSelectedTranslationKey="select_multiple_materials"
                    selectedValues={formData.akadOppematerjal}
                    setSelectedValues={setAkadOppematerjal}
                    type={SelectMultipleType.SIMPLE_HIERARCHICAL}
                    valueList={usedMaterialsMultiList}
                  />
                </FormControl>
              </>
            )}

            <FormControl size="small">
              <InputLabel>{t('query_text_data_year_of_publication')}</InputLabel>
              <Select
                name="ajavahemik"
                onChange={handleChange}
                value={formData.ajavahemik}
              >
                {addedYearOptions.map(option => (
                  <MenuItem key={option.key} value={option.range}>{option.key}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Stack>
      </Grid>

      <Grid item size={{ xs: 12, md: 4 }}>
        <Stack spacing={3}>
          <b>{t('common_author_data')}</b>

          <Grid container spacing={2}>
            <FormControl size="small">
              <InputLabel>{t('query_author_data_age')}</InputLabel>
              <Select
                name="vanusevahemik"
                onChange={handleChange}
                value={formData.vanusevahemik}
              >
                {Object.keys(ageOptions).map(age => (
                  <MenuItem key={age} value={age}>{t(ageOptions[age])}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>{t('query_author_data_gender')}</InputLabel>
              <Select
                name="sugu"
                onChange={handleChange}
                value={formData.sugu}
              >
                {Object.keys(genderOptions).map(gender => (
                  <MenuItem key={gender} value={gender}>{t(genderOptions[gender])}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {!isAcademic && (
              <FormControl size="small">
                <InputLabel>{t('query_author_data_education')}</InputLabel>
                <Select
                  name="haridus"
                  onChange={handleChange}
                  value={formData.haridus}
                >
                  {Object.keys(educationOptions).map(education => (
                    <MenuItem key={education} value={education}>{t(educationOptions[education])}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {isAcademic && (
              <>
                <FormControl size="small">
                  <InputLabel>{t('query_author_data_level_of_study')}</InputLabel>
                  <Select
                    name="oppeaste"
                    onChange={handleChange}
                    value={formData.oppeaste}
                  >
                    {Object.keys(studyLevelOptions).map(level => (
                      <MenuItem key={level} value={level}>{t(studyLevelOptions[level])}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <InputLabel>{t('query_author_data_degree')}</InputLabel>
                  <Select
                    name="teaduskraad"
                    onChange={handleChange}
                    value={formData.teaduskraad}
                  >
                    {Object.keys(degreeOptions).map(degree => (
                      <MenuItem key={degree} value={degree}>{t(degreeOptions[degree])}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {!isL2Exams && (
              <FormControl size="small">
                <InputLabel>{t('query_author_data_native_language')}</InputLabel>
                <Select
                  name="emakeel"
                  onChange={handleChange}
                  value={formData.emakeel}
                >
                  {Object.keys(languageOptionsForNativeLangs).map(language => (
                    <MenuItem key={language} value={language}>{t(languageOptionsForNativeLangs[language])}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {isAcademic && (
              <TextField
                size="small"
                label={t('query_author_data_other_languages')}
                name="muudkeeled"
                onChange={handleChange}
                value={formData.muudkeeled}
              />
            )}

            {isL2Exams && (
              <FormControl size="small">
                <InputLabel>{t('query_author_data_nationality')}</InputLabel>
                <Select
                  name="kodakondsus"
                  onChange={handleChange}
                  value={formData.kodakondsus}
                >
                  {Object.keys(nationalityOptions).map(nationality => (
                    <MenuItem key={nationality} value={nationality}>{t(nationalityOptions[nationality])}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl size="small">
              <InputLabel>{t('query_author_data_country')}</InputLabel>
              <Select
                name="riik"
                onChange={handleChange}
                value={formData.riik}
              >
                {Object.keys(countryOptionsForQueryResults).map(country => (
                  <MenuItem key={country} value={country}>{t(countryOptionsForQueryResults[country])}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Stack>
      </Grid>
    </Grid>
  );
}
