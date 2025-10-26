import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  Typography
} from '@mui/material';
import { usePagination, useTable } from 'react-table';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/QueryResults.css';
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
} from '../../const/Constants';
import TablePagination from '../../components/table/TablePagination';
import QueryDownloadButton from './QueryDownloadButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { changeCorpusTexts, queryStore } from '../../store/QueryStore';
import { useTranslation } from 'react-i18next';
import ModalBase from '../../components/modal/ModalBase';
import { DefaultButtonStyle } from '../../const/StyleConstants';
import { useGetTextAndMetadata } from '../../hooks/service/TextService';

export default function QueryResults(props) {
  const { t } = useTranslation();
  const response = props.data;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAccordionExpanded, setModalAccordionExpanded] = useState(false);
  const [text, setText] = useState('');
  const [isLoadingSelectAllTexts, setIsLoadingSelectAllTexts] = useState(false);
  const checkboxStatuses = useRef(new Set());
  const [update, forceUpdate] = useReducer(x => x + 1, 0);
  const data = useMemo(() => response, [response]);
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
    if (props.previousSelectedIds.size > 0) {
      props.data.forEach((d) => {
        if (props.previousSelectedIds.has(d.text_id)) {
          checkboxStatuses.current.add(d.text_id);
        }
      });
    }
    forceUpdate();
  }, [props.data, props.previousSelectedIds]);

  const columns = useMemo(() => [
      {
        Header: '',
        accessor: 'text_id',
        Cell: (cellProps) => {
          return (
            <Checkbox
              style={{ color: '#9C27B0' }}
              checked={checkboxStatuses.current.has(cellProps.value)}
              id={cellProps.value}
              onChange={() => alterCheckbox(cellProps.value)}
            />
          );
        },
        className: 'checkbox-row'
      },
      {
        Header: '',
        accessor: 'property_value',
        Cell: (cellProps) => {
          return (
            <span className="clickable-row"
                  onClick={() => previewText(cellProps.row.original.text_id)}>{cellProps.value}</span>
          );
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } =
    useTable({ columns, data }, usePagination);

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
        setText(response.text);
        response.properties.forEach(param => {
          setIndividualMetadata(param.propertyName, param.propertyValue);
        });
      });
    setModalOpen(true);
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

  const saveTexts = () => queryStore.dispatch(changeCorpusTexts(Array.from(checkboxStatuses.current).join(',')));

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
      {response.length > 0 ? <h4><strong>{t('query_results_found_texts')}</strong> {response.length}</h4> : <></>}
      {response.length > 0 &&
        <>
          <div>
            <Button style={{ color: 'white' }} startIcon={<ArrowBackIcon />} sx={DefaultButtonStyle}
                    onClick={() => {
                      props.setIsQueryAnswerPage(prevState => !prevState);
                      props.setPreviousSelectedIds(checkboxStatuses.current);
                    }}>{t('query_change_chosen_corpuses')}</Button>
          </div>
          <LoadingButton
            variant="outlined"
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
            onClick={() => {
              saveTexts();
              props.setFilterBoxClass();
            }}
            className="save-texts-button"
          >
            {t('query_results_save_texts_for_analysis')}
          </Button>
          <QueryDownloadButton selected={checkboxStatuses.current} />
          <table className="result-table"
                 {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {page.map((row, _i) => {
              prepareRow(row);
              return (
                <tr
                  className="query-table-row border"
                  {...row.getRowProps()}
                  key={row.values.text_id}
                  id={row.values.text_id}>
                  {row.cells.map(cell => {
                    return (
                      <td{...cell.getCellProps({
                        className: cell.column.className
                      })}>

                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            </tbody>
          </table>
          <br />
          <TablePagination
            gotoPage={gotoPage}
            previousPage={previousPage}
            canPreviousPage={canPreviousPage}
            nextPage={nextPage}
            canNextPage={canNextPage}
            pageIndex={pageIndex}
            pageOptions={pageOptions}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageCount={pageCount}
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
