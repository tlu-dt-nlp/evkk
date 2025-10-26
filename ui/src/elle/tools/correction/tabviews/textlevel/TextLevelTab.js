import React from 'react';
import { Alert, Box } from '@mui/material';
import '../../styles/CorrectionTab.css';
import CorrectionInput from '../../components/CorrectionInput';
import '../../styles/TextLevelTab.css';
import TextLevelAccordion from './components/TextLevelAccordion';
import TextLevelAccordionInner from './components/TextLevelAccordionInner';
import CorrectionInfoIcon from '../../components/CorrectionInfoIcon';
import CorrectionToggleButtonGroup from '../../components/CorrectionToggleButtonGroup';
import { useTranslation } from 'react-i18next';
import { CorrectionAndTextLevelToggleButtons } from '../../const/ToggleButtonConstants';
import { accordionDetails, textLevelColors, textLevels } from '../../const/TabValuesConstant';
import { GRAMMARCHECKER_TEST, TEXTLEVEL } from '../../const/Constants';

export default function TextLevelTab(
  {
    textBoxRef,
    requestingText,
    setRequestingText,
    newRef,
    setNewRef,
    setInputText,
    inputText,
    errorList,
    setErrorList,
    complexityAnswer,
    setComplexityAnswer,
    correctionModel,
    setCorrectionModel,
    spellerAnswer,
    grammarAnswer,
    setAbstractWords,
    setSpellerAnswer,
    setGrammarAnswer,
    setGrammarErrorList,
    setSpellerErrorList,
    setHoveredId,
    hoveredId,
    setNoQuery,
    tabsVariant
  }) {
  const { t } = useTranslation();

  return (
    <div className="corrector-border-box">
      <Box className="corrector-border-box-inner">
        {correctionModel !== GRAMMARCHECKER_TEST ?
          <CorrectionToggleButtonGroup
            newRef={newRef}
            correctionModel={correctionModel}
            setCorrectionModel={setCorrectionModel}
            textBoxRef={textBoxRef}
            inputText={inputText}
            setInputText={setInputText}
            setRequestingText={setRequestingText}
            setGrammarAnswer={setGrammarAnswer}
            setSpellerAnswer={setSpellerAnswer}
            setComplexityAnswer={setComplexityAnswer}
            setAbstractWords={setAbstractWords}
            toggleButtons={CorrectionAndTextLevelToggleButtons}
            setGrammarErrorList={setGrammarErrorList}
            setSpellerErrorList={setSpellerErrorList}
            tabsVariant={tabsVariant}
          />
          :
          <Alert severity="warning" className="mb-2">
            <div>{t('corrector_test_version_text')}</div>
            <div>{t('corrector_test_version_thanks')}</div>
          </Alert>
        }
        <CorrectionInfoIcon>
          <div>
            {t('corrector_proficiency_level_infobox_intro')}
            <br></br><br></br>
            {t('corrector_proficiency_level_infobox_list_header')}
            <ul>
              <li>
                <b>{t('corrector_proficiency_level_infobox_list_bold_overall')}</b> – {t('corrector_proficiency_level_infobox_list_overall_value')}
              </li>
              <li>
                <b>{t('corrector_proficiency_level_infobox_list_bold_grammar')}</b> – {t('corrector_proficiency_level_infobox_list_grammar_value')}
              </li>
              <li>
                <b>{t('corrector_proficiency_level_infobox_list_bold_vocabulary')}</b> – {t('corrector_proficiency_level_infobox_list_vocabulary_value')}
              </li>
              {/* Will be reimplemented when correctness is fixed */}
              {/*<li>
                  <b>{t('corrector_proficiency_level_infobox_list_bold_correctness')}</b> – {t('corrector_proficiency_level_infobox_list_correctness_value')}
                </li>*/}
              <li>
                <b>{t('corrector_proficiency_level_infobox_list_bold_overall_score')}</b> – {t('corrector_proficiency_level_infobox_list_overall_score_value')}
              </li>
            </ul>
            {t('corrector_proficiency_level_infobox_outro')}
          </div>
        </CorrectionInfoIcon>
      </Box>
      <div className="d-flex gap-2 flex-wrap">
        <CorrectionInput
          requestingText={requestingText}
          setRequestingText={setRequestingText}
          textBoxRef={textBoxRef}
          newRef={newRef}
          setNewRef={setNewRef}
          inputText={inputText}
          setInputText={setInputText}
          model={correctionModel}
          errorList={errorList}
          setErrorList={setErrorList}
          setGrammarErrorList={setGrammarErrorList}
          setSpellerErrorList={setSpellerErrorList}
          setComplexityAnswer={setComplexityAnswer}
          spellerAnswer={spellerAnswer}
          grammarAnswer={grammarAnswer}
          setAbstractWords={setAbstractWords}
          setGrammarAnswer={setGrammarAnswer}
          setSpellerAnswer={setSpellerAnswer}
          tab={TEXTLEVEL}
          complexityAnswer={complexityAnswer}
          setHoveredId={setHoveredId}
          hoveredId={hoveredId}
          setNoQuery={setNoQuery}
        />
        <div className="corrector-right">
          {complexityAnswer && complexityAnswer?.keeletase.length !== 0 &&
            <div className="levels-row">
              <div className="levels-title">
                {t('corrector_proficiency_level_color_codes')}:
              </div>
              <div className="levels-spacer" />
              <div className="levels">
                {textLevelColors.map((color, index) => (
                  <div className="level" key={t(textLevels[index])}>
                    <div className="dot" style={{ backgroundColor: color }} />
                    <span>{t(textLevels[index])}</span>
                  </div>
                ))}
              </div>
            </div>
          }
          {!complexityAnswer &&
            <Box className="corrector-right-inner">
              <Alert
                severity="info"
                className="level-tab-short-text-notice"
              >
                {t('corrector_proficiency_level_gray_box')}
              </Alert>
            </Box>
          }
          {complexityAnswer && complexityAnswer?.keeletase.length === 0 &&
            <Alert
              severity="info"
              className="level-tab-short-text-notice"
            >
              {t('corrector_proficiency_level_short_text')}
            </Alert>
          }
          {complexityAnswer &&
            <>
              <div className="level-accordion-overall-value-container">
                <div className="level-accordion-overall-value-label">{t(accordionDetails[0].label)}</div>
                <TextLevelAccordionInner
                  complexityAnswer={complexityAnswer.keeletase.mixed}
                  key={'mixed'}
                />
              </div>

              <div>
                <TextLevelAccordion
                  key={'complexity'}
                  label={accordionDetails[1].label}
                  complexityAnswer={complexityAnswer.keeletase.complexity}
                />
                <TextLevelAccordion
                  key={'grammar'}
                  label={accordionDetails[2].label}
                  complexityAnswer={complexityAnswer.keeletase.grammatical}
                />
                {/*Needs to be fixed and will be reimplemented*/}
                {/*<TextLevelAccordion
                  key={'error'}
                  label={accordionDetails[3].label}
                  complexityAnswer={complexityAnswer.keeletase.error}
                />*/}
                <TextLevelAccordion
                  key={'lexical'}
                  label={accordionDetails[4].label}
                  complexityAnswer={complexityAnswer.keeletase.lexical}
                />
              </div>
            </>
          }
        </div>
      </div>
    </div>
  );
};
