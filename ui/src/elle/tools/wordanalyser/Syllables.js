import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import { TableType } from '../../components/table/TableDownloadButton';
import { AnalyseContextWithoutMissingData, SetSyllableContext, SetSyllableWordContext } from './Contexts';
import { Box, FormControl, InputLabel } from '@mui/material';
import ToggleCell from './ToggleCell';
import TableHeaderButtons from '../../components/table/TableHeaderButtons';
import TableAppliedFilters from '../../components/table/TableAppliedFilters';
import TableFilterButton from '../../components/table/TableFilterButton';
import SelectMultiple, { SelectMultipleType } from '../../components/SelectMultiple';
import GenericTable from '../../components/table/GenericTable';

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
  const [columnFilters, setColumnFilters] = useState([]);
  const tableToDownload = [t('syllables_header_syllable'), t('syllables_table_beginning'), t('syllables_table_middle'), t('syllables_table_end'), t('common_words_in_text'), t('common_header_frequency'), t('common_header_percentage')];
  const [syllableFilterPopoverAnchor, setSyllableFilterPopoverAnchor] = useState(null);
  const syllableFilterPopoverToggle = Boolean(syllableFilterPopoverAnchor);
  const syllableFilterPopoverID = syllableFilterPopoverToggle ? 'syllable-filter-popover' : undefined;

  useEffect(() => {
    const baseSyllables = [];
    const syllables = [];
    const infoList = [];
    const formattedSyllables = [];

    const createList = (value) => {
      const cleanValue = value.toLowerCase();
      const tempSyllables = cleanValue.split('-');
      baseSyllables.push(tempSyllables);
    };

    const createSyllableList = () => {
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
    };

    const findDuplicates = () => {
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
    };

    const formating = () => {
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
          'silp': row[0],
          'algus': row[1],
          'keskel': row[2],
          'l6pp': row[3],
          'sagedus': row[1] + row[2] + row[3],
          'sonadtekstis': syllableWords(),
          'osakaal': ((row[1] + row[2] + row[3]) * 100 / syllables.length).toFixed(2) + '%'
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
    };

    data.forEach(value => createList(value));
    createSyllableList();
    findDuplicates();
    formating();
  }, [data, len, words, setSyllableWord]);

  const handlePopoverOpen = event => {
    setSyllableFilterPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setSyllableFilterPopoverAnchor(null);
  };

  function multiSelect(values, label) {
    const handleChange = value => {
      setFilterValue(value);
      setAppliedFilters(value);
      setColumnFilters([{ id: 'col2', value }]);
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
          <SelectMultiple
            name="syllable-filter"
            selectedValues={filterValue}
            setSelectedValues={handleChange}
            type={SelectMultipleType.FLAT}
            optionList={values}
            enableFullRenderValue
          />
        </FormControl>
      </Box>
    );
  }

  const COLUMNS = [
    {
      id: 'silp',
      header: t('syllables_header_syllable'),
      accessorKey: 'silp',
      cell: info => (
        <span
          className="word"
          onClick={() => setSyllable(info.getValue())}
        >
          {info.getValue()}
        </span>
      )
    },
    {
      id: 'col2',
      header: t('syllables_header_syllable_position'),
      accessorFn: el => {
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
      enableSorting: false
    },
    {
      id: 'sonadtekstis',
      header: t('common_words_in_text'),
      accessorKey: 'sonadtekstis',
      cell: info => info.getValue(),
      enableSorting: false
    },
    {
      id: 'sagedus',
      header: t('common_header_frequency'),
      accessorKey: 'sagedus'
    },
    {
      id: 'protsent',
      header: t('common_header_percentage'),
      accessorKey: 'osakaal'
    }
  ];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(() => COLUMNS, []);

  const renderFilterButton = () => {
    return (
      <TableFilterButton
        popoverId={syllableFilterPopoverID}
        handlePopoverOpen={handlePopoverOpen}
        popoverToggle={syllableFilterPopoverToggle}
        popoverAnchorEl={syllableFilterPopoverAnchor}
        handlePopoverClose={handlePopoverClose}
      >
        {multiSelect(col2, t('filter_by_syllable_position'))}
      </TableFilterButton>
    );
  };

  return (
    <Box>
      <TableHeaderButtons
        leftComponent={<TableAppliedFilters appliedFilters={appliedFilters} />}
        rightComponent={renderFilterButton()}
        downloadData={infoListNew}
        downloadTableType={TableType.SYLLABLES}
        downloadHeaders={tableToDownload}
        downloadSortByColumnAccessor="col6"
      />
      <GenericTable
        columns={columns}
        data={formattedList}
        sortByColumnId="sagedus"
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
      />
    </Box>
  );
}
