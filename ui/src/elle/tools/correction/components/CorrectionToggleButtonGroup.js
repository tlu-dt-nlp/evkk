import React from 'react';
import { queryCaller } from '../util/Utils';
import { Box, Tab, Tabs, Tooltip } from '@mui/material';
import { useGetCorrectorResult } from '../../../hooks/service/ToolsService';
import { useTranslation } from 'react-i18next';

export default function CorrectionToggleButtonGroup(
  {
    newRef,
    toggleButtons,
    correctionModel,
    textBoxRef,
    inputText,
    setInputText,
    setRequestingText,
    setCorrectionModel,
    setGrammarAnswer,
    setSpellerAnswer,
    setComplexityAnswer,
    setAbstractWords,
    setGrammarErrorList,
    setSpellerErrorList,
    noQuery,
    tabsVariant
  }) {

  const { getCorrectorResult } = useGetCorrectorResult();
  const { t } = useTranslation();

  return (
    <Box className="d-flex">
      <Tabs
        className="correction-toggle-button-group"
        orientation="horizontal"
        variant={tabsVariant}
        value={correctionModel}
        scrollButtons
        allowScrollButtonsMobile
        onChange={(_, newValue) => {
          if (!noQuery) {
            queryCaller(textBoxRef, inputText, setRequestingText, setGrammarAnswer, setSpellerAnswer, setInputText, newRef, setComplexityAnswer, setAbstractWords, getCorrectorResult, false, setGrammarErrorList, setSpellerErrorList, correctionModel);
          }
          setCorrectionModel(newValue);
        }}
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
