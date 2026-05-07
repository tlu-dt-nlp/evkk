import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  countryOptionsForAddingText,
  degreeOptions,
  domainSaveOptions,
  DonatedTextDetailsFormMode,
  educationOptions,
  genderOptions,
  studyLevelOptions,
  textPublishAcademicCategoryOptions,
  textPublishAcademicResearchSubtypeOptions,
  textPublishAcademicStudiesSubtypeOptions,
  textPublishMainTextTypesOptions,
  textPublishTextSubtypesOptions,
  textPublishUsedMaterialsOptions,
  usedMaterialsSaveOptions
} from '../../const/Constants';
import SelectMultiple, { SelectMultipleType } from '../SelectMultiple';
import TooltipButton from '../tooltip/TooltipButton';

export default function DonatedTextDetailsForm({
  mode,
  formData,
  onChange,
  onMultiValueChange,
  itemSize = { xs: 12, sm: 6, md: 3 }
}) {
  const { t } = useTranslation();

  const isSearchMode = mode === DonatedTextDetailsFormMode.SEARCH;
  const isAcademic = formData.liik === 'akadeemiline';
  const isNonAcademic = formData.liik === 'mitteakadeemiline';
  const isResearchArticle = isAcademic
    && formData.akadKategooria === 'ak_uurimused'
    && formData.akadAlamliik === 'ak_uurimus_artikkel';

  return (
    <>
      <Grid
        item
        size={itemSize}
      >
        <h5>{t('common_text_data')}</h5>
        <FormControl size="small">
          <InputLabel required={!isSearchMode}>
            {t('publish_your_text_text_data_main_text_type')}
          </InputLabel>
          <Select
            name="liik"
            value={formData.liik}
            required={!isSearchMode}
            onChange={onChange}
            onClick={isSearchMode && ((event) => onChange(event, 'liik'))}
          >
            {Object.keys(textPublishMainTextTypesOptions).map(type => (
              <MenuItem
                key={type}
                value={type}
              >
                {t(textPublishMainTextTypesOptions[type])}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {isAcademic && (
          <FormControl size="small">
            <InputLabel required={!isSearchMode}>
              {t('common_text_data_field_of_research')}
            </InputLabel>
            <Select
              name="autoriValdkond"
              value={formData.autoriValdkond}
              required={!isSearchMode}
              onChange={onChange}
              onClick={isSearchMode && ((event) => onChange(event, 'autoriValdkond'))}
            >
              {Object.keys(domainSaveOptions).map(domain => (
                <MenuItem
                  key={domain}
                  value={domain}
                >
                  {t(domainSaveOptions[domain])}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {isNonAcademic && (
          <FormControl size="small">
            <InputLabel>
              {t('publish_your_text_text_data_sub_text_type')}
            </InputLabel>
            <Select
              name="mitteakadAlamliik"
              value={formData.mitteakadAlamliik}
              onChange={onChange}
              onClick={isSearchMode && ((event) => onChange(event, 'mitteakadAlamliik'))}
            >
              {Object.keys(textPublishTextSubtypesOptions).map(type => (
                <MenuItem
                  key={type}
                  value={type.replace(/_child$/, '')}
                  disabled={type.endsWith('_disabled')}
                  sx={
                    type.endsWith('_child')
                      ? { paddingLeft: '2rem' }
                      : undefined
                  }
                >
                  {t(textPublishTextSubtypesOptions[type])}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {isAcademic && (
          <FormControl size="small">
            <InputLabel required={!isSearchMode}>
              {t('publish_your_text_text_data_academic_category')}
            </InputLabel>
            <Select
              name="akadKategooria"
              value={formData.akadKategooria}
              required={!isSearchMode}
              onChange={onChange}
              onClick={isSearchMode && ((event) => onChange(event, 'akadKategooria'))}
            >
              {Object.keys(textPublishAcademicCategoryOptions).map(category => (
                <MenuItem
                  key={category}
                  value={category}
                >
                  {t(textPublishAcademicCategoryOptions[category])}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {isAcademic && formData.akadKategooria !== '' && (
          <FormControl size="small">
            <InputLabel>
              {t('publish_your_text_text_data_sub_text_type')}
            </InputLabel>
            <Select
              name="akadAlamliik"
              value={formData.akadAlamliik}
              onChange={onChange}
              onClick={isSearchMode && ((event) => onChange(event, 'akadAlamliik'))}
            >
              {formData.akadKategooria === 'ak_erialaopingud' &&
                Object.keys(textPublishAcademicStudiesSubtypeOptions).map(type => (
                  <MenuItem
                    key={type}
                    value={type}
                  >
                    {t(textPublishAcademicStudiesSubtypeOptions[type])}
                  </MenuItem>
                ))}
              {formData.akadKategooria === 'ak_uurimused' &&
                Object.keys(textPublishAcademicResearchSubtypeOptions).map(type => (
                  <MenuItem
                    key={type}
                    value={type}
                  >
                    {t(textPublishAcademicResearchSubtypeOptions[type])}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}

        {isResearchArticle && (
          <>
            <TextField
              required={!isSearchMode}
              size="small"
              label={t('publish_your_text_text_data_publication')}
              name="artikkelValjaanne"
              value={formData.artikkelValjaanne}
              onChange={onChange}
            />
            <TextField
              required={!isSearchMode}
              size="small"
              type="number"
              label={t('publish_your_text_text_data_year')}
              name="artikkelAasta"
              value={formData.artikkelAasta}
              onChange={onChange}
            />
            <TextField
              size="small"
              label={t('publish_your_text_text_data_number')}
              name="artikkelNumber"
              value={formData.artikkelNumber}
              onChange={onChange}
            />
            <TextField
              size="small"
              label={t('publish_your_text_text_data_pages')}
              name="artikkelLehekyljed"
              value={formData.artikkelLehekyljed}
              onChange={onChange}
            />
          </>
        )}

        <FormControl size="small">
          <InputLabel>
            {t('query_text_data_used_study_or_supporting_materials')}
          </InputLabel>
          <Select
            name="oppematerjal"
            value={formData.oppematerjal}
            onChange={onChange}
            onClick={isSearchMode && ((event) => onChange(event, 'oppematerjal'))}
          >
            {Object.keys(usedMaterialsSaveOptions).map(material => (
              <MenuItem
                key={material}
                value={material}
              >
                {t(usedMaterialsSaveOptions[material])}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {formData.oppematerjal === 'true' && (
          <>
            <FormControl size="small">
              <InputLabel>
                {t('publish_your_text_text_data_supporting_material')}
              </InputLabel>
              <SelectMultiple
                name="akadOppematerjal"
                selectedValues={formData.akadOppematerjal}
                setSelectedValues={v => onMultiValueChange('akadOppematerjal', v)}
                type={SelectMultipleType.FLAT_KEYS}
                optionList={textPublishUsedMaterialsOptions}
                pluralSelectedTranslationKey="select_multiple_materials"
              />
            </FormControl>

            {formData.akadOppematerjal.includes('muu') && (
              <TextField
                label={t('publish_your_text_text_data_supporting_material_other')}
                size="small"
                name="akadOppematerjalMuu"
                value={formData.akadOppematerjalMuu}
                onChange={onChange}
              />
            )}
          </>
        )}
      </Grid>

      <Grid
        item
        size={itemSize}
      >
        <h5>{t('common_author_data')}</h5>
        <TextField
          size="small"
          type="number"
          label={t('query_author_data_age')}
          name="autoriVanus"
          value={formData.autoriVanus}
          onChange={onChange}
        />
        <FormControl size="small">
          <InputLabel>
            {t('query_author_data_gender')}
          </InputLabel>
          <Select
            name="autoriSugu"
            value={formData.autoriSugu}
            onChange={onChange}
            onClick={isSearchMode && ((event) => onChange(event, 'autoriSugu'))}
          >
            {Object.keys(genderOptions).map(gender => (
              <MenuItem
                key={gender}
                value={gender}
              >
                {t(genderOptions[gender])}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          required={!isSearchMode}
          label={<>
            {t('query_author_data_native_language')}
            <TooltipButton>
              {t('publish_your_text_author_data_other_languages_tooltip')}
            </TooltipButton>
          </>}
          name="autoriEmakeel"
          value={formData.autoriEmakeel}
          onChange={onChange}
        />
        <TextField
          size="small"
          label={<>
            {t('query_author_data_other_languages_plural')}
            <TooltipButton>
              {t('publish_your_text_author_data_other_languages_tooltip')}
            </TooltipButton>
          </>}
          name="autoriMuudKeeled"
          value={formData.autoriMuudKeeled}
          onChange={onChange}
        />
        <FormControl size="small">
          <InputLabel>
            {t('query_author_data_country')}
          </InputLabel>
          <Select
            value={formData.autoriElukohariik}
            onChange={onChange}
            onClick={isSearchMode && ((event) => onChange(event, 'autoriElukohariik'))}
            name="autoriElukohariik"
          >
            {Object.keys(countryOptionsForAddingText).map(country => (
              <MenuItem
                key={country}
                value={country}
              >
                {t(countryOptionsForAddingText[country])}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {isAcademic && (
          <FormControl size="small">
            <InputLabel>
              {t('query_author_data_level_of_study')}
            </InputLabel>
            <Select
              name="autoriOppeaste"
              value={formData.autoriOppeaste}
              onChange={onChange}
              onClick={isSearchMode && ((event) => onChange(event, 'autoriOppeaste'))}
            >
              {Object.keys(studyLevelOptions).map(level => (
                <MenuItem
                  key={level}
                  value={level}
                >
                  {t(studyLevelOptions[level])}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {isAcademic && (
          <FormControl size="small">
            <InputLabel>
              {t('query_author_data_degree')}
            </InputLabel>
            <Select
              name="autoriTeaduskraad"
              value={formData.autoriTeaduskraad}
              onChange={onChange}
              onClick={isSearchMode && ((event) => onChange(event, 'autoriTeaduskraad'))}
            >
              {Object.keys(degreeOptions).map(degree => (
                <MenuItem
                  key={degree}
                  value={degree}
                >
                  {t(degreeOptions[degree])}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {isNonAcademic && (
          <FormControl size="small">
            <InputLabel>
              {t('query_author_data_education')}
            </InputLabel>
            <Select
              name="autoriHaridus"
              value={formData.autoriHaridus}
              onChange={onChange}
              onClick={isSearchMode && ((event) => onChange(event, 'autoriHaridus'))}
            >
              {Object.keys(educationOptions).map(education => (
                <MenuItem
                  key={education}
                  value={education}
                >
                  {t(educationOptions[education])}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Grid>
    </>
  );
}
