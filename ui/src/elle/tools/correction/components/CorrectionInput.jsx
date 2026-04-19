import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { ContentEditableDiv } from '../../../const/StyleConstants';
import CorrectionButton from './CorrectionButton';
import { GRAMMARCHECKER, GRAMMARCHECKER_TEST, SPELLCHECKER } from '../const/Constants';
import { removeEmptySpans } from '../../../util/TextUtils';

import { useGlobalClickListener } from '../hooks/useGlobalClickListener';
import { useHandleInputErrors } from '../hooks/useHandleInputErrors';
import { handleCorrectionTextSelection, handleCorrectorKeyDown, processCorrectorKeyDown } from '../util/Utils';

export default function CorrectionInput(
  {
    setRequestingText,
    textBoxRef,
    newRef,
    setNewRef,
    inputText,
    setInputText,
    model,
    errorList,
    setErrorList,
    setComplexityAnswer,
    setSpellerAnswer,
    setGrammarAnswer,
    setAbstractWords,
    tab,
    complexityAnswer,
    setGrammarErrorList,
    setSpellerErrorList,
    hoveredId,
    setHoveredId,
    spellerAnswer,
    grammarAnswer,
    setNoQuery
  }) {
  const [inputType, setInputType] = useState(null);
  const [innerValue, setInnerValue] = useState(newRef);
  const [selectedText, setSelectedText] = useState(null);
  const [errorsToRemove, setErrorsToRemove] = useState(null);

  const handleResetSelect = () => {
    setSelectedText(null);
  };

  useEffect(() => {
    if (model === SPELLCHECKER) setInputType(spellerAnswer);
    if (model === GRAMMARCHECKER || model === GRAMMARCHECKER_TEST) setInputType(grammarAnswer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, inputText, spellerAnswer, grammarAnswer, errorList]);

  useGlobalClickListener(setSelectedText, handleResetSelect);

  useEffect(() => {
    setNewRef(textBoxRef.current.innerText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerValue]);

  useHandleInputErrors(inputType, hoveredId, errorsToRemove, setErrorList, setErrorsToRemove, model, setSpellerAnswer, setGrammarAnswer, setInnerValue, newRef, setHoveredId);

  useEffect(() => {
    setNewRef(newRef.replace(removeEmptySpans, ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textBoxRef.current.innerHTML]);

  const handleKeyDown = (e) => {
    handleCorrectorKeyDown(e, selectedText, setSelectedText, inputType, setInputType, setErrorsToRemove);
  };

  const handleTextSelection = () => {
    handleCorrectionTextSelection(setSelectedText);
  };

  const handleCut = (e) => {
    const selection = window.getSelection().toString();
    e.clipboardData.setData('text/plain', selection);
    processCorrectorKeyDown(selectedText, true, true, e, '', inputType, setInputType, setErrorsToRemove, setSelectedText);
  };

  const handlePaste = (e) => {
    const valueToPaste = e.clipboardData.getData('text/plain');
    processCorrectorKeyDown(selectedText, false, true, e, valueToPaste, inputType, setInputType, setErrorsToRemove, setSelectedText);
    e.preventDefault();
    setInnerValue(valueToPaste);
  };


  return (
    <div className="corrector-input">
      <Box
        id={'error-text-box'}
        ref={textBoxRef}
        spellCheck={false}
        suppressContentEditableWarning={true}
        sx={ContentEditableDiv}
        contentEditable={true}
        onKeyDown={handleKeyDown}
        onSelect={handleTextSelection}
        onCut={handleCut}
        onPaste={handlePaste}
      >
        {innerValue}
      </Box>
      <CorrectionButton
        model={model}
        inputText={inputText}
        replacementText={newRef}
        setNewRef={setNewRef}
        textBoxRef={textBoxRef}
        setInputText={setInputText}
        setComplexityAnswer={setComplexityAnswer}
        setGrammarAnswer={setGrammarAnswer}
        setSpellerAnswer={setSpellerAnswer}
        setAbstractWords={setAbstractWords}
        setRequestingText={setRequestingText}
        errorList={errorList}
        tab={tab}
        textLevel={complexityAnswer}
        setGrammarErrorList={setGrammarErrorList}
        setSpellerErrorList={setSpellerErrorList}
        setInputType={setInputType}
        setNoQuery={setNoQuery}
      />
    </div>
  );
};
