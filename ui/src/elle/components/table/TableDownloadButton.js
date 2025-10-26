import { createRef, useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import ReactExport from 'react-export-excel';
import { CSVLink } from 'react-csv';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import '../styles/TableDownloadButton.css';
import { sortTableDataByCol } from '../../util/TableUtils';
import { DefaultButtonStyle } from '../../const/StyleConstants';

export default function TableDownloadButton({ data, headers, accessors, tableType, sortByColAccessor }) {

  const { t } = useTranslation();
  const ExcelFile = ReactExport.ExcelFile;
  const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
  const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
  const [fileType, setFileType] = useState(false);
  const fileDownloadElement = createRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [modifiedData, setModifiedData] = useState(data);
  const [buttonType, setButtonType] = useState(<Button style={DefaultButtonStyle}
                                                       variant="contained"
                                                       onClick={showButton}>{t('common_download')}</Button>);
  const excelButtonBase = <Button style={DefaultButtonStyle} variant="contained">{t('common_download')}</Button>;

  let csvData = '';
  let tableHeaders = [];

  const handleClick = (event) => {
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

  function setFirstRow() {
    if (tableType === TableType.LEMMA_VIEW && csvData === '') {
      for (const element of modifiedData) {
        element.col1 = element.col1.props.children;
      }
    }
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
    // if sortBy column is given, data is sorted accordingly
    if (sortByColAccessor) {
      const sortedData = sortTableDataByCol(data, sortByColAccessor);
      setModifiedData(sortedData);
    }
    setFirstRow();
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sortByColAccessor]);

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
      setButtonType(<ExcelFile filename={t('gram_anal_filename')}
                               element={excelButtonBase}>
        <ExcelSheet data={modifiedData}
                    name={t('common_excel_sheet_name')}>
          <ExcelColumn label={headers[0]}
                       value="col1" />
          <ExcelColumn label={headers[1]}
                       value="col2" />
          <ExcelColumn label={headers[2]}
                       value={(col) => col.col3[2]} />
          <ExcelColumn label={headers[3]}
                       value="col4" />
          <ExcelColumn label={headers[4]}
                       value="col5" />
        </ExcelSheet>
      </ExcelFile>);
    }
  };

  const lemmaViewButton = () => {
    if (fileType) {
      setButtonType(csvButton('lemmas_filename'));
    } else {
      setButtonType(<ExcelFile filename={t('lemmas_filename')}
                               element={excelButtonBase}>
        <ExcelSheet data={modifiedData}
                    name={t('common_excel_sheet_name')}>
          <ExcelColumn label={headers[0]}
                       value="col1" />
          <ExcelColumn label={headers[1]}
                       value={(col) => col.col2[2]} />
          <ExcelColumn label={headers[2]}
                       value="col3" />
          <ExcelColumn label={headers[3]}
                       value="col4" />
        </ExcelSheet>
      </ExcelFile>);
    }
  };

  const syllablesButton = () => {
    if (fileType) {
      setButtonType(csvButton('syllables_filename'));
    } else {
      setButtonType(<ExcelFile filename={t('syllables_filename')}
                               element={excelButtonBase}>
        <ExcelSheet data={modifiedData}
                    name={t('common_excel_sheet_name')}>
          <ExcelColumn label={headers[0]}
                       value="col1" />
          <ExcelColumn label={headers[1]}
                       value="col2" />
          <ExcelColumn label={headers[2]}
                       value="col3" />
          <ExcelColumn label={headers[3]}
                       value="col4" />
          <ExcelColumn label={headers[4]}
                       value={(col) => col.col5[2]} />
          <ExcelColumn label={headers[5]}
                       value="col6" />
          <ExcelColumn label={headers[6]}
                       value="col7" />
        </ExcelSheet>
      </ExcelFile>);
    }
  };

  const wordlistButton = () => {
    if (fileType) {
      setButtonType(csvButton('wordlist_filename'));
    } else {
      setButtonType(<ExcelFile filename={t('wordlist_filename')}
                               element={excelButtonBase}>
        <ExcelSheet data={modifiedData}
                    name={t('common_excel_sheet_name')}>
          <ExcelColumn label={headers[0]}
                       value="word" />
          <ExcelColumn label={headers[1]}
                       value="frequencyCount" />
          <ExcelColumn label={headers[2]}
                       value="frequencyPercentage" />
        </ExcelSheet>
      </ExcelFile>);
    }
  };

  const wordContextButton = () => {
    if (fileType) {
      setButtonType(csvButton('wordcontext_filename'));
    } else {
      setButtonType(<ExcelFile filename={t('wordcontext_filename')}
                               element={excelButtonBase}>
        <ExcelSheet data={modifiedData}
                    name={t('common_excel_sheet_name')}>
          <ExcelColumn label={headers[0]}
                       value="contextBefore" />
          <ExcelColumn label={headers[1]}
                       value="keyword" />
          <ExcelColumn label={headers[2]}
                       value="contextAfter" />
        </ExcelSheet>
      </ExcelFile>);
    }
  };

  const collocatesButton = () => {
    if (fileType) {
      setButtonType(csvButton('collocates_filename'));
    } else {
      setButtonType(<ExcelFile filename={t('collocates_filename')}
                               element={excelButtonBase}>
        <ExcelSheet data={modifiedData}
                    name={t('common_excel_sheet_name')}>
          <ExcelColumn label={headers[0]}
                       value="collocate" />
          <ExcelColumn label={headers[1]}
                       value="score" />
          <ExcelColumn label={headers[2]}
                       value="coOccurrences" />
          <ExcelColumn label={headers[3]}
                       value="frequencyCount" />
          <ExcelColumn label={headers[4]}
                       value="frequencyPercentage" />
        </ExcelSheet>
      </ExcelFile>);
    }
  };

  useEffect(() => {
    setData();
    showButton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileType, data, headers]);

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
          <DownloadIcon fontSize="large" />
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
          <Box className="download-dialog-inner"
               id="fileDownload"
               ref={fileDownloadElement}>
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
