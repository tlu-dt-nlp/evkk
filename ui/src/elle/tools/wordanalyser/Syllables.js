import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import './styles/Syllables.css';
import TablePagination from '../../components/table/TablePagination';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import { TableType } from '../../components/table/TableDownloadButton';
import { AnalyseContextWithoutMissingData, SetSyllableContext, SetSyllableWordContext } from './Contexts';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ToggleCell from './ToggleCell';
import TableHeaderButtons from '../../components/table/TableHeaderButtons';
import TableAppliedFilters from '../../components/table/filter/TableAppliedFilters';
import TableFilterButton from '../../components/table/filter/TableFilterButton';

export default function Syllables() {

  const analyse = useContext(AnalyseContextWithoutMissingData)[0];
  const setSyllable = useContext(SetSyllableContext);
  const setSyllableWord = useContext(SetSyllableWordContext);
  const data = analyse.syllables;
  const len = data.length;
  const words = analyse.words;
  const { t } = useTranslation();
  const [infoListNew, setInfoListNew] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [formattedList, setFormattedList] = useState([]);
  const col2 = [t('beginning'), t('middle'), t('end')];
  const [appliedFilters, setAppliedFilters] = useState([]);
  const tableToDownload = [t('syllables_header_syllable'), t('syllables_table_beginning'), t('syllables_table_middle'), t('syllables_table_end'), t('common_words_in_text'), t('common_header_frequency'), t('common_header_percentage')];
  const [syllableFilterPopoverAnchor, setSyllableFilterPopoverAnchor] = useState(null);
  const syllableFilterPopoverToggle = Boolean(syllableFilterPopoverAnchor);
  const syllableFilterPopoverID = syllableFilterPopoverToggle ? 'syllable-filter-popover' : undefined;

  let baseSyllables = [];
  let syllables = [];
  let infoList = [];
  let formattedSyllables = [];

  const handlePopoverOpen = (event) => {
    setSyllableFilterPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setSyllableFilterPopoverAnchor(null);
  };

  function multiSelectFilter(rows, columnIds, filterValue) {
    return filterValue.length === 0
      ? rows
      : rows.filter((row) =>
        filterValue.some(substring => row.values[columnIds].includes(substring))
      );
  }

  function multiSelect(values, label) {
    const handleChange = (event) => {
      const value = event.target.value;
      setFilterValue(value);
      setAppliedFilters(value);
      setFilter('col2', value);
    };

    return (
      <Box marginY="5px">
        <FormControl
          className="filter-class"
          size="small"
        >
          <InputLabel>
            {label}
          </InputLabel>
          <Select
            multiple
            value={filterValue}
            onChange={handleChange}
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

  function createList(value) {
    const cleanValue = value.toLowerCase();
    const tempSyllables = cleanValue.split('-');
    baseSyllables.push(tempSyllables);
  }

  function createSyllableList() {
    for (let i = 0; i < len; i++) {
      for (let y = 0; y < baseSyllables[i].length; y++) {
        let tempSyllables = [];
        if (y === 0) {
          let syllableLocation = 'algus';
          tempSyllables.push(baseSyllables[i][y], syllableLocation, data[i], words[i]);
        } else if (y === baseSyllables[i].length - 1) {
          let syllableLocation = 'l6pp';
          tempSyllables.push(baseSyllables[i][y], syllableLocation, data[i], words[i]);
        } else {
          let syllableLocation = 'keskmine';
          tempSyllables.push(baseSyllables[i][y], syllableLocation, data[i], words[i]);
        }
        syllables.push(tempSyllables);
      }
    }
    syllables.sort();
  }

  function findDuplicates() {
    for (let i = 0; i < syllables.length; i++) {
      let tempList = [];
      let syllableList = [[], []];
      let count = 0;
      let listCounter = [0, 0, 0];

      if (syllables[i][1] === 'algus') {
        listCounter[0] = listCounter[0] + 1;
      } else if (syllables[i][1] === 'keskmine') {
        listCounter[1] = listCounter[1] + 1;
      } else if (syllables[i][1] === 'l6pp') {
        listCounter[2] = listCounter[2] + 1;
      }

      for (const element of data) {
        if (element === syllables[i][2]) {
          count++;
        }
      }

      if (!syllableList[0].includes(syllables[i][2])) {
        syllableList[0].push(syllables[i][2]);
        syllableList[1].push(count);
      }

      tempList.push(syllables[i][0]);
      if (syllables[i][0] === syllables?.[i + 1]?.[0]) {
        while (syllables[i][0] === syllables?.[i + 1]?.[0]) {
          count = 0;
          if (!syllableList[0].includes(syllables[i + 1][2])) {
            syllableList[0].push(syllables[i + 1][2]);
            for (const element of data) {
              if (element === syllables[i + 1][2]) {
                count++;
              }
            }
            syllableList[1].push(count);
          }

          if (syllables[i + 1][1] === 'algus') {
            listCounter[0] = listCounter[0] + 1;
          } else if (syllables[i + 1][1] === 'keskmine') {
            listCounter[1] = listCounter[1] + 1;
          } else if (syllables[i + 1][1] === 'l6pp') {
            listCounter[2] = listCounter[2] + 1;
          }
          // this assignment is necessary!
          i++;
        }
      }
      tempList.push(listCounter[0], listCounter[1], listCounter[2], syllableList);
      formattedSyllables.push(tempList);
    }
  }

  function formating() {
    let output = formattedSyllables.map((row) => {
      let cellContent = [];
      let info = {
        col1: '',
        col2: 0,
        col3: 0,
        col4: 0,
        col5: [[], []],
        col6: 0,
        col7: 0
      };

      info.col1 = row[0];
      info.col2 = row[1];
      info.col3 = row[2];
      info.col4 = row[3];
      info.col6 = row[1] + row[2] + row[3];
      info.col7 = ((row[1] + row[2] + row[3]) * 100 / syllables.length).toFixed(2);

      const syllableWords = () => {
        for (let i = 0; i < row[4][0].length; i++) {
          let word = row[4][0][i];
          let count = row[4][1][i];
          info.col5[0].push(row[4][0][i]);
          if (i === row[4][0].length - 1) {
            info.col5[1].push(`(${row[4][1][i]})`);
            cellContent.push(
              <span key={word}>
                <span key={`${word}_sub`}
                      className="word"
                      onClick={(e) => setSyllableWord(e.target.textContent)}>
                  {word}
                </span>
                &nbsp;({count})
              </span>);
          } else {
            info.col5[1].push(`(${row[4][1][i]}), `);
            cellContent.push(
              <span key={word}>
                <span key={`${word}_sub`}
                      className="word"
                      onClick={(e) => setSyllableWord(e.target.textContent)}>
                  {word}
                </span>
                &nbsp;({count}),{' '}
              </span>);
          }
        }
        return <ToggleCell onCellContent={cellContent} />;
      };

      infoList.push(info);
      return {
        'silp': <span className="word"
                      onClick={(e) => setSyllable(e.target.textContent)}>{row[0]}</span>,
        'algus': row[1], 'keskel': row[2], 'l6pp': row[3], 'sagedus': row[1] + row[2] + row[3],
        'sonadtekstis': syllableWords(),
        'osakaal': ((row[1] + row[2] + row[3]) * 100 / syllables.length).toFixed(2)
      };
    });

    for (const element of output) {
      if (!element.algus) {
        delete element.algus;
      }
      if (element.keskel === 0) {
        delete element.keskel;
      }
      if (element['l6pp'] === 0) {
        delete element['l6pp'];
      }
    }
    setInfoListNew(infoList);
    setFormattedList(output);
  }

  // TABELI OSA
  const COLUMNS = [
    {
      Header: t('syllables_header_syllable'),
      id: 'silp',
      accessor: 'silp',
      width: 200
    },
    {
      Header: t('syllables_header_location'),
      id: 'col2',
      accessor: el => {
        let display = '';
        if (el.algus) {
          display += `${t('syllables_beginning')} (${el.algus}), `;
        }
        if (el.keskel) {
          display += `${t('syllables_middle')} (${el.keskel}), `;
        }
        if (el.l6pp) {
          display += `${t('syllables_end')} (${el.l6pp}), `;
        }
        display = display.slice(0, -2);
        return display;
      },
      filter: multiSelectFilter,
      disableSortBy: true,
      width: 400,
      className: 'col2'
    },
    {
      Header: t('common_words_in_text'),
      id: 'sonadtekstis',
      accessor: 'sonadtekstis',
      width: 700,
      disableSortBy: true,
      sortable: false
    },
    {
      Header: t('common_header_frequency'),
      id: 'sagedus',
      accessor: 'sagedus',
      width: 300
    },
    {
      Header: t('common_header_percentage'),
      id: 'protsent',
      accessor: 'osakaal',
      width: 300
    }
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => COLUMNS, []);
  const tableInstance = useTable({
    columns: columns,
    data: formattedList,
    initialState: {
      sortBy: [
        {
          id: 'sagedus',
          desc: true
        }
      ]
    }
  }, useFilters, useSortBy, usePagination);

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
    setFilter,
    state: { pageIndex, pageSize }
  } = tableInstance;

  const renderFilterButton = () => {
    return (
      <TableFilterButton
        popoverId={syllableFilterPopoverID}
        handlePopoverOpen={handlePopoverOpen}
        popoverToggle={syllableFilterPopoverToggle}
        popoverAnchorEl={syllableFilterPopoverAnchor}
        handlePopoverClose={handlePopoverClose}
      >
        {multiSelect(col2, t('filter_by_word_form'))}
      </TableFilterButton>
    );
  };

  return (
    <Box>
      {data.map((value, _i) => {
        return createList(value);
      })}
      {createSyllableList()}
      {findDuplicates()}
      {useEffect(() => {
        formating();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])}
      <TableHeaderButtons leftComponent={<TableAppliedFilters appliedFilters={appliedFilters} />}
                          rightComponent={renderFilterButton()}
                          downloadData={infoListNew}
                          downloadTableType={TableType.SYLLABLES}
                          downloadHeaders={tableToDownload}
                          downloadSortByColAccessor={'col6'} />
      <table className="analyserTable" {...getTableProps()}>
        <thead>
        {headerGroups.map((headerGroup) => (
          <tr className="tableRow" {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                key={column.id}
                style={{
                  borderBottom: '1px solid',
                  color: 'black',
                  fontWeight: 'bold'
                }}
                className="tableHdr headerbox">{column.render('Header')}
                <span className="sort" {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ' ▼▲'}
                                    </span>
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {
          page.map((row) => {
            prepareRow(row);
            return (
              <tr className="tableRow" {...row.getRowProps()}>
                {
                  row.cells.map(cell => {
                    return (
                      <td className="tableData" {...cell.getCellProps()}
                          style={{
                            padding: '10px',
                            width: cell.column.width
                          }}>{cell.render('Cell')}</td>
                    );
                  })
                }
              </tr>
            );
          })
        }
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
