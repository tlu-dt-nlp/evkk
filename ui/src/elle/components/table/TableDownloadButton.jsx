import { createRef, useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CSVLink } from 'react-csv';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import './styles/TableDownloadButton.css';
import { sortTableDataByColumn } from '../../util/TableUtils';
import { DefaultButtonStyle } from '../../const/StyleConstants';

export const TableType = {
  GRAMMATICAL_ANALYSIS: 'GRAMMATICAL_ANALYSIS',
  LEMMA_VIEW: 'LEMMA_VIEW',
  SYLLABLES: 'SYLLABLES',
  WORDLIST: 'WORDLIST',
  WORD_CONTEXT: 'WORD_CONTEXT',
  COLLOCATES: 'COLLOCATES'
};

const DownloadType = {
  EXCEL: 'Excel',
  CSV: 'CSV'
};

export default function TableDownloadButton({
                                              data,
                                              headers,
                                              accessors,
                                              tableType,
                                              sortByColumnAccessor
                                            }) {

  const { t } = useTranslation();
  const [fileType, setFileType] = useState(false);
  const fileDownloadElement = createRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [modifiedData, setModifiedData] = useState(data);
  const [buttonType, setButtonType] = useState(<Button style={DefaultButtonStyle}
                                                       variant="contained"
                                                       onClick={showButton}>{t('common_download')}</Button>);

  let csvData = '';
  let tableHeaders = [];

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  for (let i = 0; i < headers.length; i++) {
    const key = accessors ? accessors[i] : 'col' + [i + 1];
    tableHeaders.push({ label: headers[i], key: key });
  }

  const setGrammaticalAnalysisData = () => {
    for (const element of modifiedData) {
      let a = '';
      for (let j = 0; j < element.col3[0].length; j++) {
        a += element.col3[0][j] + ' ';
        a += element.col3[1][j];
      }
      element.col3[2] = a;
    }
    csvData = JSON.parse(JSON.stringify(modifiedData));
    for (let i = 0; i < modifiedData.length; i++) {
      csvData[i].col3.splice(0, 2);
    }
  };

  const setLemmaViewData = () => {
    for (const element of modifiedData) {
      let a = '';
      for (let j = 0; j < element.col2[0].length; j++) {
        a += element.col2[0][j] + ' ';
        a += element.col2[1][j];
      }
      element.col2[2] = a;
    }
    csvData = JSON.parse(JSON.stringify(modifiedData));
    for (let i = 0; i < data.length; i++) {
      csvData[i].col2.splice(0, 2);
    }
  };

  const setSyllablesData = () => {
    for (const element of modifiedData) {
      let a = '';
      for (let j = 0; j < element.col5[0].length; j++) {
        a += element.col5[0][j] + ' ';
        a += element.col5[1][j];
      }
      element.col5[2] = a;
    }
    csvData = JSON.parse(JSON.stringify(modifiedData));
    for (let i = 0; i < modifiedData.length; i++) {
      csvData[i].col5.splice(0, 2);
    }
  };

  useEffect(() => {
    const newData = sortByColumnAccessor
      ? sortTableDataByColumn(data, sortByColumnAccessor)
      : data;
    setModifiedData(newData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sortByColumnAccessor]);

  function setData() {
    if (tableType === TableType.GRAMMATICAL_ANALYSIS) {
      setGrammaticalAnalysisData();
    } else if (tableType === TableType.LEMMA_VIEW) {
      setLemmaViewData();
    } else if (tableType === TableType.SYLLABLES) {
      setSyllablesData();
    } else if (tableType === TableType.WORDLIST || tableType === TableType.WORD_CONTEXT || tableType === TableType.COLLOCATES) {
      csvData = JSON.parse(JSON.stringify(modifiedData));
    }
  }

  function exportToExcel(filename, sheetName, data, columns) {
    const worksheetData = [
      columns.map(col => col.label),
      ...data.map(row => columns.map(col => {
        if (typeof col.value === 'function') {
          return col.value(row);
        }
        return row[col.value];
      }))
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, filename + '.xlsx');
  }

  function csvButton(filename) {
    return (
      <Button style={DefaultButtonStyle}
              variant="contained">
        <CSVLink filename={t(filename)}
                 className="csvLink"
                 headers={tableHeaders}
                 data={csvData}>{t('common_download')}</CSVLink>
      </Button>
    );
  }

  function excelButton(filename, columns) {
    return (
      <Button
        style={DefaultButtonStyle}
        variant="contained"
        onClick={() => exportToExcel(t(filename), t('common_excel_sheet_name'), modifiedData, columns)}
      >
        {t('common_download')}
      </Button>
    );
  }

  function showButton() {
    switch (tableType) {
      case TableType.GRAMMATICAL_ANALYSIS:
        grammaticalAnalysisButton();
        break;
      case TableType.LEMMA_VIEW:
        lemmaViewButton();
        break;
      case TableType.SYLLABLES:
        syllablesButton();
        break;
      case TableType.WORDLIST:
        wordlistButton();
        break;
      case TableType.WORD_CONTEXT:
        wordContextButton();
        break;
      case TableType.COLLOCATES:
        collocatesButton();
        break;
      default:
        console.error('Unrecognized table type for downloading!');
    }
  }

  const grammaticalAnalysisButton = () => {
    if (fileType) {
      setButtonType(csvButton('gram_anal_filename'));
    } else {
      const columns = [
        { label: headers[0], value: 'col1' },
        { label: headers[1], value: 'col2' },
        { label: headers[2], value: (col) => col.col3[2] },
        { label: headers[3], value: 'col4' },
        { label: headers[4], value: 'col5' }
      ];
      setButtonType(excelButton('gram_anal_filename', columns));
    }
  };

  const lemmaViewButton = () => {
    if (fileType) {
      setButtonType(csvButton('lemmas_filename'));
    } else {
      const columns = [
        { label: headers[0], value: 'col1' },
        { label: headers[1], value: (col) => col.col2[2] },
        { label: headers[2], value: 'col3' },
        { label: headers[3], value: 'col4' }
      ];
      setButtonType(excelButton('lemmas_filename', columns));
    }
  };

  const syllablesButton = () => {
    if (fileType) {
      setButtonType(csvButton('syllables_filename'));
    } else {
      const columns = [
        { label: headers[0], value: 'col1' },
        { label: headers[1], value: 'col2' },
        { label: headers[2], value: 'col3' },
        { label: headers[3], value: 'col4' },
        { label: headers[4], value: (col) => col.col5[2] },
        { label: headers[5], value: 'col6' },
        { label: headers[6], value: 'col7' }
      ];
      setButtonType(excelButton('syllables_filename', columns));
    }
  };

  const wordlistButton = () => {
    if (fileType) {
      setButtonType(csvButton('wordlist_filename'));
    } else {
      const columns = [
        { label: headers[0], value: 'word' },
        { label: headers[1], value: 'frequencyCount' },
        { label: headers[2], value: 'frequencyPercentage' }
      ];
      setButtonType(excelButton('wordlist_filename', columns));
    }
  };

  const wordContextButton = () => {
    if (fileType) {
      setButtonType(csvButton('wordcontext_filename'));
    } else {
      const columns = [
        { label: headers[0], value: 'contextBefore' },
        { label: headers[1], value: 'keyword' },
        { label: headers[2], value: 'contextAfter' }
      ];
      setButtonType(excelButton('wordcontext_filename', columns));
    }
  };

  const collocatesButton = () => {
    if (fileType) {
      setButtonType(csvButton('collocates_filename'));
    } else {
      const columns = [
        { label: headers[0], value: 'collocate' },
        { label: headers[1], value: 'score' },
        { label: headers[2], value: 'coOccurrences' },
        { label: headers[3], value: 'frequencyCount' },
        { label: headers[4], value: 'frequencyPercentage' }
      ];
      setButtonType(excelButton('collocates_filename', columns));
    }
  };

  useEffect(() => {
    setData();
    showButton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileType, modifiedData, headers]);

  async function itemClickTrue() {
    await setFileType(true);
  }

  async function itemClickFalse() {
    await setFileType(false);
  }

  return (
    <Box>
      <Tooltip
        title={t('common_download')}
        placement="top"
      >
        <Button
          style={DefaultButtonStyle}
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
        >
          <DownloadIcon />
        </Button>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Box className="download-dialog">
          <Box
            className="download-dialog-inner"
            id="fileDownload"
            ref={fileDownloadElement}
          >
            <FormControl fullWidth>
              <InputLabel>{t('common_download')}</InputLabel>
              <Select
                size="medium"
                defaultValue={DownloadType.EXCEL}
              >
                <MenuItem value={DownloadType.EXCEL}
                          onClick={itemClickFalse}>Excel</MenuItem>
                <MenuItem value={DownloadType.CSV}
                          onClick={itemClickTrue}>CSV</MenuItem>
              </Select>
            </FormControl>
            <div style={{ marginTop: '0.75rem' }}>{buttonType}</div>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
