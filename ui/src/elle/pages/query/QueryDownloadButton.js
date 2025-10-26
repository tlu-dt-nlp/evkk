import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import Popover from '@mui/material/Popover';
import { useTranslation } from 'react-i18next';
import './styles/QueryDownloadButton.css';
import { useState } from 'react';
import i18n from 'i18next';
import { CC_BY_4_0_LICENSE_PATH } from '../../const/PathConstants';
import NewTabHyperlink from '../../components/NewTabHyperlink';
import { Languages } from '../../translations/i18n';
import { DefaultButtonStyle } from '../../const/StyleConstants';
import { useDownloadQueryResults } from '../../hooks/service/TextService';
import FileSaver from 'file-saver';

export default function QueryDownloadButton({ selected }) {
  const [downloadForm, setDownloadForm] = useState(FileDownloadForm.BASIC_TEXT);
  const [downloadFileType, setDownloadFileType] = useState(FileDownloadType.SINGLE_FILE);
  const [anchorEl, setAnchorEl] = useState(null);
  const optionsDialogOpen = Boolean(anchorEl);
  const { downloadQueryResults } = useDownloadQueryResults();
  const { t } = useTranslation();

  const handleOptionsDialogOpenButtonClick = (event) => {
    setDownloadForm(FileDownloadForm.BASIC_TEXT);
    setDownloadFileType(FileDownloadType.SINGLE_FILE);
    setAnchorEl(event.currentTarget);
  };

  const handleOptionsDialogClose = () => {
    setAnchorEl(null);
  };

  const changeDownloadForm = (event) => {
    setDownloadForm(event.target.value);
  };

  const changeDownloadFileType = (event) => {
    setDownloadFileType(event.target.value);
  };

  const downloadTexts = () => {
    const fileName = i18n.language === Languages.ESTONIAN ? 'tekstid' : 'texts';
    const fileExtension =
      downloadFileType === FileDownloadType.SINGLE_FILE
        ? downloadForm === FileDownloadForm.ANNOTATE_TEI
          ? 'xml'
          : 'txt'
        : 'zip';

    downloadQueryResults(downloadForm, downloadFileType, selected)
      .then(response => FileSaver.saveAs(response, `${fileName}.${fileExtension}`));
  };

  return (
    <span className="query-download-button-span">
      <Tooltip
        title={t('common_download')}
        placement="top"
      >
        <Button
          sx={DefaultButtonStyle}
          variant="contained"
          disabled={selected.size === 0}
          className="query-download-modal-button"
          onClick={handleOptionsDialogOpenButtonClick}
        >
          <DownloadIcon fontSize="medium" />
        </Button>
      </Tooltip>
      <Popover
        open={optionsDialogOpen}
        anchorEl={anchorEl}
        onClose={handleOptionsDialogClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Box className="query-download-dialog">
          <Box className="download-dialog-inner" id="fileDownload">
            <FormControl fullWidth>
              <InputLabel>
                {t('query_download_form')}
              </InputLabel>
              <Select
                size="medium"
                defaultValue={FileDownloadForm.BASIC_TEXT}
                onChange={changeDownloadForm}
              >
                <MenuItem value={FileDownloadForm.BASIC_TEXT}>{t('query_download_basictext')}</MenuItem>
                <MenuItem value={FileDownloadForm.ANNOTATE_TEI}>{t('query_download_tei')}</MenuItem>
                <MenuItem value={FileDownloadForm.ANNOTATE_STANZA_CONLLU}>{t('query_download_stanza')}</MenuItem>
                <MenuItem value={FileDownloadForm.ANNOTATE_ESTNLTK}>{t('query_download_vislcg3')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl className="query-download-modal-radio-group">
              <RadioGroup defaultValue={FileDownloadType.SINGLE_FILE} onChange={changeDownloadFileType}>
                <FormControlLabel
                  value={FileDownloadType.SINGLE_FILE}
                  control={<Radio />}
                  label={t('query_download_single_file')}
                />
                <FormControlLabel
                  value={FileDownloadType.ZIP_FILE}
                  control={<Radio />}
                  label={t('query_download_zip')}
                />
              </RadioGroup>
            </FormControl>
            <div className="download-license-and-button">
              {t('query_download_license')}&nbsp;
              <NewTabHyperlink path={CC_BY_4_0_LICENSE_PATH}
                               content={t('common_license_cc_by_4_0')} />
            </div>
            <div className="download-license-and-button">
              <Button
                onClick={downloadTexts}
                sx={DefaultButtonStyle}
                variant="contained"
              >
                {t('common_download')}
              </Button>
            </div>
          </Box>
        </Box>
      </Popover>
    </span>
  );
}

const FileDownloadType = {
  SINGLE_FILE: 'SINGLE_FILE',
  ZIP_FILE: 'ZIP'
};

const FileDownloadForm = {
  BASIC_TEXT: 'BASIC_TEXT',
  ANNOTATE_STANZA_CONLLU: 'ANNOTATE_STANZA_CONLLU',
  ANNOTATE_ESTNLTK: 'ANNOTATE_ESTNLTK',
  ANNOTATE_TEI: 'ANNOTATE_TEI'
};
