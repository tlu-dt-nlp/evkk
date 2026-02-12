import { useEffect, useMemo, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Grid, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/QueryResultsModal.css';
import {
  ageOptions,
  corpuses,
  countryOptionsForQueryResults,
  educationOptions,
  genderOptions,
  languageOptionsForNativeLangs,
  textLanguageOptions,
  textTypeList,
  usedMaterialsDisplayOptions
} from '../../../const/Constants';
import GenericTable from '../../table/GenericTable';
import QueryDownloadButton from '../../QueryDownloadButton';
import { changeCorpusTexts, queryStore } from '../../../store/QueryStore';
import { useTranslation } from 'react-i18next';
import ModalBase from '../ModalBase';
import { DefaultButtonStyle } from '../../../const/StyleConstants';
import { useGetTextAndMetadata } from '../../../hooks/service/TextService';

export default function QueryResultsModal({
                                            results,
                                            setIsQueryResponsePage,
                                            setPreviousSelectedIds,
                                            previousSelectedIds,
                                            setIsQueryOpen
                                          }) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAccordionExpanded, setModalAccordionExpanded] = useState(false);
  const [text, setText] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const data = useMemo(() => results, [results]);
  const { getTextAndMetadata } = useGetTextAndMetadata();
  let paragraphCount = 0;

  const [metadata, setMetadata] = useState({
    title: '',
    korpus: '',
    tekstityyp: '',
    tekstikeel: '',
    keeletase: '',
    abivahendid: '',
    ajavahemik: '',
    vanusevahemik: '',
    sugu: '',
    haridus: '',
    emakeel: '',
    riik: ''
  });

  useEffect(() => {
    if (previousSelectedIds.size > 0) {
      const initial = {};
      results.forEach(row => {
        if (previousSelectedIds.has(row.text_id)) {
          initial[row.text_id] = true;
        }
      });
      setRowSelection(initial);
    }
  }, [results, previousSelectedIds]);

  const columns = useMemo(() => [
      {
        id: 'value',
        header: t('query_results_text_title'),
        accessorKey: 'property_value',
        enableSorting: false,
        cell: info => {
          const value = info.getValue();
          const textId = info.row.original.text_id;
          return (
            <span
              className="clickable-row"
              onClick={() => previewText(textId)}
            >
              {value}
            </span>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter(id => rowSelection[id]),
    [rowSelection]
  );

  const changeModalAccordion = () => {
    setModalAccordionExpanded(!modalAccordionExpanded);
  };

  function previewText(id) {
    getTextAndMetadata(id)
      .then(response => {
        if (!response) return;
        setText(response.text);
        response.properties.forEach(param => {
          setIndividualMetadata(param.propertyName, param.propertyValue);
        });
        setModalOpen(true);
      });
  }

  const setIndividualMetadata = (keyName, valueName) => {
    setMetadata(prevData => {
      return {
        ...prevData,
        [keyName]: valueName
      };
    });
  };

  const saveTexts = () => {
    queryStore.dispatch(changeCorpusTexts(selectedIds.join(',')));
    setPreviousSelectedIds(new Set(selectedIds));
    setIsQueryOpen(false);
  };

  const getParagraphKey = (item) => {
    if (item) {
      return item;
    } else {
      paragraphCount++;
      return `empty_paragraph_${paragraphCount}`;
    }
  };

  return (
    <>
      {results.length > 0 ? <h4><strong>{t('query_results_found_texts')}</strong> {results.length}</h4> : <></>}
      {results.length > 0 &&
        <>
          <Grid
            container
            spacing={2}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              sx={DefaultButtonStyle}
              variant="contained"
              onClick={() => {
                setIsQueryResponsePage(prevState => !prevState);
                setPreviousSelectedIds(new Set(selectedIds));
              }}
            >
              {t('query_change_chosen_corpuses')}
            </Button>
            <Button
              sx={DefaultButtonStyle}
              variant="contained"
              disabled={selectedIds.length === 0}
              onClick={saveTexts}
            >
              {t('query_results_save_texts_for_analysis')}
            </Button>
          </Grid>

          {/* todo maybe querydownloadbutton needs to live inside TableHeaderButtons? */}
          <QueryDownloadButton selected={new Set(selectedIds)} />
          <GenericTable
            columns={columns}
            data={data}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            getRowId={row => row.text_id}
          />
        </>
      }
      <ModalBase
        isOpen={modalOpen}
        setIsOpen={setModalOpen}
        title={metadata.title}
      >
        <Accordion
          expanded={modalAccordionExpanded}
          onChange={changeModalAccordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id="filters-header"
          >
            <Typography>
              {t('query_results_preview_metadata_modal_title')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="metainfo-subtitle">{t('common_text_data')}</div>
            <strong>{t('query_subcorpus')}:</strong> {t(corpuses[metadata.korpus]) || '-'}<br />
            <strong>{t('query_text_data_type')}:</strong> {t(textTypeList[metadata.tekstityyp]) || '-'}<br />
            <strong>{t('query_text_data_language')}:</strong> {t(textLanguageOptions[metadata.tekstikeel]) || '-'}<br />
            <strong>{t('query_text_data_level')}:</strong> {metadata.keeletase || '-'}<br />
            <strong>{t('query_text_data_used_supporting_materials')}:</strong> {t(usedMaterialsDisplayOptions[metadata.abivahendid]) || '-'}<br />
            <strong>{t('query_text_data_year_of_publication')}:</strong> {metadata.ajavahemik || '-'}<br />
            <br />
            <div className="metainfo-subtitle">{t('common_author_data')}</div>
            <strong>{t('query_author_data_age')}:</strong> {t(ageOptions[metadata.vanusevahemik]) || '-'}<br />
            <strong>{t('query_author_data_gender')}:</strong> {t(genderOptions[metadata.sugu]) || '-'}<br />
            <strong>{t('query_author_data_education')}:</strong> {t(educationOptions[metadata.haridus]) || '-'}<br />
            <strong>{t('query_author_data_native_language')}:</strong> {t(languageOptionsForNativeLangs[metadata.emakeel]) || '-'}<br />
            <strong>{t('query_author_data_country')}:</strong> {t(countryOptionsForQueryResults[metadata.riik]) || '-'}<br />
          </AccordionDetails>
        </Accordion>
        <br />
        {text.split(/\\n/g).map(function (item) {
          return (
            <span key={getParagraphKey(item)}>
              {item}
              <br />
            </span>
          );
        })}
      </ModalBase>
    </>
  );
}
