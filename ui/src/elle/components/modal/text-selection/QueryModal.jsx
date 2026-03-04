import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import {
  addedYearOptions,
  ageOptions,
  charactersOptions,
  countryOptionsForQuery,
  degreeOptions,
  domainDisplayOptions,
  educationOptions,
  genderOptions,
  languageOptionsForNativeLangs,
  languageOptionsForOtherLangs,
  nationalityOptions,
  scoreOptions,
  sentencesOptions,
  studyLevelOptions,
  textLanguageOptions,
  textLevelOptions,
  textTypeList,
  textTypesOptions,
  usedMaterialsDisplayOptions,
  usedMaterialsMultiList,
  usedMaterialsMultiOptions,
  wordsOptions
} from '../../../const/Constants';
import QueryResultsModal from './QueryResultsModal';
import { useTranslation } from 'react-i18next';
import { DefaultButtonStyle } from '../../../const/StyleConstants';
import { useGetQueryResults } from '../../../hooks/service/TextService';
import TooltipOnText from '../../tooltip/TooltipOnText';
import ModalBase from '../ModalBase';
import SelectMultiple, { SelectMultipleType } from '../../SelectMultiple';

export default function QueryModal({ isQueryOpen, setIsQueryOpen }) {

  const { t } = useTranslation();
  const mainModalRef = useRef();
  const [results, setResults] = useState([]);
  const [scores, setScores] = useState([]);
  const [addedYears, setAddedYears] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [words, setWords] = useState([]);
  const [sentences, setSentences] = useState([]);
  const [textTypes, setTextTypes] = useState([]);
  const [usedMultiMaterials, setUsedMultiMaterials] = useState([]);
  const [alert, setAlert] = useState(false);
  const [noResultsError, setNoResultsError] = useState(false);
  const [corpusCheckboxStatus, setCorpusCheckboxStatus] = useState({
    all: false,
    cFqPphvYi: false,
    clWmOIrLa: false,
    cFOoRQekA: false,
    cYDRkpymb: false,
    cgSRJPKTr: false,
    cZjHWUPtD: false,
    cwUSEqQLt: false
  });
  const [isQueryResponsePage, setIsQueryResponsePage] = useState(false);
  const [previousSelectedIds, setPreviousSelectedIds] = useState({});
  const { getQueryResults } = useGetQueryResults();
  const [singlePropertyData, setSinglePropertyData] = useState({
    language: 'eesti',
    level: '',
    domain: '',
    usedMaterials: '',
    age: '',
    gender: '',
    education: '',
    studyLevel: '',
    degree: '',
    nativeLang: '',
    otherLang: '',
    nationality: '',
    country: ''
  });

  // reset corpus-based filters
  useEffect(() => {
    let newSinglePropertyData = { ...singlePropertyData };

    if (isOnlySpecificCorpusChecked('clWmOIrLa')) {
      newSinglePropertyData.nativeLang = '';
    } else {
      newSinglePropertyData.nationality = '';
    }

    if (isOnlySpecificCorpusChecked('cwUSEqQLt')) {
      newSinglePropertyData.level = '';
      newSinglePropertyData.education = '';
      newSinglePropertyData.usedMaterials = '';
    } else {
      newSinglePropertyData.studyLevel = '';
      newSinglePropertyData.degree = '';
      newSinglePropertyData.otherLang = '';
      newSinglePropertyData.domain = '';
      setUsedMultiMaterials([]);
    }

    if (isOnlySpecificCorpusChecked('cYDRkpymb')) {
      newSinglePropertyData.level = '';
    } else {
      setScores([]);
    }

    setSinglePropertyData(newSinglePropertyData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corpusCheckboxStatus]);

  const submitted = () => {
    const selectedCorpuses = getSelectedCorpusList();

    if (selectedCorpuses.length === 0) {
      setAlert(true);
      mainModalRef.current?.scrollTo({ top: 9999 });
    } else {
      setAlert(false);
      let params = {};

      params.corpuses = selectedCorpuses;

      Object.entries(singlePropertyData).forEach(entry => {
        const [key, value] = entry;
        if (value !== '') {
          params[key] = value;
        }
      });

      if (textTypes.length > 0) {
        params.types = textTypes;
      }

      if (scores.length > 0) {
        params.scores = convertToRanges(scores, scoreOptions);
      }

      if (usedMultiMaterials.length > 0) {
        params.usedMultiMaterials = usedMultiMaterials;
      }

      if (addedYears.length > 0) {
        params.addedYears = convertToRanges(addedYears, addedYearOptions);
      }

      if (characters.length > 0) {
        params.characters = convertToRanges(characters, charactersOptions);
      }

      if (words.length > 0) {
        params.words = convertToRanges(words, wordsOptions);
      }

      if (sentences.length > 0) {
        params.sentences = convertToRanges(sentences, sentencesOptions);
      }

      getQueryResults(JSON.stringify(params))
        .then(response => {
          if (!response) return;
          if (response.length > 0) {
            setNoResultsError(false);
            setResults(response);
            setIsQueryResponsePage(true);
            setTimeout(() => mainModalRef.current?.scrollTo({ top: 0 }), 100);
          } else {
            setNoResultsError(true);
            setResults([]);
            setTimeout(() => mainModalRef.current?.scrollTo({ top: 9999 }), 100);
          }
        });
    }
  };

  const getSelectedCorpusList = () => {
    const selectedCorpuses = [];
    Object.entries(corpusCheckboxStatus).forEach((entry) => {
      const [key, value] = entry;
      if (value && key !== 'all') {
        selectedCorpuses.push(key);
      }
    });
    return selectedCorpuses;
  };

  const isOnlySpecificCorpusChecked = (corpus) => {
    const selectedCorpuses = getSelectedCorpusList();
    return selectedCorpuses.length === 1 && selectedCorpuses[0] === corpus;
  };

  const convertToRanges = (selectedKeys, optionsArray) => (
    selectedKeys
      .map(key => {
        const option = optionsArray.find(option => option.key === key);
        return option ? option.range : null;
      })
      .filter(range => range !== null)
  );

  const findNestedKeys = (object, key) =>
    key in object
      ? [[key]]
      : Object.entries(object).flatMap(([k, v]) => {
        if (!v || typeof v !== 'object') return [];
        const nestedKeys = findNestedKeys(v, key);
        return nestedKeys.length
          ? nestedKeys.map(a => [k, ...a])
          : [];
      });

  const alterCorpusCheckbox = event => {
    let newCorpusCheckboxStatus = { ...corpusCheckboxStatus };
    let trueCount = 0;
    newCorpusCheckboxStatus[event.target.id] = event.target.checked;
    Object.entries(newCorpusCheckboxStatus).forEach((entry) => {
      const [key, value] = entry;
      if (value && key !== 'all') {
        trueCount++;
      }
    });
    newCorpusCheckboxStatus.all = trueCount === 7;
    setCorpusCheckboxStatus(newCorpusCheckboxStatus);

    // reset selected text types
    if (!event.target.checked) {
      setTextTypes(textTypes.filter((type) => findNestedKeys(textTypesOptions[event.target.id], type).length === 0));
    }
  };

  const alterAllCorpusCheckboxes = event => {
    let newCorpusCheckboxStatus = { ...corpusCheckboxStatus };
    for (const checkbox in newCorpusCheckboxStatus) {
      newCorpusCheckboxStatus[checkbox] = event.target.checked;
    }
    setCorpusCheckboxStatus(newCorpusCheckboxStatus);

    // reset selected text types
    if (!event.target.checked) {
      setTextTypes([]);
    }
  };

  const alterSinglePropertyData = (event, fieldName) => {
    const newSinglePropertyData = { ...singlePropertyData };
    newSinglePropertyData[fieldName] = (newSinglePropertyData[fieldName] === event.target.dataset.value || event.target.dataset.value === undefined)
      ? ''
      : event.target.dataset.value;
    setSinglePropertyData(newSinglePropertyData);
  };

  const renderTextLevelFields = () => {
    if (isOnlySpecificCorpusChecked('cYDRkpymb')) {
      return (
        <>
          <InputLabel>
            {t('query_text_data_score')}
          </InputLabel>
          <SelectMultiple
            name="score"
            selectedValues={scores}
            setSelectedValues={setScores}
            type={SelectMultipleType.FLAT_KEYS}
            optionList={scoreOptions}
            pluralSelectedTranslationKey="select_multiple_ranges"
          />
        </>
      );
    }

    return (
      <>
        <InputLabel>
          {t('query_text_data_level')}
        </InputLabel>
        <Select
          name="level"
          value={singlePropertyData.level}
          onClick={e => alterSinglePropertyData(e, 'level')}
        >
          {textLevelOptions.map(level => (
            <MenuItem
              key={level}
              value={level}
            >
              {level}
            </MenuItem>
          ))}
        </Select>
      </>
    );
  };

  return (
    <ModalBase
      isOpen={isQueryOpen}
      setIsOpen={setIsQueryOpen}
      title="query_choose_texts"
      modalRef={mainModalRef}
    >
      {isQueryResponsePage ? (
        <QueryResultsModal
          results={results}
          setIsQueryResponsePage={setIsQueryResponsePage}
          setPreviousSelectedIds={setPreviousSelectedIds}
          previousSelectedIds={previousSelectedIds}
          setIsQueryOpen={setIsQueryOpen}
        />
      ) : (
        <form
          id="vorm"
          action=""
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <Grid
            container
            spacing={3}
            sx={{
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <Grid
              item
              size={{ xs: 12, sm: 6, md: 4 }}
            >
              <b>{t('query_subcorpus')}</b>
              <br /><br />
              <Checkbox
                checked={corpusCheckboxStatus.all}
                onChange={alterAllCorpusCheckboxes}
              />
              <label>{t('query_subcorpus_all')}</label>
              <br />
              <Checkbox
                id="clWmOIrLa"
                checked={corpusCheckboxStatus.clWmOIrLa}
                onChange={alterCorpusCheckbox}
              />
              <TooltipOnText
                title={t('query_subcorpus_L2_proficiency_examinations_hover')}
              >
                {t('query_subcorpus_L2_proficiency_examinations')}
              </TooltipOnText>
              <br />
              <Checkbox
                id="cFqPphvYi"
                checked={corpusCheckboxStatus.cFqPphvYi}
                onChange={alterCorpusCheckbox}
              />
              <TooltipOnText
                title={t('query_subcoprus_L2_olympiade_hover')}
              >
                {t('query_subcoprus_L2_olympiade')}
              </TooltipOnText>
              <br />
              <Checkbox
                id="cFOoRQekA"
                checked={corpusCheckboxStatus.cFOoRQekA}
                onChange={alterCorpusCheckbox}
              />
              <TooltipOnText
                title={t('query_subcorpus_L2_estonian_hover')}
              >
                {t('query_subcorpus_L2_estonian')}
              </TooltipOnText>
              <br />
              <Checkbox
                id="cYDRkpymb"
                checked={corpusCheckboxStatus.cYDRkpymb}
                onChange={alterCorpusCheckbox}
              />
              <TooltipOnText
                title={t('query_subcorpus_L1_estonian_hover')}
              >
                {t('query_subcorpus_L1_estonian')}
              </TooltipOnText>
              <br />
              <Checkbox
                id="cgSRJPKTr"
                checked={corpusCheckboxStatus.cgSRJPKTr}
                onChange={alterCorpusCheckbox}
              />
              <TooltipOnText
                title={t('query_subcorpus_L1_russian_hover')}
              >
                {t('query_subcorpus_L1_russian')}
              </TooltipOnText>
              <br />
              <Checkbox
                id="cZjHWUPtD"
                checked={corpusCheckboxStatus.cZjHWUPtD}
                onChange={alterCorpusCheckbox}
              />
              <TooltipOnText
                title={t('query_subcorpus_L3_russian_hover')}
              >
                {t('query_subcorpus_L3_russian')}
              </TooltipOnText>
              <br />
              <Checkbox
                id="cwUSEqQLt"
                checked={corpusCheckboxStatus.cwUSEqQLt}
                onChange={alterCorpusCheckbox}
              />
              <TooltipOnText
                title={t('query_subcorpus_academic_estonian_hover')}
              >
                {t('query_subcorpus_academic_estonian')}
              </TooltipOnText>
              <br />
            </Grid>
            <Grid
              item
              size={{ xs: 12, sm: 6, md: 4 }}
            >
              <b>{t('common_text_data')}</b>
              <br /><br />
              <FormControl size="small">
                <InputLabel>
                  {t('query_text_data_type')}
                </InputLabel>
                <SelectMultiple
                  name="types"
                  selectedValues={textTypes}
                  setSelectedValues={setTextTypes}
                  type={SelectMultipleType.GROUPED_HIERARCHICAL}
                  optionList={textTypesOptions}
                  valueList={textTypeList}
                  disabled={getSelectedCorpusList().length === 0}
                  pluralSelectedTranslationKey="select_multiple_types"
                  preconditionStatuses={corpusCheckboxStatus}
                />
              </FormControl>
              <FormControl size="small">
                <InputLabel>
                  {t('query_text_data_language')}
                </InputLabel>
                <Select
                  name="language"
                  value={singlePropertyData.language}
                  onClick={e => alterSinglePropertyData(e, 'language')}
                >
                  {Object.keys(textLanguageOptions).map(lang => (
                    <MenuItem
                      key={lang}
                      value={lang}
                    >
                      {t(textLanguageOptions[lang])}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {isOnlySpecificCorpusChecked('cwUSEqQLt')
                ? (
                  <>
                    <FormControl size="small">
                      <InputLabel>
                        {t('common_text_data_field_of_research')}
                      </InputLabel>
                      <Select
                        name="domain"
                        value={singlePropertyData.domain}
                        onClick={e => alterSinglePropertyData(e, 'domain')}
                      >
                        {Object.keys(domainDisplayOptions).map(domain => (
                          <MenuItem
                            key={domain}
                            value={domain}
                          >
                            {t(domainDisplayOptions[domain])}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl size="small">
                      <InputLabel>
                        {t('query_text_data_used_study_or_supporting_materials')}
                      </InputLabel>
                      <SelectMultiple
                        name="usedMultiMaterials"
                        selectedValues={usedMultiMaterials}
                        setSelectedValues={setUsedMultiMaterials}
                        type={SelectMultipleType.SIMPLE_HIERARCHICAL}
                        optionList={usedMaterialsMultiOptions}
                        valueList={usedMaterialsMultiList}
                        pluralSelectedTranslationKey="select_multiple_materials"
                      />
                    </FormControl>
                  </>
                ) : (
                  <>
                    <FormControl size="small">
                      {renderTextLevelFields()}
                    </FormControl>
                    <FormControl size="small">
                      <InputLabel>
                        {t('query_text_data_used_supporting_materials')}
                      </InputLabel>
                      <Select
                        name="usedMaterials"
                        value={singlePropertyData.usedMaterials}
                        onClick={e => alterSinglePropertyData(e, 'usedMaterials')}
                      >
                        {Object.keys(usedMaterialsDisplayOptions).map(material => (
                          <MenuItem
                            key={material}
                            value={material}
                          >
                            {t(usedMaterialsDisplayOptions[material])}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </>
                )}
              <FormControl size="small">
                <InputLabel>
                  {t('query_text_data_year_of_publication')}
                </InputLabel>
                <SelectMultiple
                  name="addedYears"
                  selectedValues={addedYears}
                  setSelectedValues={setAddedYears}
                  type={SelectMultipleType.FLAT_KEYS}
                  optionList={addedYearOptions}
                  pluralSelectedTranslationKey="select_multiple_ranges"
                />
              </FormControl>
              <FormControl size="small">
                <InputLabel>
                  {t('query_text_data_characters')}
                </InputLabel>
                <SelectMultiple
                  name="characters"
                  selectedValues={characters}
                  setSelectedValues={setCharacters}
                  type={SelectMultipleType.FLAT_KEYS}
                  optionList={charactersOptions}
                  pluralSelectedTranslationKey="select_multiple_ranges"
                />
              </FormControl>
              <FormControl size="small">
                <InputLabel>
                  {t('common_words')}
                </InputLabel>
                <SelectMultiple
                  name="words"
                  selectedValues={words}
                  setSelectedValues={setWords}
                  type={SelectMultipleType.FLAT_KEYS}
                  optionList={wordsOptions}
                  pluralSelectedTranslationKey="select_multiple_ranges"
                />
              </FormControl>
              <FormControl size="small">
                <InputLabel>
                  {t('common_sentences')}
                </InputLabel>
                <SelectMultiple
                  name="sentences"
                  selectedValues={sentences}
                  setSelectedValues={setSentences}
                  type={SelectMultipleType.FLAT_KEYS}
                  optionList={sentencesOptions}
                  pluralSelectedTranslationKey="select_multiple_ranges"
                />
              </FormControl>
            </Grid>
            <Grid
              item
              size={{ xs: 12, sm: 12, md: 4 }}
            >
              <b>{t('common_author_data')}</b>
              <br /><br />
              <FormControl size="small">
                <InputLabel>
                  {t('query_author_data_age')}
                </InputLabel>
                <Select
                  name="age"
                  value={singlePropertyData.age}
                  onClick={e => alterSinglePropertyData(e, 'age')}
                >
                  {Object.keys(ageOptions).map(age => (
                    <MenuItem
                      key={age}
                      value={age}
                    >
                      {t(ageOptions[age])}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>
                  {t('query_author_data_gender')}
                </InputLabel>
                <Select
                  name="gender"
                  value={singlePropertyData.gender}
                  onClick={e => alterSinglePropertyData(e, 'gender')}
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
              {isOnlySpecificCorpusChecked('cwUSEqQLt')
                ? (
                  <>
                    <FormControl size="small">
                      <InputLabel>
                        {t('query_author_data_level_of_study')}
                      </InputLabel>
                      <Select
                        name="studyLevel"
                        value={singlePropertyData.studyLevel}
                        onClick={e => alterSinglePropertyData(e, 'studyLevel')}
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
                    <FormControl size="small">
                      <InputLabel>
                        {t('query_author_data_degree')}
                      </InputLabel>
                      <Select
                        name="degree"
                        value={singlePropertyData.degree}
                        onClick={e => alterSinglePropertyData(e, 'degree')}
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
                  </>
                ) : (
                  <FormControl size="small">
                    <InputLabel>
                      {t('query_author_data_education')}
                    </InputLabel>
                    <Select
                      name="education"
                      value={singlePropertyData.education}
                      onClick={e => alterSinglePropertyData(e, 'education')}
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
              {isOnlySpecificCorpusChecked('clWmOIrLa')
                ? (
                  <FormControl size="small">
                    <InputLabel>
                      {t('query_author_data_nationality')}
                    </InputLabel>
                    <Select
                      name="nationality"
                      value={singlePropertyData.nationality}
                      onClick={e => alterSinglePropertyData(e, 'nationality')}
                    >
                      {Object.keys(nationalityOptions).map(nationality => (
                        <MenuItem
                          key={nationality}
                          value={nationality}
                        >
                          {t(nationalityOptions[nationality])}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl size="small">
                    <InputLabel>
                      {t('query_author_data_native_language')}
                    </InputLabel>
                    <Select
                      name="nativeLang"
                      value={singlePropertyData.nativeLang}
                      onClick={e => alterSinglePropertyData(e, 'nativeLang')}
                    >
                      {Object.keys(languageOptionsForNativeLangs).map(lang => (
                        <MenuItem
                          key={lang}
                          value={lang}
                        >
                          {t(languageOptionsForNativeLangs[lang])}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              {isOnlySpecificCorpusChecked('cwUSEqQLt')
                ? (
                  <FormControl size="small">
                    <InputLabel>
                      {t('query_author_data_other_languages')}
                    </InputLabel>
                    <Select
                      name="otherLang"
                      value={singlePropertyData.otherLang}
                      onClick={e => alterSinglePropertyData(e, 'otherLang')}
                    >
                      {Object.keys(languageOptionsForOtherLangs).map(lang => (
                        <MenuItem
                          key={lang}
                          value={lang}
                        >
                          {t(languageOptionsForOtherLangs[lang])}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : <></>
              }
              <FormControl size="small">
                <InputLabel>
                  {t('query_author_data_country')}
                </InputLabel>
                <Select
                  name="country"
                  value={singlePropertyData.country}
                  onClick={e => alterSinglePropertyData(e, 'country')}
                >
                  {Object.keys(countryOptionsForQuery).map(country => (
                    <MenuItem
                      key={country}
                      value={country}
                    >
                      {t(countryOptionsForQuery[country])}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <br />
          {alert || noResultsError ?
            <>
              <Alert severity="error">
                {alert ? t('error_query_no_subcorpus_picked') : t('query_results_no_texts_found')}
              </Alert>
              <br />
            </> : ''
          }
          <Button
            onClick={submitted}
            sx={DefaultButtonStyle}
            variant="contained"
          >
            {t('send_request_button')}
          </Button>
        </form>
      )}
    </ModalBase>
  );
}
