import { queryStore } from '../../store/QueryStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material';
import { STOPWORDS_DATADOI_PATH } from '../../const/PathConstants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WordlistMenu from './components/WordlistMenu';
import { TableType } from '../../components/table/TableDownloadButton';
import GenericTable from '../../components/table/GenericTable';
import { changeWordlistResult, toolAnalysisStore } from '../../store/ToolAnalysisStore';
import { useTranslation } from 'react-i18next';
import NewTabHyperlink from '../../components/NewTabHyperlink';
import WordcloudView from './components/WordcloudView';
import TableHeaderButtons from '../../components/table/TableHeaderButtons';
import { AccordionStyle, DefaultButtonStyle } from '../../const/StyleConstants';
import { useGetWordlistResult } from '../../hooks/service/ToolsService';
import { loadingEmitter } from '../../../App';
import { LoadingSpinnerEventType } from '../../components/LoadingSpinner';
import TooltipButton from '../../components/tooltip/TooltipButton';

export default function Wordlist() {

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [paramsExpanded, setParamsExpanded] = useState(true);
  const [typeValue, setTypeValue] = useState('');
  const [typeValueToDisplay, setTypeValueToDisplay] = useState('');
  const [typeError, setTypeError] = useState(false);
  const [stopwordsChecked, setStopwordsChecked] = useState(false);
  const [customStopwords, setCustomStopwords] = useState('');
  const [capitalizationChecked, setCapitalizationChecked] = useState(false);
  const [minimumFrequency, setMinimumFrequency] = useState('');
  const [tableToDownload, setTableToDownload] = useState([]);
  const [response, setResponse] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const accessors = ['word', 'frequencyCount', 'frequencyPercentage'];
  const data = useMemo(() => response, [response]);
  const { getWordlistResult } = useGetWordlistResult();
  const defaultSortColumn = 'frequencyCount';

  useEffect(() => {
    const type = typeValueToDisplay === WordlistType.WORDS ? t('wordlist_word_column') : t('wordlist_lemma_column');
    setTableToDownload([type, t('common_header_frequency'), t('common_header_percentage')]);
  }, [typeValueToDisplay, t]);

  useEffect(() => {
    const wordlistState = toolAnalysisStore.getState().wordlist;
    if (wordlistState?.analysis?.length > 0) {
      const params = wordlistState.parameters;
      setTypeValue(params.typeValue);
      setTypeValueToDisplay(params.typeValue);
      setStopwordsChecked(params.stopwordsChecked);
      setCustomStopwords(params.customStopwords);
      setCapitalizationChecked(params.capitalizationChecked);
      setMinimumFrequency(params.minimumFrequency);
      setResponse(wordlistState.analysis);
      setParamsExpanded(false);
      setShowTable(true);
    }
  }, [navigate]);

  useEffect(() => {
    toolAnalysisStore.dispatch(changeWordlistResult({
      parameters: {
        typeValue: typeValue,
        stopwordsChecked: stopwordsChecked,
        customStopwords: customStopwords,
        capitalizationChecked: capitalizationChecked,
        minimumFrequency: minimumFrequency
      },
      analysis: response
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  queryStore.subscribe(() => {
    toolAnalysisStore.dispatch(changeWordlistResult(null));
    setResponse([]);
    setParamsExpanded(true);
    setShowTable(false);
  });

  const columns = useMemo(() => [
    {
      id: 'word',
      header: () => typeValueToDisplay === WordlistType.WORDS
        ? t('wordlist_word_column')
        : t('wordlist_lemma_column'),
      accessorKey: 'word'
    },
    {
      id: 'frequencyCount',
      header: t('common_header_frequency'),
      accessorKey: 'frequencyCount'
    },
    {
      id: 'frequencyPercentage',
      header: t('common_header_percentage'),
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
          word={info.row.original.word}
          type={typeValue}
          keepCapitalization={capitalizationChecked}
          showCollocatesButton={true}
        />
    }
  ], [typeValue, typeValueToDisplay, capitalizationChecked, t]);

  const handleSubmit = event => {
    event.preventDefault();
    setTypeError(!typeValue);
    if (typeValue) {
      setShowTable(false);
      getWordlistResult(generateRequestData())
        .then(response => {
          loadingEmitter.emit(LoadingSpinnerEventType.LOADER_START_SHRINK_DISABLED);
          setTimeout(() => { // for a visual cue when rendering takes longer
            setResponse(response?.resultList);
            setShowTable(true);
            setParamsExpanded(false);
            setTypeValueToDisplay(typeValue);
            loadingEmitter.emit(LoadingSpinnerEventType.LOADER_END);
          }, 0);
        });
    }
  };

  const handleTypeChange = event => {
    setTypeValue(event.target.value);
    setTypeError(false);
  };

  const generateRequestData = () => {
    const storeState = queryStore.getState();
    return JSON.stringify({
      corpusTextIds: storeState.corpusTextIds || null,
      ownTexts: storeState.ownTexts || null,
      type: typeValue,
      excludeStopwords: stopwordsChecked,
      customStopwords: customStopwords === ''
        ? null
        : listifyCustomStopwords(customStopwords),
      keepCapitalization: capitalizationChecked,
      minFrequency: minimumFrequency === ''
        ? null
        : minimumFrequency
    });
  };

  const listifyCustomStopwords = (stopwords) => {
    return stopwords.replace(/ /g, '').split(',');
  };

  return (
    <>
      <h2 className="tool-title">
        {t('common_wordlist')}
      </h2>
      <Accordion
        sx={AccordionStyle}
        expanded={paramsExpanded}
        onChange={() => setParamsExpanded(!paramsExpanded)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id="wordlist-filters-header"
        >
          <Typography>
            {t('common_analysis_options')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleSubmit}>
            <div className="tool-accordion">
              <div>
                <FormControl
                  sx={{ m: 3 }}
                  error={typeError}
                  variant="standard"
                >
                  <FormLabel id="type-radios">
                    {t('common_search')}
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="type-radios"
                    name="type"
                    value={typeValue}
                    onChange={handleTypeChange}
                  >
                    <FormControlLabel
                      value={WordlistType.WORDS}
                      control={<Radio />}
                      label={t('wordlist_search_word_forms')}
                    />
                    <FormControlLabel
                      value={WordlistType.LEMMAS}
                      control={<Radio />}
                      label={t('wordlist_search_base_forms')}
                    />
                  </RadioGroup>
                  {typeError &&
                    <FormHelperText>
                      {t('error_mandatory_field')}
                    </FormHelperText>
                  }
                  <Button
                    sx={DefaultButtonStyle}
                    type="submit"
                    variant="contained"
                  >
                    {t('analyse_button')}
                  </Button>
                </FormControl>
              </div>
              <div>
                <FormControl
                  sx={{ m: 7 }}
                  variant="standard"
                >
                  <FormLabel id="stopwords">
                    {t('wordlist_exclude_stopwords')}
                  </FormLabel>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={stopwordsChecked}
                        onChange={(e) => setStopwordsChecked(e.target.checked)}
                      ></Checkbox>
                    }
                    label={
                      <>
                        {t('wordlist_stopwords_from_the_default_list')}
                        <TooltipButton>
                          {t('wordlist_stopwords_textbox_hover_1')}
                          <NewTabHyperlink
                            path={STOPWORDS_DATADOI_PATH}
                            content={t('wordlist_stopwords_textbox_hover_2')}
                          />
                          {t('wordlist_stopwords_textbox_hover_3')}
                        </TooltipButton>
                      </>
                    }
                  />
                  <TextField
                    label={t('wordlist_stopwords_textbox')}
                    size="small"
                    value={customStopwords}
                    onChange={(e) => setCustomStopwords(e.target.value)}
                  />
                </FormControl>
              </div>
              <div>
                <FormControl
                  sx={{ m: 7 }}
                  variant="standard"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={capitalizationChecked}
                        onChange={(e) => setCapitalizationChecked(e.target.checked)}
                      ></Checkbox>
                    }
                    label={
                      <>
                        {t('wordlist_retain_uppercase_letters')}
                        <TooltipButton>
                          {t('wordlist_retain_uppercase_letters_hover')}
                        </TooltipButton>
                      </>
                    }
                  />
                  <TextField
                    label={
                      <>
                        {t('wordlist_set_minimum_word_frequency')}
                        <TooltipButton>
                          {t('wordlist_set_minimum_word_frequency_hover')}
                        </TooltipButton>
                      </>
                    }
                    type="number"
                    slotProps={{
                      htmlInput: {
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        min: '1'
                      }
                    }}
                    size="small"
                    value={minimumFrequency}
                    onChange={(e) => setMinimumFrequency(e.target.value)}
                  />
                </FormControl>
              </div>
            </div>
          </form>
        </AccordionDetails>
      </Accordion>
      {showTable && data && <>
        <TableHeaderButtons
          leftComponent={<WordcloudView data={data} />}
          downloadData={data}
          downloadTableType={TableType.WORDLIST}
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
    </>
  );
}

const WordlistType = {
  WORDS: 'WORDS',
  LEMMAS: 'LEMMAS'
};
