import { useRef, useState } from 'react';
import './Correction.css';
import { Box, Tab } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import CorrectionTab from './tabviews/correction/CorrectionTab';
import ComplexityTab from './tabviews/complexity/ComplexityTab';
import VocabularyTab from './tabviews/vocabulary/VocabularyTab';
import TextLevelTab from './tabviews/textlevel/TextLevelTab';
import { useTranslation } from 'react-i18next';
import { useGetCorrectorResult } from '../../hooks/service/ToolsService';
import { queryCaller } from './util/Utils';
import { GRAMMARCHECKER_TEST, SPELLCHECKER } from './const/Constants';
import CorrectionNotAvailableAlert from '../correctionV2/components/CorrectionNotAvailableAlert';
import { featureFlags } from '../../../config/featureFlags';
import GenericTabs from '../../components/GenericTabs';

export default function Correction() {
  const { t } = useTranslation();
  const [value, setValue] = useState('1');
  const [inputText, setInputText] = useState('');
  const [grammarErrorList, setGrammarErrorList] = useState(null);
  const [spellerErrorList, setSpellerErrorList] = useState(null);
  const [complexityAnswer, setComplexityAnswer] = useState();
  const [grammarAnswer, setGrammarAnswer] = useState();
  const [spellerAnswer, setSpellerAnswer] = useState();
  const [abstractWords, setAbstractWords] = useState([]);
  const [correctionModel, setCorrectionModel] = useState(window.location.pathname === '/corrector-test' ? GRAMMARCHECKER_TEST : SPELLCHECKER);
  const [newRef, setNewRef] = useState(inputText);
  const [requestingText, setRequestingText] = useState(null);
  const textBoxRef = useRef(inputText);
  const { getCorrectorResult } = useGetCorrectorResult();
  const [hoveredId, setHoveredId] = useState(null);
  const [noQuery, setNoQuery] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setNewRef(textBoxRef.current.innerText);
    if (!noQuery) {
      queryCaller(textBoxRef, inputText, setRequestingText, setGrammarAnswer, setSpellerAnswer, setInputText, newRef, setComplexityAnswer, setAbstractWords, getCorrectorResult, false, setGrammarErrorList, setSpellerErrorList, correctionModel);
    }
  };

  if (correctionModel === GRAMMARCHECKER_TEST && !featureFlags.isCorrectorTestVersionEnabled) {
    return <CorrectionNotAvailableAlert />;
  }

  return (
    <Box className="global-page-content-container">
      <div className="mouseaway-listener"></div>
      <div className="global-page-content-container-inner correction-container-inner">
        <Box sx={{ width: '100%' }}>
          <TabContext value={value}>
            <Box>
              <GenericTabs
                className="correction-tab-group"
                value={value}
                handleChange={handleChange}
                leftPadding={true}
              >
                <Tab label={t('corrector_proofreading')} value="1" />
                <Tab label={t('corrector_proficiency_level')} value="2" />
                <Tab label={t('corrector_complexity')} value="3" />
                <Tab label={t('corrector_vocabulary')} value="4" />
              </GenericTabs>
            </Box>
            <TabPanel value="1">
              <CorrectionTab
                textBoxRef={textBoxRef}
                requestingText={requestingText}
                setRequestingText={setRequestingText}
                newRef={newRef}
                setNewRef={setNewRef}
                inputText={inputText}
                setInputText={setInputText}
                errorList={correctionModel === SPELLCHECKER ? spellerErrorList : grammarErrorList}
                setErrorList={correctionModel === SPELLCHECKER ? setSpellerErrorList : setGrammarErrorList}
                setGrammarErrorList={setGrammarErrorList}
                setSpellerErrorList={setSpellerErrorList}
                setComplexityAnswer={setComplexityAnswer}
                grammarAnswer={grammarAnswer}
                setGrammarAnswer={setGrammarAnswer}
                spellerAnswer={spellerAnswer}
                setSpellerAnswer={setSpellerAnswer}
                correctionModel={correctionModel}
                setCorrectionModel={setCorrectionModel}
                setAbstractWords={setAbstractWords}
                complexityAnswer={complexityAnswer}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                setNoQuery={setNoQuery}
                noQuery={noQuery}
              /></TabPanel>
            <TabPanel value="2">
              <TextLevelTab
                requestingText={requestingText}
                setRequestingText={setRequestingText}
                textBoxRef={textBoxRef}
                newRef={newRef}
                setNewRef={setNewRef}
                inputText={inputText}
                setInputText={setInputText}
                errorList={correctionModel === SPELLCHECKER ? spellerErrorList : grammarErrorList}
                setErrorList={correctionModel === SPELLCHECKER ? setSpellerErrorList : setGrammarErrorList}
                setGrammarErrorList={setGrammarErrorList}
                setSpellerErrorList={setSpellerErrorList}
                complexityAnswer={complexityAnswer}
                setComplexityAnswer={setComplexityAnswer}
                correctionModel={correctionModel}
                setCorrectionModel={setCorrectionModel}
                grammarAnswer={grammarAnswer}
                setGrammarAnswer={setGrammarAnswer}
                spellerAnswer={spellerAnswer}
                setSpellerAnswer={setSpellerAnswer}
                setAbstractWords={setAbstractWords}
                setHoveredId={setHoveredId}
                setNoQuery={setNoQuery}
                noQuery={noQuery}
                hoveredId={hoveredId}
              /></TabPanel>
            <TabPanel value="3">
              <ComplexityTab
                requestingText={requestingText}
                textBoxRef={textBoxRef}
                newRef={newRef}
                setNewRef={setNewRef}
                inputText={inputText}
                setInputText={setInputText}
                complexityAnswer={complexityAnswer}
                setComplexityAnswer={setComplexityAnswer}
                setAbstractWords={setAbstractWords}
                setSpellerAnswer={setSpellerAnswer}
                setGrammarAnswer={setGrammarAnswer}
                setRequestingText={setRequestingText}
                setErrorList={correctionModel === SPELLCHECKER ? setSpellerErrorList : setGrammarErrorList}
                setGrammarErrorList={setGrammarErrorList}
                setSpellerErrorList={setSpellerErrorList}
                setNoQuery={setNoQuery}
                noQuery={noQuery}
              /></TabPanel>
            <TabPanel value="4">
              <VocabularyTab
                requestingText={requestingText}
                textBoxRef={textBoxRef}
                newRef={newRef}
                setNewRef={setNewRef}
                inputText={inputText}
                setInputText={setInputText}
                complexityAnswer={complexityAnswer}
                setComplexityAnswer={setComplexityAnswer}
                abstractWords={abstractWords}
                setAbstractWords={setAbstractWords}
                setSpellerAnswer={setSpellerAnswer}
                setGrammarAnswer={setGrammarAnswer}
                setRequestingText={setRequestingText}
                setErrorList={correctionModel === SPELLCHECKER ? setSpellerErrorList : setGrammarErrorList}
                setGrammarErrorList={setGrammarErrorList}
                setSpellerErrorList={setSpellerErrorList}
                setNoQuery={setNoQuery}
                noQuery={noQuery}
              /></TabPanel>
          </TabContext>
        </Box>
      </div>
    </Box>
  );
};
