import { useContext, useEffect, useMemo, useState } from 'react';
import { Box, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import { AnalyseContextWithoutMissingData, SetFormContext, SetTypeContext, SetWordContext } from './Contexts';
import { TableType } from '../../components/table/TableDownloadButton';
import TableHeaderButtons from '../../components/table/TableHeaderButtons';
import TableAppliedFilters from '../../components/table/TableAppliedFilters';
import TableFilterButton from '../../components/table/TableFilterButton';
import SelectMultiple, { SelectMultipleType } from '../../components/SelectMultiple';
import { generateWordExampleCell } from '../../util/TableUtils';
import GenericTable from '../../components/table/GenericTable';

export default function GrammaticalAnalysis() {
  const { t } = useTranslation();
  const setType = useContext(SetTypeContext);
  const setForm = useContext(SetFormContext);
  const setWord = useContext(SetWordContext);
  const analysedInput = useContext(AnalyseContextWithoutMissingData)[0];
  const [filterValue, setFilterValue] = useState({});
  const types = analysedInput.wordtypes;
  const forms = analysedInput.wordforms;
  const words = analysedInput.words;
  const ids = analysedInput.ids;
  const [col1, setCol1] = useState([]);
  const [col2, setCol2] = useState([]);
  const [filtersInUse, setFiltersInUse] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [analyzerFilterPopoverAnchorEl, setAnalyzerFilterPopoverAnchorEl] = useState(null);
  const analyzerFilterPopoverToggle = Boolean(analyzerFilterPopoverAnchorEl);
  const analyzerFilterPopoverID = analyzerFilterPopoverToggle ? 'analyzer-filter-popover' : undefined;
  let wordArray = [];

  const handlePopoverOpen = event => {
    setAnalyzerFilterPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnalyzerFilterPopoverAnchorEl(null);
  };

  function checkFilters(value, column) {
    let list = [];
    for (const element of value) {
      if (column.includes(element)) {
        list.push(element);
      }
    }
    return list;
  }

  function multiSelect(name, values, label, disableValue, translationKey) {
    const handleChange = value => {
      setFilterValue(prev => {
        const next = { ...prev, [name]: value };
        const allFilterValues = Object.values(next).flat();
        setFiltersInUse(allFilterValues);
        setColumnFilters([
          { id: 'col1', value: checkFilters(allFilterValues, col1) },
          { id: 'col2', value: checkFilters(allFilterValues, col2) }
        ]);
        return next;
      });
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
            name={name}
            selectedValues={filterValue[name] || []}
            setSelectedValues={handleChange}
            type={SelectMultipleType.FLAT}
            optionList={values}
            disabled={disableValue}
            pluralSelectedTranslationKey={translationKey}
            onClose={changeFilterOptions}
          />
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

  const columns = useMemo(
    () => [
      {
        id: 'col1',
        header: t('common_wordtype'),
        accessorKey: 'col1',
        cell: info => (
          <span
            className="word"
            onClick={() => setType(info.getValue())}
          >
            {info.getValue()}
          </span>
        )
      },
      {
        id: 'col2',
        header: t('common_form'),
        accessorKey: 'col2',
        cell: info => (
          <span
            className="word"
            onClick={() => setForm(info.getValue())}
          >
            {info.getValue()}
          </span>
        ),
        enableSorting: false
      },
      {
        id: 'tekstisonad',
        header: t('common_words_in_text'),
        accessorKey: 'col3',
        cell: info => generateWordExampleCell(info.getValue(), setWord),
        enableSorting: false
      },
      {
        id: 'sagedus',
        header: t('common_header_frequency'),
        accessorKey: 'col4'
      },
      {
        id: 'protsent',
        header: t('common_header_percentage'),
        accessorKey: 'col5'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setWord]
  );

  const renderFilterButton = () => {
    return (
      <TableFilterButton
        popoverId={analyzerFilterPopoverID}
        handlePopoverOpen={handlePopoverOpen}
        popoverToggle={analyzerFilterPopoverToggle}
        popoverAnchorEl={analyzerFilterPopoverAnchorEl}
        handlePopoverClose={handlePopoverClose}
      >
        {multiSelect(
          'word_type',
          col1.sort(),
          t('filter_by_word_type'),
          false,
          'select_multiple_types'
        )}
        {multiSelect(
          'word_form',
          col2.sort(),
          t('filter_by_word_form'),
          filtersInUse.length === 0,
          'select_multiple_forms'
        )}
      </TableFilterButton>
    );
  };

  return (
    <Box>
      <TableHeaderButtons
        leftComponent={<TableAppliedFilters appliedFilters={filtersInUse} />}
        rightComponent={renderFilterButton()}
        downloadData={data}
        downloadTableType={TableType.GRAMMATICAL_ANALYSIS}
        downloadHeaders={tableToDownload}
        downloadSortByColumnAccessor="col4"
      />
      <GenericTable
        columns={columns}
        data={data}
        sortByColumnId="sagedus"
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
      />
    </Box>
  );
}
