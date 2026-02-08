import React, { useState } from 'react';
import { Box, Tab, Tabs, Tooltip, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ToggleButtonCategories } from '../../const/ToggleButtonConstantsV2';
import { useGetCorrectorResult } from '../../../../hooks/service/ToolsService';
import { useEditorContext } from '../../providers/EditorProvider';
import { GRAMMARCHECKER } from '../../../correction/const/Constants';

export default function CorrectorButtonGroup({ selectedTab }) {
  const { getCorrectorResult } = useGetCorrectorResult();

  const {
    text,
    initialText,
    setInitialText,
    errorResponse,
    setErrorResponse,
    setSelectedSubTab
  } = useEditorContext(state => ({
    text: state.text,
    initialText: state.initialText,
    setInitialText: state.setInitialText,
    errorResponse: state.errorResponse,
    setErrorResponse: state.setErrorResponse,
    setSelectedSubTab: state.setSelectedSubTab
  }));

  const isMobileView = useMediaQuery('(max-width:677px)');
  const tabsVariant = isMobileView ? 'scrollable' : '';

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
      <Tabs
        className="correction-toggle-button-group"
        orientation="horizontal"
        variant={tabsVariant}
        value={value}
        scrollButtons
        allowScrollButtonsMobile
        onChange={handleChange}
      >
        {toggleButtons.map((button) => (
          <Tab
            key={button.title}
            value={button.value}
            label={
              <Tooltip
                key={button.title}
                placement="top"
                title={t(button.title)}
              >
                <span>{t(button.text)}</span>
              </Tooltip>
            }
          />
        ))}
      </Tabs>
    </Box>
  );
};
