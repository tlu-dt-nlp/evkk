import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import { TableType } from '../../components/table/TableDownloadButton';
import { AnalyseContextWithoutMissingData, SetLemmaContext, SetWordContext } from './Contexts';
import { Box, FormControl, InputLabel } from '@mui/material';
import { generateWordExampleCell } from '../../util/TableUtils';
import TableHeaderButtons from '../../components/table/TableHeaderButtons';
import TableAppliedFilters from '../../components/table/TableAppliedFilters';
import TableFilterButton from '../../components/table/TableFilterButton';
import SelectMultiple, { SelectMultipleType } from '../../components/SelectMultiple';
import GenericTable from '../../components/table/GenericTable';

export default function LemmaView() {

  const analyse = useContext(AnalyseContextWithoutMissingData)[0];
  const setLemma = useContext(SetLemmaContext);
  const setWord = useContext(SetWordContext);
  const lemmas = analyse.lemmas;
  const wordtypes = analyse.wordtypes;
  const words = analyse.words;
  const ids = analyse.ids;
  const [col1, setCol1] = useState([]);
  const [filterValue, setFilterValue] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [lemmaFilterPopoverAnchor, setLemmaFilterPopoverAnchor] = useState(null);
  const lemmaFilterPopoverToggle = Boolean(lemmaFilterPopoverAnchor);
  const lemmaFilterPopoverID = lemmaFilterPopoverToggle ? 'lemma-filter-popover' : undefined;
  let lemmaArray = [];

  const { t } = useTranslation();
  const tableToDownload = [t('common_lemma'), t('lemmas_header_wordforms'), t('common_header_frequency'), t('common_header_percentage')];

  const analyseLemmas = () => {
    for (let i = 0; i < lemmas.length; i++) {
      let lemmaIndex = lemmaArray.findIndex(element => element.lemma === lemmas[i]);
      // kui sellist lemmat pole
      if (lemmaIndex === -1) {
        let newLemma = {
          lemma: lemmas[i],
          forms: [{
            form: words[i],
            ids: [ids[i]]
          }],
          count: 1,
          wordtype: wordtypes[i]

        };
        lemmaArray.push(newLemma);
      } else {
        let currentLemma = lemmaArray[lemmaIndex];
        let formIndex = currentLemma.forms.findIndex(element => element.form === words[i]);
        // kui sellist sõnavormi pole
        if (formIndex === -1) {
          let newForm = {
            form: words[i],
            ids: [ids[i]]
          };
          lemmaArray[lemmaIndex].forms.push(newForm);
          lemmaArray[lemmaIndex].count += 1;
        } else {
          lemmaArray[lemmaIndex].forms[formIndex].ids.push(ids[i]);
          lemmaArray[lemmaIndex].count += 1;
        }
      }
    }
    // lemmade sortimine
    lemmaArray.sort((a, b) => (a.count === b.count) ? ((a.lemma > b.lemma) ? -1 : 1) : ((a.count > b.count) ? -1 : 1));
    // vormide sortimine
    for (const element of lemmaArray) {
      element.forms.sort((a, b) => (a.ids.length === b.ids.length) ? ((a.form < b.form) ? -1 : 1) : ((a.ids.length > b.ids.length) ? -1 : 1));
    }
  };

  analyseLemmas();

  function fillData() {
    let tableVal = [];

    for (const element of lemmaArray) {
      let info = {
        col1: '',
        col2: [[], [], [], []],
        col3: 0,
        col4: 0,
        col5: ''
      };
      info.col1 = element.lemma;
      for (let value of element.forms) {
        info.col2[0].push(value.form);
        info.col2[1].push(`(${value.ids.length}), `);
        info.col2[3].push(value.ids[0]);
      }
      info.col5 = element.wordtype;
      info.col3 = element.count;
      info.col2[1][info.col2[1].length - 1] = info.col2[1][info.col2[1].length - 1].slice(0, -2);
      info.col4 = (element.count * 100 / words.length).toFixed(2) + '%';
      tableVal.push(info);
    }
    return tableVal;
  }

  const handlePopoverOpen = event => {
    setLemmaFilterPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setLemmaFilterPopoverAnchor(null);
  };

  function multiSelect(values, label) {
    const handleChange = value => {
      setFilterValue(value);
      setAppliedFilters(value);
      setColumnFilters([{ id: 'col5', value }]);
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
            name="lemma-filter"
            selectedValues={filterValue}
            setSelectedValues={handleChange}
            type={SelectMultipleType.FLAT}
            optionList={values}
            pluralSelectedTranslationKey="select_multiple_types"
          />
        </FormControl>
      </Box>
    );
  }

  const columns = useMemo(() => [
      {
        id: 'algvorm',
        header: t('common_lemma'),
        accessorKey: 'col1',
        cell: info => (
          <span
            className="word"
            onClick={() => setLemma(info.getValue())}
          >
          {info.getValue()}
        </span>
        )
      },
      {
        id: 'sonavormid',
        header: t('lemmas_header_wordforms'),
        accessorKey: 'col2',
        cell: info => generateWordExampleCell(info.getValue(), setWord),
        enableSorting: false
      },
      {
        id: 'sagedus',
        header: t('common_header_frequency'),
        accessorKey: 'col3'
      },
      {
        id: 'protsent',
        header: t('common_header_percentage'),
        accessorKey: 'col4'
      },
      {
        id: 'col5',
        header: t('common_header_percentage'),
        accessorKey: 'col5'
      }
    ],
    [t, setWord, setLemma]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => fillData(), []);

  useEffect(() => {
    let list = [];
    for (const element of data) {
      if (!list.includes(element.col5)) {
        list.push(element.col5);
      }
    }
    setCol1(list);
  }, [data]);

  const renderFilterButton = () => {
    return (
      <TableFilterButton
        popoverId={lemmaFilterPopoverID}
        handlePopoverOpen={handlePopoverOpen}
        popoverToggle={lemmaFilterPopoverToggle}
        popoverAnchorEl={lemmaFilterPopoverAnchor}
        handlePopoverClose={handlePopoverClose}
      >
        {multiSelect(col1.sort(), t('filter_by_word_type'))}
      </TableFilterButton>
    );
  };

  return (
    <Box>
      <TableHeaderButtons
        leftComponent={<TableAppliedFilters appliedFilters={appliedFilters} />}
        rightComponent={renderFilterButton()}
        downloadData={data}
        downloadTableType={TableType.LEMMA_VIEW}
        downloadHeaders={tableToDownload}
        downloadSortByColumnAccessor="col3"
      />
      <GenericTable
        columns={columns}
        data={data}
        sortByColumnId="sagedus"
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        hiddenColumn="col5"
      />
    </Box>
  );
}
