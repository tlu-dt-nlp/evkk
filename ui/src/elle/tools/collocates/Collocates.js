import './Collocates.css';
import React, { useEffect, useMemo, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { TableType } from '../../components/table/TableDownloadButton';
import { queryStore } from '../../store/QueryStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import WordlistMenu from '../wordlist/components/WordlistMenu';
import GenericTable from '../../components/GenericTable';
import { changeCollocatesResult, toolAnalysisStore } from '../../store/ToolAnalysisStore';
import { useTranslation } from 'react-i18next';
import TableHeaderButtons from '../../components/table/TableHeaderButtons';
import GraphView from '../wordcontext/components/GraphView';
import { AccordionStyle, DefaultButtonStyle } from '../../const/StyleConstants';
import { useGetCollocatesResult } from '../../hooks/service/ToolsService';
import { loadingEmitter } from '../../../App';
import { LoadingSpinnerEventType } from '../../components/LoadingSpinner';
import TooltipButton from '../../components/tooltip/TooltipButton';

export default function Collocates() {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const [paramsExpanded, setParamsExpanded] = useState(true);
  const [typeValue, setTypeValue] = useState('');
  const [typeError, setTypeError] = useState(false);
  const [capitalizationChecked, setCapitalizationChecked] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [lastKeyword, setLastKeyword] = useState('');
  const [searchCount, setSearchCount] = useState(3);
  const [formula, setFormula] = useState(StatisticMeasureFormula.LOGDICE);
  const [lemmatizedKeywordResult, setLemmatizedKeywordResult] = useState(null);
  const [initialKeywordResult, setInitialKeywordResult] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const tableToDownload = [t('neighbouring_words_collocation'), t('neighbouring_words_score'), t('neighbouring_words_number_of_co_occurrences'), t('neighboring_words_frequency_in_text'), t('neighboring_words_percentage_in_text')];
  const accessors = ['collocate', 'score', 'coOccurrences', 'frequencyCount', 'frequencyPercentage'];
  const [response, setResponse] = useState([]);
  const data = useMemo(() => response, [response]);
  const [showNoResultsError, setShowNoResultsError] = useState(false);
  const { getCollocatesResult } = useGetCollocatesResult();
  const sortByColAccessor = 'score';

  useEffect(() => {
    if (urlParams.get('word') && urlParams.get('type') && urlParams.get('keepCapitalization')) {
      setKeyword(urlParams.get('word'));
      setTypeValue(urlParams.get('type'));
      if (urlParams.get('type') !== CollocateType.LEMMAS) {
        setCapitalizationChecked(urlParams.get('keepCapitalization') === 'true');
      }
      sendRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParams, keyword, typeValue, capitalizationChecked]);

  useEffect(() => {
    const collocateState = toolAnalysisStore.getState().collocates;
    if (collocateState !== null && collocateState.analysis.length > 0) {
      const params = collocateState.parameters;
      setTypeValue(params.typeValue);
      setKeyword(params.keyword);
      setSearchCount(params.searchCount);
      setFormula(params.formula);
      setCapitalizationChecked(params.capitalizationChecked);
      setResponse(collocateState.analysis);
      setParamsExpanded(false);
      setShowTable(true);
    }
  }, [navigate]);

  useEffect(() => {
    toolAnalysisStore.dispatch(changeCollocatesResult({
      parameters: {
        typeValue: typeValue,
        keyword: keyword,
        searchCount: searchCount,
        formula: formula,
        capitalizationChecked: capitalizationChecked
      },
      analysis: response
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  queryStore.subscribe(() => {
    toolAnalysisStore.dispatch(changeCollocatesResult(null));
    setResponse([]);
    setParamsExpanded(true);
    setShowTable(false);
  });

  const columns = useMemo(() => [
    {
      Header: t('common_header_number'),
      accessor: 'id',
      disableSortBy: true,
      Cell: (cellProps) => {
        return cellProps.sortedFlatRows.findIndex(item => item.id === cellProps.row.id) + 1;
      }
    },
    {
      Header: t('neighbouring_words_collocation'),
      accessor: 'collocate',
      Cell: (cellProps) => {
        return cellProps.value;
      }
    },
    {
      Header: t('neighbouring_words_score'),
      accessor: 'score',
      Cell: (cellProps) => {
        return cellProps.value;
      }
    },
    {
      Header: t('neighbouring_words_number_of_co_occurrences'),
      accessor: 'coOccurrences',
      Cell: (cellProps) => {
        return cellProps.value;
      }
    },
    {
      Header: t('neighbouring_words_frequency_in_text'),
      accessor: 'frequencyCount',
      Cell: (cellProps) => {
        return cellProps.value;
      }
    },
    {
      Header: t('neighbouring_words_percentage_in_text'),
      accessor: 'frequencyPercentage',
      Cell: (cellProps) => {
        return `${cellProps.value}%`;
      }
    },
    {
      Header: '',
      accessor: 'menu',
      disableSortBy: true,
      Cell: (cellProps) => {
        return (
          <WordlistMenu word={cellProps.row.original.collocate} type={typeValue}
                        keepCapitalization={capitalizationChecked} />
        );
      }
    }
  ], [typeValue, capitalizationChecked, t]);

  const handleSubmit = (event) => {
    event.preventDefault();
    sendRequest();
  };

  const handleTypeChange = (event) => {
    setTypeValue(event.target.value);
    setTypeError(false);
    if (event.target.value === CollocateType.LEMMAS) {
      setCapitalizationChecked(false);
    }
  };

  const sendRequest = () => {
    setTypeError(!typeValue);
    if (typeValue) {
      setShowTable(false);
      getCollocatesResult(generateRequestData())
        .then(response => {
          loadingEmitter.emit(LoadingSpinnerEventType.LOADER_START_SHRINK_DISABLED);
          setTimeout(() => { // for a visual cue when rendering takes longer
            setLastKeyword(keyword);
            setLemmatizedKeywordResult(null);
            setResponse(response.collocateList);
            if (response.collocateList.length === 0) {
              setShowTable(false);
              setParamsExpanded(true);
              setShowNoResultsError(true);
            } else {
              setShowTable(true);
              setParamsExpanded(false);
              setShowNoResultsError(false);
              if (response.lemmatizedKeyword) {
                setLemmatizedKeywordResult(response.lemmatizedKeyword);
                setInitialKeywordResult(response.initialKeyword);
              }
            }
            loadingEmitter.emit(LoadingSpinnerEventType.LOADER_END);
          }, 0);
        })
        .then(() => navigate('', { replace: true }));
    }
  };

  const generateRequestData = () => {
    const storeState = queryStore.getState();
    return JSON.stringify({
      corpusTextIds: storeState.corpusTextIds || null,
      ownTexts: storeState.ownTexts || null,
      type: typeValue,
      keyword: keyword,
      searchCount: searchCount,
      formula: formula,
      keepCapitalization: capitalizationChecked
    });
  };

  return (
    <>
      <h2 className="tool-title">{t('common_neighbouring_words')}</h2>
      <Accordion sx={AccordionStyle}
                 expanded={paramsExpanded}
                 onChange={() => setParamsExpanded(!paramsExpanded)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id="collocates-filters-header"
        >
          <Typography>
            {t('common_analysis_options')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit}>
            <div className="tool-accordion">
              <div>
                <FormControl sx={{ m: 3 }}
                             error={typeError}
                             variant="standard">
                  <FormLabel id="type-radios">{t('common_search')}</FormLabel>
                  <RadioGroup
                    aria-labelledby="type-radios"
                    name="type"
                    value={typeValue}
                    onChange={handleTypeChange}
                  >
                    <FormControlLabel value={CollocateType.WORDS}
                                      control={<Radio />}
                                      label={t('common_by_word_form')} />
                    <FormControlLabel value={CollocateType.LEMMAS}
                                      control={<Radio />}
                                      label={t('common_by_base_form')} />
                  </RadioGroup>
                  {typeError && <FormHelperText>{t('error_mandatory_field')}</FormHelperText>}
                  <Button sx={DefaultButtonStyle}
                          style={{ marginTop: '10vh !important' }}
                          className="collocates-analyse-button"
                          type="submit"
                          variant="contained">
                    {t('analyse_button')}
                  </Button>
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ m: 3 }}
                             variant="standard">
                  <FormLabel id="keyword">{t('common_enter_search_word')}</FormLabel>
                  <TextField variant="outlined"
                             size="small"
                             required
                             value={keyword}
                             onChange={(e) => setKeyword(e.target.value)}
                             style={{ width: '250px' }} />
                </FormControl>
                <br />
                <FormControl sx={{ m: 3 }}
                             style={{ marginTop: '-1vh' }}
                             variant="standard">
                  <FormLabel id="display">{t('neighbouring_words_search_for_neighbouring_words')}</FormLabel>
                  <Grid container>
                    <Grid item>
                      <TextField variant="outlined"
                                 type="number"
                                 inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: '1', max: '5' }}
                                 size="small"
                                 required
                                 value={searchCount}
                                 onChange={(e) => setSearchCount(e.target.value)}
                                 className="collocates-search-count-textfield" />
                    </Grid>
                    <Grid
                      item
                      className="collocates-explanation"
                    >
                      {t('neighbouring_words_search_within_preceding_and_following_words')}
                    </Grid>
                  </Grid>
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ m: 3 }} size="small">
                  <InputLabel id="formula">
                    {t('neighbouring_words_choose_statistic_measure')}
                    <TooltipButton>
                      {t('neighbouring_words_statistic_measure_hover')}
                    </TooltipButton>
                  </InputLabel>
                  <Select
                    sx={{ width: '140px' }}
                    name="formula"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value)}
                  >
                    <MenuItem
                      value={StatisticMeasureFormula.LOGDICE}>{t('neighbouring_words_statistic_measure_logdice')}</MenuItem>
                    <MenuItem
                      value={StatisticMeasureFormula.T_SCORE}>{t('neighbouring_words_statistic_measure_t_score')}</MenuItem>
                    <MenuItem
                      value={StatisticMeasureFormula.MI_SCORE}>{t('neighbouring_words_statistic_measure_mi_score')}</MenuItem>
                  </Select>
                </FormControl>
                <br />
                <FormControl sx={{ m: 3 }}
                             variant="standard">
                  <FormControlLabel control={
                    <Checkbox
                      checked={capitalizationChecked}
                      disabled={typeValue === CollocateType.LEMMAS}
                      onChange={(e) => setCapitalizationChecked(e.target.checked)}
                    ></Checkbox>
                  }
                                    label={<>
                                      {t('common_case_sensitive')}
                                      <TooltipButton>
                                        {t('neighbouring_words_case_sensitive_hover')}
                                      </TooltipButton>
                                    </>}
                  />
                </FormControl>
              </div>
            </div>
          </form>
        </AccordionDetails>
      </Accordion>
      {lemmatizedKeywordResult && <>
        <br />
        <Alert severity="warning">
          {t('neighbouring_words_keyword_lemmatization_warning', {
            initialKeywordResult: initialKeywordResult,
            lemmatizedKeywordResult: lemmatizedKeywordResult
          })}
        </Alert>
      </>}
      {showTable && <>
        <TableHeaderButtons leftComponent={<GraphView data={data} keyword={lastKeyword} />}
                            downloadData={data}
                            downloadTableType={TableType.COLLOCATES}
                            downloadHeaders={tableToDownload}
                            downloadAccessors={accessors}
                            downloadSortByColAccessor={sortByColAccessor} />
        <GenericTable tableClassname={'wordlist-table'}
                      columns={columns}
                      data={data}
                      sortByColAccessor={sortByColAccessor} />
      </>}
      {showNoResultsError &&
        <Alert severity="error">{t('error_no_matching_keywords')}</Alert>}
    </>
  );
}

const CollocateType = {
  WORDS: 'WORDS',
  LEMMAS: 'LEMMAS'
};

const StatisticMeasureFormula = {
  LOGDICE: 'LOGDICE',
  T_SCORE: 'T_SCORE',
  MI_SCORE: 'MI_SCORE'
};
