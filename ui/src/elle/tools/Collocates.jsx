import { useEffect, useMemo, useState } from 'react';
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
import { TableType } from '../components/table/TableDownloadButton';
import { queryStore } from '../store/QueryStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import WordlistMenu from './wordlist/components/WordlistMenu';
import GenericTable from '../components/table/GenericTable';
import { changeCollocatesResult, toolAnalysisStore } from '../store/ToolAnalysisStore';
import { useTranslation } from 'react-i18next';
import TableHeaderButtons from '../components/table/TableHeaderButtons';
import GraphView from './wordcontext/components/GraphView';
import { AccordionStyle, DefaultButtonStyle } from '../const/StyleConstants';
import { useGetCollocatesResult } from '../hooks/service/ToolsService';
import { loadingEmitter } from '../../App';
import { LoadingSpinnerEventType } from '../components/LoadingSpinner';
import TooltipButton from '../components/tooltip/TooltipButton';
import './styles/Collocates.css';

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
  const tableToDownload = [t('neighbouring_words_collocation'), t('neighbouring_words_score'), t('neighbouring_words_number_of_co_occurrences'), t('neighbouring_words_frequency_in_text'), t('neighbouring_words_percentage_in_text')];
  const accessors = ['collocate', 'score', 'coOccurrences', 'frequencyCount', 'frequencyPercentage'];
  const [response, setResponse] = useState([]);
  const data = useMemo(() => response, [response]);
  const [showNoResultsError, setShowNoResultsError] = useState(false);
  const { getCollocatesResult } = useGetCollocatesResult();
  const defaultSortColumn = 'score';

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
    if (collocateState?.analysis?.length > 0) {
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
      id: 'collocate',
      header: t('neighbouring_words_collocation'),
      accessorKey: 'collocate'
    },
    {
      id: 'score',
      header: t('neighbouring_words_score'),
      accessorKey: 'score'
    },
    {
      id: 'coOccurrences',
      header: t('neighbouring_words_number_of_co_occurrences'),
      accessorKey: 'coOccurrences'
    },
    {
      id: 'frequencyCount',
      header: t('neighbouring_words_frequency_in_text'),
      accessorKey: 'frequencyCount'
    },
    {
      id: 'frequencyPercentage',
      header: t('neighbouring_words_percentage_in_text'),
      accessorKey: 'frequencyPercentage',
      cell: info => `${info.getValue()}%`
    },
    {
      id: 'menu',
      header: '',
      accessorKey: 'menu',
      enableSorting: false,
      meta: { className: 'row-action-button' },
      cell: info =>
        <WordlistMenu
          word={info.row.original.collocate}
          type={typeValue}
          keepCapitalization={capitalizationChecked}
        />
    }
  ], [typeValue, capitalizationChecked, t]);

  const handleSubmit = event => {
    event.preventDefault();
    sendRequest();
  };

  const handleTypeChange = event => {
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
          if (!response) return;
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
    <span className="collocates-app">
      <h2 className="tool-title">
        {t('common_neighbouring_words')}
      </h2>
      <Accordion
        sx={AccordionStyle}
        expanded={paramsExpanded}
        onChange={() => setParamsExpanded(!paramsExpanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {t('common_analysis_options')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              sx={{
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <Grid
                item
                size={{ xs: 12, sm: 4, md: 3.5 }}
              >
                <FormControl error={typeError}>
                  <FormLabel>
                    {t('common_search')}
                  </FormLabel>
                  <RadioGroup
                    name="type"
                    value={typeValue}
                    onChange={handleTypeChange}
                  >
                    <FormControlLabel
                      value={CollocateType.WORDS}
                      control={<Radio />}
                      label={t('common_by_word_form')}
                    />
                    <FormControlLabel
                      value={CollocateType.LEMMAS}
                      control={<Radio />}
                      label={t('common_by_base_form')}
                    />
                  </RadioGroup>
                  {typeError &&
                    <FormHelperText>
                      {t('error_mandatory_field')}
                    </FormHelperText>
                  }
                </FormControl>
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 8, md: 5 }}
              >
                <FormControl>
                  <FormLabel>
                    {t('common_enter_search_word')}
                  </FormLabel>
                  <TextField
                    size="small"
                    required
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>
                    {t('neighbouring_words_search_for_neighbouring_words')}
                  </FormLabel>
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                  >
                    <Grid item>
                      <TextField
                        type="number"
                        slotProps={{
                          htmlInput: {
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                            min: '1',
                            max: '5'
                          }
                        }}
                        size="small"
                        required
                        value={searchCount}
                        onChange={e => setSearchCount(e.target.value)}
                        className="tool-inline-textfield"
                      />
                    </Grid>
                    <Grid item>
                      {t('neighbouring_words_search_within_preceding_and_following_words')}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 12, md: 3.5 }}
              >
                <FormControl size="small">
                  <InputLabel>
                    {t('neighbouring_words_choose_statistic_measure')}
                    <TooltipButton>
                      {t('neighbouring_words_statistic_measure_hover')}
                    </TooltipButton>
                  </InputLabel>
                  <Select
                    value={formula}
                    onChange={e => setFormula(e.target.value)}
                  >
                    <MenuItem value={StatisticMeasureFormula.LOGDICE}>
                      {t('neighbouring_words_statistic_measure_logdice')}
                    </MenuItem>
                    <MenuItem value={StatisticMeasureFormula.T_SCORE}>
                      {t('neighbouring_words_statistic_measure_t_score')}
                    </MenuItem>
                    <MenuItem value={StatisticMeasureFormula.MI_SCORE}>
                      {t('neighbouring_words_statistic_measure_mi_score')}
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>
                    {t('common_other_options')}
                  </FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={capitalizationChecked}
                        disabled={typeValue === CollocateType.LEMMAS}
                        onChange={e => setCapitalizationChecked(e.target.checked)}
                      />
                    }
                    label={<>
                      {t('common_case_sensitive')}
                      <TooltipButton>
                        {t('neighbouring_words_case_sensitive_hover')}
                      </TooltipButton>
                    </>}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Button
              sx={DefaultButtonStyle}
              type="submit"
              variant="contained"
            >
              {t('analyse_button')}
            </Button>
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
      {showTable && data && <>
        <TableHeaderButtons
          leftComponent={<GraphView data={data} keyword={lastKeyword} />}
          downloadData={data}
          downloadTableType={TableType.COLLOCATES}
          downloadHeaders={tableToDownload}
          downloadAccessors={accessors}
          downloadSortByColumnAccessor={defaultSortColumn}
        />
        <GenericTable
          columns={columns}
          data={data}
          sortByColumnId={defaultSortColumn}
          showRowNumbers={true}
        />
      </>}
      {showNoResultsError &&
        <Alert severity="error">
          {t('error_no_matching_keywords')}
        </Alert>
      }
    </span>
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
