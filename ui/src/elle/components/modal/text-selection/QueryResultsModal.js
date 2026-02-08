import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  Typography
} from '@mui/material';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
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
import TablePagination from '../../table/TablePagination';
import QueryDownloadButton from '../../QueryDownloadButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { changeCorpusTexts, queryStore } from '../../../store/QueryStore';
import { useTranslation } from 'react-i18next';
import ModalBase from '../ModalBase';
import { DefaultButtonStyle, SecondaryButtonStyle } from '../../../const/StyleConstants';
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
  const [isLoadingSelectAllTexts, setIsLoadingSelectAllTexts] = useState(false);
  const checkboxStatuses = useRef(new Set());
  const [update, forceUpdate] = useReducer(x => x + 1, 0);
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
      results.forEach((d) => {
        if (previousSelectedIds.has(d.text_id)) {
          checkboxStatuses.current.add(d.text_id);
        }
      });
    }
    forceUpdate();
  }, [results, previousSelectedIds]);

  const columns = useMemo(() => [
      {
        id: 'select',
        header: '',
        accessorKey: 'text_id',
        cell: info => {
          const id = info.getValue();
          return (
            <Checkbox
              style={{ color: '#9C27B0' }}
              checked={checkboxStatuses.current.has(id)}
              id={id}
              onChange={() => alterCheckbox(id)}
            />
          );
        },
        meta: { className: 'checkbox-row' }
      },
      {
        id: 'value',
        header: '',
        accessorKey: 'property_value',
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

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const allTextIds = data.map(item => {
    return item.text_id;
  });

  const changeModalAccordion = () => {
    setModalAccordionExpanded(!modalAccordionExpanded);
  };

  const alterCheckbox = (id) => {
    if (checkboxStatuses.current.has(id)) {
      checkboxStatuses.current.delete(id);
    } else {
      checkboxStatuses.current.add(id);
    }
    forceUpdate();
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

  useEffect(() => {
    setIsLoadingSelectAllTexts(false);
  }, [update]);

  useEffect(() => {
    if (isLoadingSelectAllTexts) {
      if (allTextsSelected()) {
        checkboxStatuses.current.clear();
      } else {
        checkboxStatuses.current.clear();
        allTextIds.forEach(item => {
          checkboxStatuses.current.add(item);
        });
      }
      forceUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingSelectAllTexts]);

  function allTextsSelected() {
    return allTextIds.every(v => Array.from(checkboxStatuses.current).includes(v));
  }

  const saveTexts = () => {
    queryStore.dispatch(changeCorpusTexts(Array.from(checkboxStatuses.current).join(',')));
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
          <div>
            <Button
              style={{ color: 'white' }} startIcon={<ArrowBackIcon />} sx={DefaultButtonStyle}
              onClick={() => {
                setIsQueryResponsePage(prevState => !prevState);
                setPreviousSelectedIds(checkboxStatuses.current);
              }}
            >
              {t('query_change_chosen_corpuses')}
            </Button>
          </div>
          <LoadingButton
            variant="outlined"
            sx={SecondaryButtonStyle}
            loadingIndicator={<CircularProgress disableShrink color="inherit" size={16} />}
            loading={isLoadingSelectAllTexts}
            disabled={isLoadingSelectAllTexts}
            className="select-all-button"
            onClick={() => setIsLoadingSelectAllTexts(true)}
          >
            {allTextsSelected() ? t('query_results_unselect_all') : t('query_results_select_all')}
          </LoadingButton>
          <Button
            sx={DefaultButtonStyle}
            variant="contained"
            disabled={checkboxStatuses.current.size === 0}
            onClick={saveTexts}
            className="save-texts-button"
          >
            {t('query_results_save_texts_for_analysis')}
          </Button>
          <QueryDownloadButton selected={checkboxStatuses.current} />
          <table className="result-table">
            <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                className="query-table-row border"
                key={row.id}
                id={row.original.text_id}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className={cell.column.columnDef.meta?.className}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
          <br />
          <TablePagination table={table} />
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
