import React, { useEffect, useState } from 'react';
import { Alert, Box, Divider } from '@mui/material';
import { ContentEditableDiv, CorrectorAccordionStyle } from '../../../../const/StyleConstants';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from '@mui/material/Accordion';
import '../../styles/ComplexityTab.css';
import { cleanEmptySpans, handleCopy, handlePaste } from '../../util/Utils';
import CorrectionScale from '../../components/CorrectionScale';
import CorrectionButton from '../../components/CorrectionButton';
import CorrectionInfoIcon from '../../components/CorrectionInfoIcon';
import { MathJax } from 'better-react-mathjax';
import { useTranslation } from 'react-i18next';
import CorrectionToggleButtonGroup from '../../components/CorrectionToggleButtonGroup';
import { LONG_SENTENCE } from '../../const/Constants';
import { ComplexityToggleButtons } from '../../const/ToggleButtonConstants';
import { COMPLEXITY_LIX_LINK, COMPLEXITY_LONG_WORD_LINK, COMPLEXITY_SMOG_LINK } from '../../const/PathConstants';
import { complexityValues } from '../../const/TabValuesConstant';
import NewTabHyperlink from '../../../../components/NewTabHyperlink';

export default function ComplexityTab(
  {
    requestingText,
    textBoxRef,
    newRef,
    setNewRef,
    inputText,
    setInputText,
    setComplexityAnswer,
    complexityAnswer,
    setSpellerAnswer,
    setGrammarAnswer,
    setAbstractWords,
    setRequestingText,
    setErrorList,
    setGrammarErrorList,
    setSpellerErrorList,
    noQuery,
    setNoQuery,
    tabsVariant
  }) {
  const { t } = useTranslation();
  const [model, setModel] = useState(LONG_SENTENCE);

  useEffect(() => {
    if (!inputText || !complexityAnswer) return;
    setNewRef(complexityAnswer.margitudLaused[model]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, complexityAnswer]);

  const generateComplexityAnswer = (answer) => {
    return answer
      .split('/')
      .sort((a, b) => complexityValues.indexOf(a) - complexityValues.indexOf(b))
      .map(t)
      .map((complexityWord, index, array) =>
        index === array.length - 1 ? complexityWord : `${complexityWord} / `
      );
  };

  return (
    <div className="corrector-border-box">
      <Box className="corrector-border-box-inner">
        <CorrectionToggleButtonGroup
          newRef={newRef}
          toggleButtons={ComplexityToggleButtons}
          correctionModel={model}
          setCorrectionModel={setModel}
          textBoxRef={textBoxRef}
          inputText={inputText}
          setInputText={setInputText}
          setRequestingText={setRequestingText}
          setGrammarAnswer={setGrammarAnswer}
          setSpellerAnswer={setSpellerAnswer}
          setComplexityAnswer={setComplexityAnswer}
          setAbstractWords={setAbstractWords}
          setGrammarErrorList={setGrammarErrorList}
          setSpellerErrorList={setSpellerErrorList}
          noQuery={noQuery}
          tabsVariant={tabsVariant}
        />
        <CorrectionInfoIcon>
          <div>
            {t('corrector_complexity_infobox_intro')}
            <br></br><br></br>
            <ul>
              <li>
                <b>{t('corrector_complexity_infobox_lix_bold')}</b> {t('corrector_complexity_infobox_lix_value')}
                <br></br>
                {/* sõnade arv / lausete arv + pikkade sõnade arv * 100 / sõnade arv */}
                <MathJax style={{ padding: '0.5rem' }}>
                  {`\\(\\frac{\\text{${t('common_word_count')}}}{\\text{${t('common_sentence_count')}}}\\) + \\(\\frac{\\text{${t('common_long_word_count')}} \\times 100}{\\text{${t('common_word_count')}}}\\)`}
                </MathJax>
              </li>
              <li>
                <b>{t('corrector_complexity_infobox_smog_bold')}</b> {t('corrector_complexity_infobox_smog_value')}
                <br></br>
                {/* 1,043 * √paljusilbiliste sõnade arv * 30 / lausete arv + 3,1291 */}
                <MathJax style={{ padding: '0.5rem' }}>
                  {`\\(\\text{1.043} \\times \\sqrt{\\frac{\\text{${t('common_polysyllabic_words')}} \\times 30}{\\text{${t('common_sentence_count')}}}}\\) + \\(3.1291\\)`}
                </MathJax>
              </li>
              <li>
                <b>{t('corrector_complexity_infobox_flesch_kincaid_bold')}</b> {t('corrector_complexity_infobox_flesch_kincaid_value')}
                <br></br>
                {/* 0,39 * sõnade arv / lausete arv + 11,8 * silpide arv / sõnade arv - 15,59 */}
                <MathJax style={{ padding: '0.5rem' }}>
                  {`\\(\\text{0.39} \\times (\\frac{ \\text{${t('common_word_count')}}}{\\text{${t('common_sentence_count')}}})\\) + \\(11.8 \\times (\\frac{\\text{${t('common_syllable_count')}}}{\\text{${t('common_word_count')}}})- 15.59\\)`}
                </MathJax>
              </li>
              <li>
                <b>{t('corrector_complexity_infobox_noun_to_verb_bold')}</b> {t('corrector_complexity_infobox_noun_to_verb_value')}
              </li>
            </ul>
            {t('corrector_complexity_infobox_lix_outro')}&nbsp;
            <NewTabHyperlink path={COMPLEXITY_LIX_LINK} content={t('common_here')} />,&nbsp;
            {t('corrector_complexity_infobox_smog_outro')}&nbsp;
            <NewTabHyperlink path={COMPLEXITY_SMOG_LINK} content={t('common_here')} />.&nbsp;
            {t('corrector_complexity_infobox_smog_outro_extra')}
            <br></br><br></br>
            {t('corrector_complexity_infobox_word_length_outro')}&nbsp;
            <NewTabHyperlink path={COMPLEXITY_LONG_WORD_LINK} content={t('common_here')} />).
          </div>
        </CorrectionInfoIcon>
      </Box>
      <div className="d-flex gap-2 flex-wrap">
        <div className="corrector-input">
          <Box
            id={'error-text-box'}
            ref={textBoxRef}
            dangerouslySetInnerHTML={{ __html: requestingText || newRef }}
            spellCheck={false}
            suppressContentEditableWarning={true}
            sx={ContentEditableDiv}
            contentEditable={true}
            onCopy={(e) => handleCopy(e)}
            onPaste={(e) => handlePaste(e, textBoxRef.current.innerHTML, setNewRef, setInputText)}
            onInput={(e) => {cleanEmptySpans(e.currentTarget);}}
          >
          </Box>
          <CorrectionButton
            model={model}
            inputText={inputText}
            textBoxRef={textBoxRef}
            setInputText={setInputText}
            setComplexityAnswer={setComplexityAnswer}
            setGrammarAnswer={setGrammarAnswer}
            setSpellerAnswer={setSpellerAnswer}
            setAbstractWords={setAbstractWords}
            setRequestingText={setRequestingText}
            setErrorList={setErrorList}
            setGrammarErrorList={setGrammarErrorList}
            setSpellerErrorList={setSpellerErrorList}
            setNoQuery={setNoQuery}
          />
        </div>
        <div className="corrector-right">
          {complexityAnswer ?
            <div>
              <div className="complexity-tab-header">
                <span>
                  {t('corrector_complexity_level')}
                </span>
                <span>
                  {generateComplexityAnswer(complexityAnswer.keerukus[11])}
                </span>
              </div>
              <Accordion square={true} style={{ marginBottom: '0.5em' }} sx={CorrectorAccordionStyle} defaultExpanded>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  {t('common_statistics')}
                </AccordionSummary>
                <AccordionDetails>
                  <div>
                    <div className="tab-table">
                      <div>{t('corrector_complexity_statistics_phrases')}</div>
                      <div>{complexityAnswer.keerukus[0] || 0}</div>
                    </div>
                    <div className="tab-table">
                      <div>{t('corrector_complexity_statistics_words')}</div>
                      <div>{complexityAnswer.sonad.length}</div>
                    </div>
                    <div className="tab-table">
                      <div>{t('corrector_complexity_statistics_syllables')}</div>
                      <div>{complexityAnswer.keerukus[3] || 0}</div>
                    </div>
                    <div className="tab-table">
                      <div>{t('corrector_complexity_statistics_polysyllabic_words')}</div>
                      <div>{complexityAnswer.keerukus[2] || 0}</div>
                    </div>
                    <div className="tab-table">
                      <div>{t('corrector_complexity_statistics_long_words')}</div>
                      <div>{complexityAnswer.keerukus[4] || 0}</div>
                    </div>
                    <div className="tab-table">
                      <div>{t('corrector_complexity_statistics_nouns')}</div>
                      <div>{complexityAnswer.korrektoriLoendid.nimisonad || 0}</div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              <Accordion square={true} sx={CorrectorAccordionStyle}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  {t('common_indexes')}
                </AccordionSummary>
                <AccordionDetails className="index-row">
                  <CorrectionScale
                    title={t('corrector_smog_index')}
                    startValue={0}
                    endValue={20}
                    value={complexityAnswer.keerukus[5]}
                    startText={t('corrector_index_score_easy')}
                    endText={t('corrector_index_score_difficult')}
                  />
                  <Divider />
                  <CorrectionScale
                    title={t('corrector_flesch_kincaid_grade_level')}
                    startValue={0}
                    endValue={30}
                    value={complexityAnswer.keerukus[6]}
                    startText={t('corrector_index_score_easy')}
                    endText={t('corrector_index_score_difficult')}
                  />
                  <Divider />
                  <CorrectionScale
                    title={t('corrector_lix_index')}
                    startValue={20}
                    endValue={70}
                    value={complexityAnswer.keerukus[7]}
                    startText={t('corrector_index_score_easy')}
                    endText={t('corrector_index_score_difficult')}
                  />
                  <Divider />
                  <CorrectionScale
                    title={t('corrector_noun_to_verb_ratio')}
                    startValue={0}
                    endValue={3}
                    value={complexityAnswer.korrektoriLoendid.nimitegusuhe}
                    startText={t('corrector_has_more_verbs')}
                    endText={t('corrector_has_more_nouns')}
                  />
                  <Divider />
                </AccordionDetails>
              </Accordion>
            </div>
            :
            <Box className="corrector-right-inner">
              {!complexityAnswer &&
                <Alert
                  severity="info"
                  className="level-tab-short-text-notice"
                >
                  {t('corrector_complexity_gray_box')}
                </Alert>
              }
            </Box>
          }
        </div>
      </div>
    </div>
  );
};
