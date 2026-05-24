import './CorrectionDocxDownloadButtonV2.css';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Button, Checkbox, Divider, FormControlLabel, Popover, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../providers/EditorProvider';
import { ToggleButtonCategories } from '../../constants/tabConfig';
import { downloadAsDocx } from '../../utils/exportToDocxV2';
import { DefaultButtonStyle5px } from '../../../../const/StyleConstants';

export default function CorrectionDocxDownloadButtonV2({ tab }) {
  const { t } = useTranslation();

  const { editor, errorResponse, selectedSubTab } = useEditorContext((state) => ({
    editor: state.editor,
    errorResponse: state.errorResponse,
    selectedSubTab: state.selectedSubTab
  }));

  const hasResults = errorResponse && Object.keys(errorResponse).length > 0;

  const availableSubTabs = (ToggleButtonCategories[tab] ?? []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const [includeHeader, setIncludeHeader] = useState(true);

  useEffect(() => {
    if (selectedSubTab) setSelected([selectedSubTab]);
  }, [selectedSubTab]);

  const handleOpen = (e) => {
    if (!hasResults) return;
    setSelected(selectedSubTab ? [selectedSubTab] : []);
    setIncludeHeader(true);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleToggle = (value) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleDownload = () => {
    selected.forEach((subTab) => {
      downloadAsDocx(editor, tab, subTab, errorResponse, t, includeHeader);
    });
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title={t('corrector_download_docx_hover')} placement="top">
        <DownloadIcon
          onClick={handleOpen}
          className={`download-icon${hasResults ? '' : ' disabled'}`}
        />
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box className="download-popover-box">
          <Typography variant="subtitle2" className="download-popover-title">
            {t('corrector_download_select_views')}
          </Typography>
          <Box className="download-checkbox-list">
            {availableSubTabs.map((btn) => (
              <FormControlLabel
                key={btn.value}
                control={
                  <Checkbox
                    size="small"
                    checked={selected.includes(btn.value)}
                    onChange={() => handleToggle(btn.value)}
                  />
                }
                label={t(btn.text)}
              />
            ))}
          </Box>
          <Divider className="download-divider" />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={includeHeader}
                onChange={(e) => setIncludeHeader(e.target.checked)}
              />
            }
            label={t('corrector_download_include_summary')}
          />
          <Button
            sx={DefaultButtonStyle5px}
            variant="contained"
            fullWidth
            disabled={selected.length === 0}
            onClick={handleDownload}
          >
            {t('corrector_download_docx_button')}
          </Button>
        </Box>
      </Popover>
    </>
  );
}
