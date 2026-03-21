import { useState } from 'react';
import { Box, Tab, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ToggleButtonCategories } from '../../constants/tabConfig';
import { useGetCorrectorResult } from '../../../../hooks/service/ToolsService';
import { useEditorContext } from '../../providers/EditorProvider';
import { GRAMMARCHECKER } from '../../../correction/const/Constants';
import GenericTabs from '../../../../components/GenericTabs';

export default function CorrectorButtonGroup({ selectedTab }) {
  const { getCorrectorResult } = useGetCorrectorResult();

  const { text, initialText, setInitialText, errorResponse, setErrorResponse, setSelectedSubTab } = useEditorContext(
    (state) => ({
      text: state.text,
      initialText: state.initialText,
      setInitialText: state.setInitialText,
      errorResponse: state.errorResponse,
      setErrorResponse: state.setErrorResponse,
      setSelectedSubTab: state.setSelectedSubTab
    })
  );

  const toggleButtons = ToggleButtonCategories[selectedTab];

  const [value, setValue] = useState(toggleButtons[0].value);

  const { t } = useTranslation();

  const handleChange = async (_, newValue) => {
    setValue(newValue);
    if (initialText !== text && Object.keys(errorResponse).length !== 0) {
      const result = await getCorrectorResult({ tekst: text, model: GRAMMARCHECKER });
      setErrorResponse(result);
      setInitialText(text);
    }
    setSelectedSubTab(newValue);
  };

  return (
    <Box className="d-flex">
      <GenericTabs className="correction-toggle-button-group" value={value} handleChange={handleChange}>
        {toggleButtons.map((button) => (
          <Tab
            key={button.title}
            value={button.value}
            label={
              <Tooltip key={button.title} placement="top" title={t(button.title)}>
                <span>{t(button.text)}</span>
              </Tooltip>
            }
          />
        ))}
      </GenericTabs>
    </Box>
  );
}
