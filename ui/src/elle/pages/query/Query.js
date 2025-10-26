import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select
} from '@mui/material';
import './styles/Query.css';
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
} from '../../const/Constants';
import QueryResults from './QueryResults';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TextUpload from '../../components/TextUpload';
import { changeCorpusTexts, changeOwnTexts, queryStore } from '../../store/QueryStore';
import { useTranslation } from 'react-i18next';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { DefaultButtonStyle, ElleDefaultChip, MenuProps, useStyles } from '../../const/StyleConstants';
import { useGetQueryResults } from '../../hooks/service/TextService';
import TooltipOnText from '../../components/tooltip/TooltipOnText';

export default function Query(props) {

  const { t } = useTranslation();
  const selectWidth = 300;
  const classes = useStyles();
  const navigate = useNavigate();
  const inputButtonRef = useRef();
  const filterButtonRef = useRef();
  const [urlParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [addedYears, setAddedYears] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [words, setWords] = useState([]);
  const [sentences, setSentences] = useState([]);
  const [textTypes, setTextTypes] = useState([]);
  const [usedMultiMaterials, setUsedMultiMaterials] = useState([]);
  const [alert, setAlert] = useState(false);
  const [noResultsError, setNoResultsError] = useState(false);
  const [resultsKey, setResultsKey] = useState(1);
  const [textInputValue, setTextInputValue] = useState('');
  const [corpusTextsSelected, setCorpusTextsSelected] = useState(0);
  const [ownTextsSelected, setOwnTextsSelected] = useState(false);
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
  const [inputButtonOpen, setInputButtonOpen] = useState('button-query-hover button-box-open');
  const [filterButtonOpen, setFilterButtonOpen] = useState('button-query-hover button-box-open');
  const [filterQueryOpen, setFilterQueryOpen] = useState('menu-box-choose-text-closed');
  const [inputQueryOpen, setInputQueryOpen] = useState('query-own-texts-modal-closed');
  const [isQueryAnswerPage, setIsQueryAnswerPage] = useState(false);
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

    if (checkIfOnlySpecificCorpusIsChecked('clWmOIrLa')) {
      newSinglePropertyData.nativeLang = '';
    } else {
      newSinglePropertyData.nationality = '';
    }

    if (checkIfOnlySpecificCorpusIsChecked('cwUSEqQLt')) {
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

    setSinglePropertyData(newSinglePropertyData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corpusCheckboxStatus]);

  useEffect(() => {
    refreshChips();
    setTextInputValue(queryStore.getState().ownTexts);
  }, []);

  useEffect(() => {
    if (inputQueryOpen === 'query-own-texts-modal' || filterQueryOpen === 'menu-box-choose-text') {
      props.setHideBackground(true);
    } else {
      props.setHideBackground(false);
    }
  }, [filterQueryOpen, inputQueryOpen, props]);

  useEffect(() => {
    if (urlParams.get('openQuery')) {
      navigate('', { replace: true });
    }
  }, [urlParams, navigate]);

  queryStore.subscribe(() => {
    refreshChips();
  });

  const refreshChips = () => {
    const storeState = queryStore.getState();
    setCorpusTextsSelected(storeState.corpusTextIds !== null
      ? storeState.corpusTextIds.length
      : 0
    );
    setOwnTextsSelected(storeState.ownTexts !== null);
  };

  const submitted = () => {
    setResultsKey(Math.random());
    const selectedCorpuses = getSelectedCorpusList();

    if (selectedCorpuses.length === 0) {
      setAlert(true);
    } else {
      setAlert(false);
      let params = {};

      params.corpuses = selectedCorpuses;

      Object.entries(singlePropertyData).forEach((entry) => {
        const [key, value] = entry;
        if (value !== '') {
          params[key] = value;
        }
      });

      if (textTypes.length > 0) {
        params.types = textTypes;
      }

      if (usedMultiMaterials.length > 0) {
        params.usedMultiMaterials = usedMultiMaterials;
      }

      if (addedYears.length > 0) {
        params.addedYears = replaceDashes(addedYears);
      }

      if (characters.length > 0) {
        params.characters = simplifyDropdowns(characters);
      }

      if (words.length > 0) {
        params.words = simplifyDropdowns(words);
      }

      if (sentences.length > 0) {
        params.sentences = simplifyDropdowns(sentences);
      }

      getQueryResults(JSON.stringify(params))
        .then(response => {
          if (response.length > 0) {
            setNoResultsError(false);
            setResults(response);
            setIsQueryAnswerPage(true);
          } else {
            setNoResultsError(true);
            setResults([]);
          }
        });
    }
  };

  function getSelectedCorpusList() {
    let selectedCorpuses = [];
    Object.entries(corpusCheckboxStatus).forEach((entry) => {
      const [key, value] = entry;
      if (value && key !== 'all') {
        selectedCorpuses.push(key);
      }
    });
    return selectedCorpuses;
  }

  function checkIfOnlySpecificCorpusIsChecked(corpus) {
    const selectedCorpuses = getSelectedCorpusList();
    return selectedCorpuses.length === 1 && selectedCorpuses[0] === corpus;
  }

  function replaceDashes(data) {
    return data.map(function (item) {
      let parsed;
      if (item.includes('...')) {
        const splitValue = item.split('...')[0];
        parsed = splitValue + '-' + (parseInt(splitValue) + 4);
      } else {
        parsed = item.replace('–', '-');
      }
      return parsed;
    });
  }

  function simplifyDropdowns(data) {
    let results = [];
    data.forEach((e) => {
      const entry = t(e);
      let parsed;
      if (entry.includes(t('query_text_data_up_to'))) {
        parsed = [1, parseInt(entry.split(`${t('query_text_data_up_to')} `)[1])];
      } else if (entry.includes(t('query_text_data_over'))) {
        parsed = [parseInt(entry.split(`${t('query_text_data_over')} `)[1]) + 1, 2147483647]; // java int max value
      } else {
        parsed = [parseInt(entry.split('–')[0]), parseInt(entry.split('–')[1])];
      }
      results.push(parsed);
    });
    return results;
  }

  const findNestedKeys = (object, key) => key in object
    ? [[key]]
    : Object.entries(object).flatMap(([k, v]) => {
      if (!v || typeof v !== 'object') return [];
      const nestedKeys = findNestedKeys(v, key);
      return nestedKeys.length
        ? nestedKeys.map(a => [k, ...a])
        : [];
    });

  const alterCorpusCheckbox = (event) => {
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

  const alterAllCorpusCheckboxes = (event) => {
    let newCorpusCheckboxStatus = { ...corpusCheckboxStatus };
    for (let checkbox in newCorpusCheckboxStatus) {
      newCorpusCheckboxStatus[checkbox] = event.target.checked;
    }
    setCorpusCheckboxStatus(newCorpusCheckboxStatus);

    // reset selected text types
    if (!event.target.checked) {
      setTextTypes([]);
    }
  };

  const alterSinglePropertyData = (event, fieldName) => {
    let newSinglePropertyData = { ...singlePropertyData };
    newSinglePropertyData[fieldName] = (newSinglePropertyData[fieldName] === event.target.dataset.value || event.target.dataset.value === undefined)
      ? ''
      : event.target.dataset.value;
    setSinglePropertyData(newSinglePropertyData);
  };

  const alterTextTypeHierarchyDropdown = (e, hierarchyLevel, corpus) => {
    // hierarchyLevel: true - standalone or hierarchy child, false - hierarchy parent
    let id = e.target.localName === 'span'
      ? e.target.offsetParent.children[1].id
      : e.target.id;
    if (hierarchyLevel) {
      if (textTypes.includes(id)) {
        setTextTypes(textTypes.filter(type => type !== id));
      } else {
        setTextTypes([...textTypes, id]);
      }
    } else {
      let childrenArray = Array.from(Object.keys(textTypesOptions[corpus][id]));
      let filteredTextTypes = textTypes.filter(type => !childrenArray.includes(type));
      if (childrenArray.every(child => textTypes.includes(child))) {
        setTextTypes(filteredTextTypes);
      } else {
        setTextTypes([...filteredTextTypes, ...childrenArray]);
      }
    }
  };

  const alterUsedMaterialsHierarchyDropdown = (e, hierarchyLevel) => {
    // hierarchyLevel: true - standalone or hierarchy child, false - hierarchy parent
    let id = e.target.localName === 'span'
      ? e.target.offsetParent.children[1].id
      : e.target.id;
    if (hierarchyLevel) {
      if (usedMultiMaterials.includes(id)) {
        setUsedMultiMaterials(usedMultiMaterials.filter(material => material !== id));
      } else {
        setUsedMultiMaterials([...usedMultiMaterials, id]);
      }
    } else {
      let childrenArray = Array.from(Object.keys(usedMaterialsMultiOptions[id]));
      let filteredUsedMaterials = usedMultiMaterials.filter(material => !childrenArray.includes(material));
      if (childrenArray.every(child => usedMultiMaterials.includes(child))) {
        setUsedMultiMaterials(filteredUsedMaterials);
      } else {
        setUsedMultiMaterials([...filteredUsedMaterials, ...childrenArray]);
      }
    }
  };

  const getTextTypeRenderValue = (textType) => {
    return textType.length > 1
      ? t('query_text_data_type_selected_plural', { amount: textType.length })
      : t(textTypeList[textType[0]]);
  };

  const getUsedMultiMaterialsRenderValue = (material) => {
    return material.length > 1
      ? t('query_text_data_material_selected_plural', { amount: material.length })
      : t(usedMaterialsMultiList[material[0]]);
  };

  const checkTextTypeHierarchyCheckboxStatus = (name, corpus) => {
    let checked = true;
    Object.keys(textTypesOptions[corpus][name]).forEach(type => {
      if (!textTypes.includes(type)) {
        checked = false;
      }
    });
    return checked;
  };

  const checkUsedMaterialsHierarchyCheckboxStatus = (name) => {
    let checked = true;
    Object.keys(usedMaterialsMultiOptions[name]).forEach(material => {
      if (!usedMultiMaterials.includes(material)) {
        checked = false;
      }
    });
    return checked;
  };

  const sendTextFromFile = (data) => setTextInputValue(data);

  const handleSubmitOwnTexts = () => queryStore.dispatch(changeOwnTexts(textInputValue));

  const handleChipDelete = (type) => queryStore.dispatch(type === ChipDeleteType.CORPUS_TEXTS ? changeCorpusTexts(null) : changeOwnTexts(null));

  useEffect(() => {
    if (props.queryOpen === 'queryOpen') {
      setFilterQueryOpen('menu-box-choose-text');
    }
  }, [props.queryOpen]);

  const setFilterBoxClass = () => {
    if (filterQueryOpen === 'menu-box-choose-text-closed') {
      setFilterQueryOpen('menu-box-choose-text');
      setFilterButtonOpen('button-query-hover button-box-open');
      setInputQueryOpen('query-own-texts-modal-closed');
    } else {
      filterButtonRef.current.blur();
      setFilterQueryOpen('menu-box-choose-text-closed');
      setFilterButtonOpen('button-query-hover');
      if (inputQueryOpen !== 'query-own-texts-modal') {
        setInputButtonOpen('button-query-hover');
      }
    }
  };

  const setInputBoxClass = () => {
    if (inputQueryOpen === 'query-own-texts-modal-closed') {
      setInputQueryOpen('query-own-texts-modal');
      setInputButtonOpen('button-query-hover button-box-open');
      setFilterQueryOpen('menu-box-choose-text-closed');
    } else {
      inputButtonRef.current.blur();
      setInputQueryOpen('query-own-texts-modal-closed');
      setInputButtonOpen('button-query-hover');
      if (filterQueryOpen !== 'menu-box-choose-text') {
        setFilterButtonOpen('button-query-hover');
      }
    }
  };

  return (
    <div className="query-main-container">
      <div className="button-box">
        <Button variant="contained"
                ref={filterButtonRef}
                id="choose-text-button"
                className={filterButtonOpen}
                onClick={() => {
                  setFilterBoxClass();
                  setAlert(false);
                  setNoResultsError(false);
                }}>
          <div className="button-text-query">
            <ManageSearchIcon className="manage-search-icon" />
            <span className="manage-search-icon-text">
              {t('query_choose_texts')}
            </span>
          </div>
        </Button>
        <Box
          id="menu-box-choose-text"
          className={filterQueryOpen}
        >
          {!isQueryAnswerPage ?
            <form action=""
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  id="vorm">
              <div className="query-form-container">
                <div>
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
                </div>
                <div>
                  <b>{t('common_text_data')}</b>
                  <br /><br />
                  <FormControl
                    className={classes.formControl}
                    size="small"
                  >
                    <InputLabel id="types-label">
                      {t('query_text_data_type')}
                    </InputLabel>
                    <Select
                      labelId="types-label"
                      multiple
                      value={textTypes}
                      name="types"
                      renderValue={getTextTypeRenderValue}
                      disabled={getSelectedCorpusList().length === 0}
                      MenuProps={MenuProps}
                    >
                      {Object.keys(textTypesOptions).map((corpus) => (
                        corpusCheckboxStatus[corpus] && Object.keys(textTypesOptions[corpus]).map((textType) => (
                          typeof textTypesOptions[corpus][textType] === 'string'
                            ? <MenuItem key={textType}
                                        id={textType}
                                        onClick={(e) => alterTextTypeHierarchyDropdown(e, true, null)}
                                        value={textType}>
                              <ListItemIcon>
                                <Checkbox id={textType}
                                          checked={textTypes.indexOf(textType) > -1} />
                              </ListItemIcon>
                              <ListItemText id={textType}
                                            primary={t(textTypesOptions[corpus][textType])} />
                            </MenuItem>
                            : <span key={`${textType}_span`}>
                            <MenuItem key={textType}
                                      id={textType}
                                      onClick={(e) => alterTextTypeHierarchyDropdown(e, false, corpus)}
                                      value={textType}>
                              <ListItemIcon>
                                <Checkbox id={textType}
                                          checked={checkTextTypeHierarchyCheckboxStatus(textType, corpus)} />
                              </ListItemIcon>
                              <ListItemText id={textType}
                                            primary={t(textType)} />
                            </MenuItem>
                              {Object.keys(textTypesOptions[corpus][textType]).map((specificTextType) => (
                                <MenuItem key={specificTextType}
                                          id={specificTextType}
                                          onClick={(e) => alterTextTypeHierarchyDropdown(e, true, null)}
                                          value={specificTextType}
                                          sx={{ paddingLeft: '2rem' }}>
                                  <ListItemIcon>
                                    <Checkbox id={specificTextType}
                                              checked={textTypes.indexOf(specificTextType) > -1} />
                                  </ListItemIcon>
                                  <ListItemText id={specificTextType}
                                                primary={t(textTypesOptions[corpus][textType][specificTextType])} />
                                </MenuItem>
                              ))}
                          </span>
                        ))
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small">
                    <InputLabel id="language-label">
                      {t('query_text_data_language')}
                    </InputLabel>
                    <Select
                      sx={{ minWidth: selectWidth }}
                      labelId="language-label"
                      name="language"
                      value={singlePropertyData.language}
                      onClick={(e) => alterSinglePropertyData(e, 'language')}
                    >
                      {Object.keys(textLanguageOptions).map((lang) => (
                        <MenuItem key={lang}
                                  value={lang}>{t(textLanguageOptions[lang])}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {checkIfOnlySpecificCorpusIsChecked('cwUSEqQLt')
                    ? <>
                      <FormControl size="small">
                        <InputLabel
                          id="domain-label">{t('common_text_data_field_of_research')}</InputLabel>
                        <Select
                          sx={{ minWidth: selectWidth }}
                          labelId="domain-label"
                          name="domain"
                          value={singlePropertyData.domain}
                          onClick={(e) => alterSinglePropertyData(e, 'domain')}
                        >
                          {Object.keys(domainDisplayOptions).map((domain) => (
                            <MenuItem key={domain}
                                      value={domain}>{t(domainDisplayOptions[domain])}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl
                        className={classes.formControl}
                        size="small"
                      >
                        <InputLabel id="usedMultiMaterials-label">
                          {t('query_text_data_used_study_or_supporting_materials')}
                        </InputLabel>
                        <Select
                          labelId="usedMultiMaterials-label"
                          multiple
                          value={usedMultiMaterials}
                          name="usedMultiMaterials"
                          renderValue={getUsedMultiMaterialsRenderValue}
                          MenuProps={MenuProps}
                        >
                          {Object.keys(usedMaterialsMultiOptions).map((material) => (
                            typeof usedMaterialsMultiOptions[material] === 'string'
                              ? <MenuItem key={material}
                                          id={material}
                                          onClick={(e) => alterUsedMaterialsHierarchyDropdown(e, true)}
                                          value={material}>
                                <ListItemIcon>
                                  <Checkbox id={material}
                                            checked={usedMultiMaterials.indexOf(material) > -1} />
                                </ListItemIcon>
                                <ListItemText id={material}
                                              primary={t(usedMaterialsMultiOptions[material])} />
                              </MenuItem>
                              : <span key={`${material}_span`}>
                                <MenuItem key={material}
                                          id={material}
                                          onClick={(e) => alterUsedMaterialsHierarchyDropdown(e, false)}
                                          value={material}>
                                  <ListItemIcon>
                                    <Checkbox id={material}
                                              checked={checkUsedMaterialsHierarchyCheckboxStatus(material)} />
                                  </ListItemIcon>
                                  <ListItemText id={material}
                                                primary={t(material)} />
                                </MenuItem>
                                {Object.keys(usedMaterialsMultiOptions[material]).map((subMaterial) => (
                                  <MenuItem key={subMaterial}
                                            id={subMaterial}
                                            onClick={(e) => alterUsedMaterialsHierarchyDropdown(e, true)}
                                            value={subMaterial}
                                            sx={{ paddingLeft: '2rem' }}>
                                    <ListItemIcon>
                                      <Checkbox id={subMaterial}
                                                style={{ color: '#9C27B0' }}
                                                checked={usedMultiMaterials.indexOf(subMaterial) > -1} />
                                    </ListItemIcon>
                                    <ListItemText id={subMaterial}
                                                  primary={t(usedMaterialsMultiOptions[material][subMaterial])} />
                                  </MenuItem>
                                ))}
                              </span>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                    : <>
                      <FormControl size="small">
                        <InputLabel id="level-label">
                          {t('query_text_data_level')}
                        </InputLabel>
                        <Select
                          sx={{ minWidth: selectWidth }}
                          labelId="level-label"
                          name="level"
                          value={singlePropertyData.level}
                          onClick={(e) => alterSinglePropertyData(e, 'level')}
                        >
                          {textLevelOptions.map((level) => (
                            <MenuItem key={level} value={level}>{level}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small">
                        <InputLabel id="usedMaterials-label">
                          {t('query_text_data_used_supporting_materials')}
                        </InputLabel>
                        <Select
                          sx={{ minWidth: selectWidth }}
                          labelId="usedMaterials-label"
                          name="usedMaterials"
                          value={singlePropertyData.usedMaterials}
                          onClick={(e) => alterSinglePropertyData(e, 'usedMaterials')}
                        >
                          {Object.keys(usedMaterialsDisplayOptions).map((material) => (
                            <MenuItem key={material}
                                      value={material}>{t(usedMaterialsDisplayOptions[material])}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                  }
                  <FormControl
                    className={classes.formControl}
                    size="small"
                  >
                    <InputLabel id="addedYears-label">
                      {t('query_text_data_year_of_publication')}
                    </InputLabel>
                    <Select
                      labelId="addedYears-label"
                      multiple
                      value={addedYears}
                      name="addedYears"
                      onChange={(e) => setAddedYears(e.target.value)}
                      renderValue={(addedYear) => addedYear.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {addedYearOptions.map((year) => (
                        <MenuItem key={year}
                                  value={t(year)}>
                          <ListItemIcon>
                            <Checkbox checked={addedYears.indexOf(t(year)) > -1} />
                          </ListItemIcon>
                          <ListItemText primary={year} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    className={classes.formControl}
                    size="small"
                  >
                    <InputLabel id="characters-label">
                      {t('query_text_data_characters')}
                    </InputLabel>
                    <Select
                      labelId="characters-label"
                      multiple
                      value={characters}
                      name="characters"
                      onChange={(e) => setCharacters(e.target.value)}
                      renderValue={(character) => character.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {charactersOptions.map((item) => (
                        <MenuItem key={item}
                                  value={t(item)}>
                          <ListItemIcon>
                            <Checkbox checked={characters.indexOf(t(item)) > -1} />
                          </ListItemIcon>
                          <ListItemText primary={t(item)} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    className={classes.formControl}
                    size="small"
                  >
                    <InputLabel id="words-label">
                      {t('common_words')}
                    </InputLabel>
                    <Select
                      labelId="words-label"
                      multiple
                      value={words}
                      name="words"
                      onChange={(e) => setWords(e.target.value)}
                      renderValue={(word) => word.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {wordsOptions.map((item) => (
                        <MenuItem key={item}
                                  value={t(item)}>
                          <ListItemIcon>
                            <Checkbox checked={words.indexOf(t(item)) > -1} />
                          </ListItemIcon>
                          <ListItemText primary={t(item)} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    className={classes.formControl}
                    size="small"
                  >
                    <InputLabel id="sentences-label">
                      {t('common_sentences')}
                    </InputLabel>
                    <Select
                      labelId="sentences-label"
                      multiple
                      value={sentences}
                      name="sentences"
                      onChange={(e) => setSentences(e.target.value)}
                      renderValue={(sentence) => sentence.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {sentencesOptions.map((item) => (
                        <MenuItem key={item}
                                  value={t(item)}>
                          <ListItemIcon>
                            <Checkbox checked={sentences.indexOf(t(item)) > -1} />
                          </ListItemIcon>
                          <ListItemText primary={t(item)} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <b>{t('common_author_data')}</b>
                  <br /><br />
                  <FormControl size="small">
                    <InputLabel id="age-label">
                      {t('query_author_data_age')}
                    </InputLabel>
                    <Select
                      sx={{ minWidth: selectWidth }}
                      labelId="age-label"
                      name="age"
                      value={singlePropertyData.age}
                      onClick={(e) => alterSinglePropertyData(e, 'age')}
                    >
                      {Object.keys(ageOptions).map((age) => (
                        <MenuItem key={age} value={age}>{t(ageOptions[age])}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small">
                    <InputLabel id="gender-label">
                      {t('query_author_data_gender')}
                    </InputLabel>
                    <Select
                      sx={{ minWidth: selectWidth }}
                      labelId="gender-label"
                      name="gender"
                      value={singlePropertyData.gender}
                      onClick={(e) => alterSinglePropertyData(e, 'gender')}
                    >
                      {Object.keys(genderOptions).map((gender) => (
                        <MenuItem key={gender}
                                  value={gender}>{t(genderOptions[gender])}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {checkIfOnlySpecificCorpusIsChecked('cwUSEqQLt')
                    ? <>
                      <FormControl size="small">
                        <InputLabel id="studyLevel-label">
                          {t('query_author_data_level_of_study')}
                        </InputLabel>
                        <Select
                          sx={{ minWidth: selectWidth }}
                          labelId="studyLevel-label"
                          name="studyLevel"
                          value={singlePropertyData.studyLevel}
                          onClick={(e) => alterSinglePropertyData(e, 'studyLevel')}
                        >
                          {Object.keys(studyLevelOptions).map((level) => (
                            <MenuItem key={level}
                                      value={level}>{t(studyLevelOptions[level])}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl size="small">
                        <InputLabel id="degree-label">
                          {t('query_author_data_degree')}
                        </InputLabel>
                        <Select
                          sx={{ minWidth: selectWidth }}
                          labelId="degree-label"
                          name="degree"
                          value={singlePropertyData.degree}
                          onClick={(e) => alterSinglePropertyData(e, 'degree')}
                        >
                          {Object.keys(degreeOptions).map((degree) => (
                            <MenuItem key={degree}
                                      value={degree}>{t(degreeOptions[degree])}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                    : <FormControl size="small">
                      <InputLabel id="education-label">
                        {t('query_author_data_education')}
                      </InputLabel>
                      <Select
                        sx={{ minWidth: selectWidth }}
                        labelId="education-label"
                        name="education"
                        value={singlePropertyData.education}
                        onClick={(e) => alterSinglePropertyData(e, 'education')}
                      >
                        {Object.keys(educationOptions).map((education) => (
                          <MenuItem key={education}
                                    value={education}>{t(educationOptions[education])}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>}
                  {checkIfOnlySpecificCorpusIsChecked('clWmOIrLa')
                    ? <FormControl size="small">
                      <InputLabel id="nationality-label">
                        {t('query_author_data_nationality')}
                      </InputLabel>
                      <Select
                        sx={{ minWidth: selectWidth }}
                        labelId="nationality-label"
                        name="nationality"
                        value={singlePropertyData.nationality}
                        onClick={(e) => alterSinglePropertyData(e, 'nationality')}
                      >
                        {Object.keys(nationalityOptions).map((nationality) => (
                          <MenuItem key={nationality}
                                    value={nationality}>{t(nationalityOptions[nationality])}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    : <FormControl size="small">
                      <InputLabel id="nativeLang-label">
                        {t('query_author_data_native_language')}
                      </InputLabel>
                      <Select
                        sx={{ minWidth: selectWidth }}
                        labelId="nativeLang-label"
                        name="nativeLang"
                        value={singlePropertyData.nativeLang}
                        onClick={(e) => alterSinglePropertyData(e, 'nativeLang')}
                      >
                        {Object.keys(languageOptionsForNativeLangs).map((lang) => (
                          <MenuItem key={lang}
                                    value={lang}>{t(languageOptionsForNativeLangs[lang])}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  }
                  {checkIfOnlySpecificCorpusIsChecked('cwUSEqQLt')
                    ? <>
                      <FormControl size="small">
                        <InputLabel id="otherLang-label">
                          {t('query_author_data_other_languages')}
                        </InputLabel>
                        <Select
                          sx={{ minWidth: selectWidth }}
                          labelId="otherLang-label"
                          name="otherLang"
                          value={singlePropertyData.otherLang}
                          onClick={(e) => alterSinglePropertyData(e, 'otherLang')}
                        >
                          {Object.keys(languageOptionsForOtherLangs).map((lang) => (
                            <MenuItem key={lang}
                                      value={lang}>{t(languageOptionsForOtherLangs[lang])}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                    : <></>}
                  <FormControl size="small">
                    <InputLabel id="country-label">
                      {t('query_author_data_country')}
                    </InputLabel>
                    <Select
                      sx={{ minWidth: selectWidth }}
                      labelId="country-label"
                      name="country"
                      value={singlePropertyData.country}
                      onClick={(e) => alterSinglePropertyData(e, 'country')}
                    >
                      {Object.keys(countryOptionsForQuery).map((country) => (
                        <MenuItem key={country}
                                  value={country}>{t(countryOptionsForQuery[country])}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <br /><br />
              {alert || noResultsError ?
                <>
                  <Alert style={{ width: '30%' }} severity="error">
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
            :
            <span>
              <QueryResults
                key={resultsKey}
                data={results}
                setFilterBoxClass={() => setFilterBoxClass()}
                setIsQueryAnswerPage={setIsQueryAnswerPage}
                setPreviousSelectedIds={setPreviousSelectedIds}
                previousSelectedIds={previousSelectedIds}
              />
        </span>}
        </Box>
        <Button
          ref={inputButtonRef}
          id="choose-input-button"
          variant="contained"
          className={inputButtonOpen}
          onClick={setInputBoxClass}
        >
          <div className="button-text-query">
            <ReadMoreIcon className="query-find-texts-icon" />
            <span className="query-find-texts-text">
              {t('query_own_texts')}
            </span>
          </div>
        </Button>
        <Box className={inputQueryOpen}>
          <div>
            {t('textupload_primary_modal_title')}
          </div>
          <br />
          <div>
            <TextUpload sendTextFromFile={sendTextFromFile} />
            <textarea
              spellCheck="false"
              className="query-textinput"
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
            ></textarea>
            <Button
              variant="contained"
              sx={DefaultButtonStyle}
              disabled={textInputValue === ''}
              onClick={() => {
                handleSubmitOwnTexts();
                setInputBoxClass();
              }}
            >
              {t('textupload_primary_modal_save')}
            </Button>
          </div>
        </Box>
        {(corpusTextsSelected > 0 || ownTextsSelected) &&
          <div className="query-chip-button shadow-sm">
            <div className="tools-chips">
              <div className="query-chip-header">{t('query_results_saved_for_analysis')}</div>
              {corpusTextsSelected > 0 &&
                <div>
                  <Chip
                    sx={ElleDefaultChip}
                    avatar={
                      <div className="number-avatar">
                        {corpusTextsSelected > 1 ? corpusTextsSelected : 1}
                      </div>
                    }
                    label={corpusTextsSelected > 1 ? t('query_results_saved_for_analysis_corpus_plural', { amount: corpusTextsSelected }) : t('query_results_saved_for_analysis_corpus')}
                    className="my-1"
                    variant="outlined"
                    onDelete={() => handleChipDelete(ChipDeleteType.CORPUS_TEXTS)}
                  />
                </div>
              }
              {ownTextsSelected > 0 &&
                <Chip
                  sx={ElleDefaultChip}
                  label={t('query_results_saved_for_analysis_own_texts')}
                  variant="outlined"
                  onDelete={() => handleChipDelete(ChipDeleteType.OWN_TEXTS)}
                />
              }
            </div>
          </div>}
      </div>
    </div>
  );
}

const ChipDeleteType = {
  CORPUS_TEXTS: 'CORPUS_TEXTS',
  OWN_TEXTS: 'OWN_TEXTS'
};
