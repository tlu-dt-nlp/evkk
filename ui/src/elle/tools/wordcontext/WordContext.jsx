import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { queryStore } from '../../store/QueryStore';
import Accordion from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
import './styles/WordContext.css';
import { TableType } from '../../components/table/TableDownloadButton';
import GenericTable from '../../components/table/GenericTable';
import { changeWordContextResult, toolAnalysisStore } from '../../store/ToolAnalysisStore';
import { useTranslation } from 'react-i18next';
import { sortColumnByLastWord } from '../../util/TableUtils';
import TableHeaderButtons from '../../components/table/TableHeaderButtons';
import { AccordionStyle, DefaultButtonStyle } from '../../const/StyleConstants';
import { useGetWordContextResult } from '../../hooks/service/ToolsService';
import { loadingEmitter } from '../../../App';
import { LoadingSpinnerEventType } from '../../components/LoadingSpinner';
import TooltipButton from '../../components/tooltip/TooltipButton';
import { useAnalytics } from '../../../analytics.jsx';

export default function WordContext() {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [urlParams] = useSearchParams();
  const { trackToolAnalyze } = useAnalytics();
  const [paramsExpanded, setParamsExpanded] = useState(true);
  const [typeValue, setTypeValue] = useState('');
  const [typeError, setTypeError] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [displayCount, setDisplayCount] = useState(5);
  const [displayType, setDisplayType] = useState(DisplayType.WORD);
  const [capitalizationChecked, setCapitalizationChecked] = useState(false);
  const [response, setResponse] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showNoResultsError, setShowNoResultsError] = useState(false);
  const [lemmatizedKeywordResult, setLemmatizedKeywordResult] = useState(null);
  const [initialKeywordResult, setInitialKeywordResult] = useState(null);
  const tableToDownload = [t('concordances_preceding_context'), t('concordances_search_word'), t('concordances_following_context')];
  const accessors = ['contextBefore', 'keyword', 'contextAfter'];
  const { getWordContextResult } = useGetWordContextResult();
  const data = useMemo(() => response, [response]);
  const defaultSortColumn = 'originalId';

  useEffect(() => {
    if (urlParams.get('word') && urlParams.get('type') && urlParams.get('keepCapitalization')) {
      setKeyword(urlParams.get('word'));
      setTypeValue(urlParams.get('type'));
      if (urlParams.get('type') !== WordContextType.LEMMAS) {
        setCapitalizationChecked(urlParams.get('keepCapitalization') === 'true');
      }
      sendRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlParams, keyword, typeValue, capitalizationChecked]);

  useEffect(() => {
    const wordContextState = toolAnalysisStore.getState().wordContext;
    if (wordContextState?.analysis?.length > 0) {
      const params = wordContextState.parameters;
      setTypeValue(params.typeValue);
      setKeyword(params.keyword);
      setDisplayCount(params.displayCount);
      setDisplayType(params.displayType);
      setCapitalizationChecked(params.capitalizationChecked);
      setResponse(wordContextState.analysis);
      setParamsExpanded(false);
      setShowTable(true);
    }
  }, [navigate]);

  useEffect(() => {
    toolAnalysisStore.dispatch(changeWordContextResult({
      parameters: {
        typeValue: typeValue,
        keyword: keyword,
        displayCount: displayCount,
        displayType: displayType,
        capitalizationChecked: capitalizationChecked
      },
      analysis: response
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  queryStore.subscribe(() => {
    toolAnalysisStore.dispatch(changeWordContextResult(null));
    setResponse([]);
    setParamsExpanded(true);
    setShowTable(false);
  });

  const columns = useMemo(() => [
    {
      id: 'originalId',
      accessorKey: 'originalId',
      cell: info => info.row.id
    },
    {
      id: 'contextBefore',
      header: t('concordances_preceding_context'),
      accessorKey: 'contextBefore',
      sortingFn: (rowA, rowB) => sortColumnByLastWord(rowA, rowB, 'contextBefore'),
      meta: {
        className: 'text-right',
        classNameTd: 'context-before',
        minWidth: '300px'
      }
    },
    {
      id: 'keyword',
      header: t('concordances_search_word'),
      accessorKey: 'keyword',
      meta: {
        className: 'text-center',
        classNameTd: 'keyword'
      }
    },
    {
      id: 'contextAfter',
      header: t('concordances_following_context'),
      accessorKey: 'contextAfter',
      meta: {
        className: 'text-left',
        classNameTd: 'context-after',
        minWidth: '300px'
      }
    }
  ], [t]);

  const handleSubmit = event => {
    event.preventDefault();
    sendRequest();
  };

  const handleTypeChange = event => {
    setTypeValue(event.target.value);
    setTypeError(false);
    if (event.target.value === WordContextType.LEMMAS) {
      setCapitalizationChecked(false);
    }
  };

  const sendRequest = () => {
    setTypeError(!typeValue);
    if (typeValue) {
      trackToolAnalyze('word-context');
      setShowTable(false);
      getWordContextResult(generateRequestData())
        .then(response => {
          if (!response) return;
          loadingEmitter.emit(LoadingSpinnerEventType.LOADER_START_SHRINK_DISABLED);
          setTimeout(() => { // for a visual cue when rendering takes longer
            setLemmatizedKeywordResult(null);
            setResponse(response.contextList);
            if (response.contextList.length === 0) {
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
      displayCount: displayCount,
      displayType: displayType,
      keepCapitalization: capitalizationChecked
    });
  };

  return (
    <span className="wordcontext-app">
      <h2 className="tool-title">
        {t('common_word_in_context')}
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
                      value={WordContextType.WORDS}
                      control={<Radio />}
                      label={t('common_by_word_form')}
                    />
                    <FormControlLabel
                      value={WordContextType.LEMMAS}
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
                    {t('common_view')}
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
                            max: '15'
                          }
                        }}
                        size="small"
                        required
                        value={displayCount}
                        onChange={e => setDisplayCount(e.target.value)}
                        className="tool-inline-textfield"
                      />
                    </Grid>
                    <Grid item>
                      <Select
                        name="displayType"
                        size="small"
                        value={displayType}
                        onChange={e => setDisplayType(e.target.value)}
                        className="tool-inline-select"
                      >
                        <MenuItem value={DisplayType.WORD}>
                          {t('concordances_words')}
                        </MenuItem>
                        <MenuItem value={DisplayType.SENTENCE}>
                          {t('concordances_sentences')}
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item>
                      {t('concordances_before_and_after_selected_word')}
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid
                item
                size={{ xs: 12, sm: 12, md: 3.5 }}
              >
                <FormControl>
                  <FormLabel>
                    {t('common_other_options')}
                  </FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={capitalizationChecked}
                        disabled={typeValue === WordContextType.LEMMAS}
                        onChange={e => setCapitalizationChecked(e.target.checked)}
                      />
                    }
                    label={
                      <>
                        {t('common_case_sensitive')}
                        <TooltipButton>
                          {t('concordances_case_sensitive_hover')}
                        </TooltipButton>
                      </>
                    }
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
          {t('concordances_keyword_lemmatization_warning', {
            initialKeywordResult: initialKeywordResult,
            lemmatizedKeywordResult: lemmatizedKeywordResult
          })}
        </Alert>
      </>}
      {showTable && <>
        <TableHeaderButtons
          downloadData={data}
          downloadTableType={TableType.WORD_CONTEXT}
          downloadHeaders={tableToDownload}
          downloadAccessors={accessors}
        />
        <GenericTable
          columns={columns}
          data={data}
          sortByColumnId={defaultSortColumn}
          sortByDesc={false}
          hiddenColumn={defaultSortColumn}
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

const WordContextType = {
  WORDS: 'WORDS',
  LEMMAS: 'LEMMAS'
};

const DisplayType = {
  WORD: 'WORD',
  SENTENCE: 'SENTENCE'
};
