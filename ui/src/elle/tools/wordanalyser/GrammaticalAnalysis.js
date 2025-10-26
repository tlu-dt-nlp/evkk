import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import './styles/GrammaticalAnalysis.css';
import TablePagination from '../../components/table/TablePagination';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import { AnalyseContextWithoutMissingData, SetFormContext, SetTypeContext, SetWordContext } from './Contexts';
import ToggleCell from './ToggleCell';
import { TableType } from '../../components/table/TableDownloadButton';
import TableHeaderButtons from '../../components/table/TableHeaderButtons';
import TableAppliedFilters from '../../components/table/filter/TableAppliedFilters';
import TableFilterButton from '../../components/table/filter/TableFilterButton';

export default function GrammaticalAnalysis() {
  const { t } = useTranslation();
  const setType = useContext(SetTypeContext);
  const setForm = useContext(SetFormContext);
  const setWord = useContext(SetWordContext);
  const analysedInput = useContext(AnalyseContextWithoutMissingData)[0];
  const [filterValue, setFilterValue] = useState([]);
  const types = analysedInput.wordtypes;
  const forms = analysedInput.wordforms;
  const words = analysedInput.words;
  const ids = analysedInput.ids;
  const [col1, setCol1] = useState([]);
  const [col2, setCol2] = useState([]);
  const [filtersInUse, setFiltersInUse] = useState([]);
  const [analyzerFilterPopoverAnchorEl, setAnalyzerFilterPopoverAnchorEl] = useState(null);
  const analyzerFilterPopoverToggle = Boolean(analyzerFilterPopoverAnchorEl);
  const analyzerFilterPopoverID = analyzerFilterPopoverToggle ? 'analyzer-filter-popover' : undefined;
  let wordArray = [];

  const handlePopoverOpen = (event) => {
    setAnalyzerFilterPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnalyzerFilterPopoverAnchorEl(null);
  };

  function checkFilters(filter1, filter2) {
    let list = [];
    for (const element of filter1) {
      if (filter2.includes(element)) {
        list.push(element);
      }
    }
    return list;
  }

  function multiSelectFilter(rows, columnIds, filterValue) {
    return filterValue.length === 0
      ? rows
      : rows.filter((row) =>
        filterValue.includes(String(row.original[columnIds]))
      );
  }

  function multiSelect(values, label, disableValue) {
    const handleChange = (event) => {
      const value = event.target.value;
      setFilterValue(value);
      setFiltersInUse(value);
      setAllFilters([{ id: 'col1', value: checkFilters(value, col1) }, {
        id: 'col2',
        value: checkFilters(value, col2)
      }]);
    };
    return (
      <Box marginY="5px">
        <FormControl
          size="small"
          className="filter-class"
        >
          <InputLabel>
            {label}
          </InputLabel>
          <Select
            multiple
            value={filterValue}
            onChange={handleChange}
            disabled={disableValue}
            onClose={changeFilterOptions}
          >
            {values.map((value) => (
              <MenuItem
                key={value}
                value={value}
              >
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  const analyseInput = () => {
    for (let i = 0; i < words.length; i++) {
      let typeIndex = wordArray.findIndex(
        element => element.type === types[i] && element.form === forms[i]
      );
      // kui ei ole sama sõnaliigi ja -tüübiga objekti
      if (typeIndex === -1) {
        let content = {
          type: types[i],
          form: forms[i],
          words: [{
            word: words[i],
            ids: [ids[i]]
          }],
          count: 1
        };
        wordArray.push(content);
      } else {
        let wordIndex = wordArray[typeIndex].words.findIndex(element => element.word === words[i]);
        if (wordIndex === -1) {
          let newWord = {
            word: words[i],
            ids: [ids[i]]
          };
          wordArray[typeIndex].words.push(newWord);
          wordArray[typeIndex].count += 1;
        } else {
          wordArray[typeIndex].count += 1;
          wordArray[typeIndex].words[wordIndex].ids.push(ids[i]);
        }
      }
    }
    // liigi ja tüübi sortimine
    wordArray.sort((a, b) => (a.count === b.count) ? ((a.type > b.type) ? -1 : 1) : ((a.count > b.count) ? -1 : 1));
    // sõnade sortimine
    for (const element of wordArray) {
      element.words.sort((a, b) => (a.ids.length === b.ids.length) ? ((a.word < b.word) ? -1 : 1) : ((a.ids.length > b.ids.length) ? -1 : 1));
    }
  };

  analyseInput();
  const tableToDownload = [t('common_wordtype'), t('common_form'), t('common_words_in_text'), t('common_header_frequency'), t('common_header_percentage')];

  function fillData() {
    let tableVal = [];
    for (const element of wordArray) {
      let info = {
        col1: '',
        col2: '',
        col3: [[], [], [], []],
        col4: 0,
        col5: 0
      };
      info.col1 = element.type;
      info.col2 = element.form;
      for (let value of element.words) {
        info.col3[0].push(value.word);
        info.col3[1].push('(' + value.ids.length + '), ');
        info.col3[3].push(value.ids[0]);
      }
      info.col3[1][info.col3[1].length - 1] = info.col3[1][info.col3[1].length - 1].slice(0, -2);
      info.col4 = element.count;
      info.col5 = (element.count * 100 / words.length).toFixed(1) + '%';
      tableVal.push(info);
    }
    return tableVal;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  let data = useMemo(() => fillData(), []);

  useEffect(() => {
    let list = [];
    let list2 = [];
    for (const element of data) {
      if (!list.includes(element.col1)) {
        list.push(element.col1);
      }
      if (!list2.includes(element.col2)) {
        list2.push(element.col2);
      }
    }
    setCol1(list);
    setCol2(list2);
  }, [data]);

  function changeFilterOptions() {
    let list = [];
    for (const element of data) {
      if (filtersInUse.includes(element.col1)) {
        list.push(element.col2);
      }
    }
    setCol2(list);
  }

  function handleTypeClick(e) {
    setType(e);
  }

  function handleFormClick(e) {
    setForm(e);
  }

  const columns = useMemo(
    () => [
      {
        Header: () => {
          return (<span>{t('common_wordtype')}</span>);
        },
        accessor: 'col1', // accessor is the "key" in the data
        id: 'col1',
        Cell: (props) => {
          const word = props.value;
          return (
            <span key={props.id}
                  className="word"
                  onClick={() => handleTypeClick(word)}>{word}</span>
          );
        },
        filter: multiSelectFilter,
        className: 'user',
        width: 400
      },
      {
        Header: () => {
          return (<span>{t('common_form')}</span>);
        },
        accessor: 'col2',
        id: 'col2',
        Cell: (props) => {
          const word = props.value;
          return (
            <span className="word"
                  onClick={() => handleFormClick(word)}>{word}</span>
          );
        },
        filter: multiSelectFilter,
        width: 400,
        className: 'col2',
        disableSortBy: true,
        sortable: false
      },
      {
        Header: t('common_words_in_text'),
        id: 'tekstisonad',
        accessor: 'col3',
        Cell: (props) => {
          const items = props.value;
          let cellContent = [];
          for (let i = 0; i < items[0].length; i++) {
            let word = items[0][i];
            let count = items[1][i];
            let id = items[3][i];
            let content = (
              <span key={id}>
                <span key={props.id}
                      className="word"
                      onClick={() => setWord(id)}>{word}
                </span>
                {String.fromCharCode(160)}{count}
              </span>
            );
            cellContent.push(content);
          }
          return <ToggleCell onCellContent={cellContent} />;
        },
        width: 700,
        disableFilters: true,
        disableSortBy: true,
        sortable: false
      },
      {
        Header: t('common_header_frequency'),
        id: 'sagedus',
        accessor: 'col4', // accessor is the "key" in the data
        width: 300,
        disableFilters: true
      },
      {
        Header: t('common_header_percentage'),
        id: 'protsent',
        accessor: 'col5',
        width: 300,
        disableFilters: true
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setWord]
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
    setAllFilters,
    state: { pageIndex, pageSize }
  } = useTable({
    columns, data, initialState: {
      sortBy: [
        {
          id: 'sagedus',
          desc: true
        }
      ]
    }
  }, useFilters, useSortBy, usePagination);

  const renderFilterButton = () => {
    return (
      <TableFilterButton
        popoverId={analyzerFilterPopoverID}
        handlePopoverOpen={handlePopoverOpen}
        popoverToggle={analyzerFilterPopoverToggle}
        popoverAnchorEl={analyzerFilterPopoverAnchorEl}
        handlePopoverClose={handlePopoverClose}
      >
        {multiSelect(col1.sort(), t('filter_by_word_type'), false)}
        {multiSelect(col2.sort(), t('filter_by_word_form'), filtersInUse.length === 0)}
      </TableFilterButton>
    );
  };

  return (
    <Box>
      <TableHeaderButtons leftComponent={<TableAppliedFilters appliedFilters={filtersInUse} />}
                          rightComponent={renderFilterButton()}
                          downloadData={data}
                          downloadTableType={TableType.GRAMMATICAL_ANALYSIS}
                          downloadHeaders={tableToDownload}
                          downloadSortByColAccessor={'col4'} />
      <table className="analyserTable" {...getTableProps()}>
        <thead>
        {headerGroups.map(headerGroup => (
          <tr className="tableRow" {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th className="tableHead" key={column.id}>
                {<span>{column.render('Header')}</span>}
                <span className="sortIcon" {...column.getHeaderProps(column.getSortByToggleProps({ title: '' }))}>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' ▼'
                        : ' ▲'
                      : ' ▼▲'}
                  </span>
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {page.map((row, _i) => {
          prepareRow(row);
          return (
            <tr className="tableRow" {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      width: cell.column.width
                    }}
                    className="border tableData"
                  >
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
        </tbody>
      </table>
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
    </Box>
  );
}
