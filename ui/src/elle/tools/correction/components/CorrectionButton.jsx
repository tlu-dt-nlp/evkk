import { Button } from '@mui/material';
import { DefaultButtonStyle } from '../../../const/StyleConstants';
import { useTranslation } from 'react-i18next';
import { queryCaller } from '../util/Utils';
import { useGetCorrectorResult } from '../../../hooks/service/ToolsService';
import CorrectionDocxDownloadButton from './CorrectionDocxDownloadButton';
import { GRAMMARCHECKER_TEST } from '../const/Constants';

export default function CorrectionButton(
  {
    model,
    inputText,
    textBoxRef,
    setInputText,
    setComplexityAnswer,
    setGrammarAnswer,
    setSpellerAnswer,
    setAbstractWords,
    setRequestingText,
    newRef,
    errorList = null,
    tab = null,
    textLevel = null,
    setGrammarErrorList,
    setSpellerErrorList,
    setInputType = null,
    setNoQuery
  }) {
  const { t } = useTranslation();
  const { getCorrectorResult } = useGetCorrectorResult();

  const handleClick = () => {
    setNoQuery(false);
    if (setInputType) setInputType(null);
    queryCaller(textBoxRef, inputText, setRequestingText, setGrammarAnswer, setSpellerAnswer, setInputText, newRef, setComplexityAnswer, setAbstractWords, getCorrectorResult, true, setGrammarErrorList, setSpellerErrorList, model);
  };
  return (
    <div className="d-flex justify-content-between">
      <Button
        sx={DefaultButtonStyle}
        style={{ borderRadius: '5px', marginTop: '1rem' }}
        variant="contained"
        onClick={() => handleClick()}
      >
        {t('analyse_button')}
      </Button>
      {model !== GRAMMARCHECKER_TEST &&
        <CorrectionDocxDownloadButton
          innerHtml={textBoxRef}
          modelValue={model}
          newRef={newRef}
          errorList={errorList}
          tab={tab}
          textLevel={textLevel}
        />}
    </div>
  );
};
