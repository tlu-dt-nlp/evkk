import { queryCaller } from '../util/Utils';
import { Box, Tab, Tooltip } from '@mui/material';
import { useGetCorrectorResult } from '../../../hooks/service/ToolsService';
import { useTranslation } from 'react-i18next';
import GenericTabs from '../../../components/GenericTabs';

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
    noQuery
  }) {

  const { getCorrectorResult } = useGetCorrectorResult();
  const { t } = useTranslation();

  const handleChange = (_, newValue) => {
    if (!noQuery) {
      queryCaller(textBoxRef, inputText, setRequestingText, setGrammarAnswer, setSpellerAnswer, setInputText, newRef, setComplexityAnswer, setAbstractWords, getCorrectorResult, false, setGrammarErrorList, setSpellerErrorList, correctionModel);
    }
    setCorrectionModel(newValue);
  };

  return (
    <Box className="d-flex">
      <GenericTabs
        className="correction-toggle-button-group"
        value={correctionModel}
        handleChange={handleChange}
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
      </GenericTabs>
    </Box>
  );
};
