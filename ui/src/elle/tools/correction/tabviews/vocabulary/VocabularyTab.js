import React, { useEffect, useState } from 'react';
import { Alert, Box, Divider } from '@mui/material';
import { ContentEditableDiv, CorrectorAccordionStyle } from '../../../../const/StyleConstants';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import '../../styles/VocabularyTab.css';
import CorrectionScale from '../../components/CorrectionScale';
import { cleanEmptySpans, handleCopy, handlePaste } from '../../util/Utils';
import CorrectionButton from '../../components/CorrectionButton';
import CorrectionInfoIcon from '../../components/CorrectionInfoIcon';
import { MathJax } from 'better-react-mathjax';
import { useTranslation } from 'react-i18next';
import CorrectionToggleButtonGroup from '../../components/CorrectionToggleButtonGroup';
import {
  VOCABULARY_DATA_LINK,
  VOCABULARY_LEXICAL_DENSITY_LINK,
  VOCABULARY_RANGE_LINK,
  VOCABULARY_REFERENCE_LINK_ONE,
  VOCABULARY_REFERENCE_LINK_TWO,
  VOCABULARY_TOOL_LINK
} from '../../const/PathConstants';
import { VocabularyToggleButtons } from '../../const/ToggleButtonConstants';
import { WORD_REPETITION } from '../../const/Constants';
import NewTabHyperlink from '../../../../components/NewTabHyperlink';

export default function VocabularyTab(
  {
    requestingText,
    textBoxRef,
    newRef,
    setNewRef,
    inputText,
    setInputText,
    complexityAnswer,
    setComplexityAnswer,
    abstractWords,
    setAbstractWords,
    setSpellerAnswer,
    setGrammarAnswer,
    setRequestingText,
    setGrammarErrorList,
    setSpellerErrorList,
    noQuery,
    setNoQuery,
    tabsVariant
  }) {
  const { t } = useTranslation();
  const [model, setModel] = useState(WORD_REPETITION);

  useEffect(() => {
    if (!inputText || !complexityAnswer) return;
    setNewRef(complexityAnswer.margitudLaused[model]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, complexityAnswer]);

  return (
    <div className="corrector-border-box">
      <Box className="corrector-border-box-inner">
        <CorrectionToggleButtonGroup
          newRef={newRef}
          toggleButtons={VocabularyToggleButtons}
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
            {t('corrector_vocabulary_infobox_intro')}
            <br></br><br></br>
            <ul>
              <li>
                <b>{t('corrector_vocabulary_infobox_root_type_token_bold')}</b> {t('corrector_vocabulary_infobox_root_type_token_value')}
                <MathJax style={{ padding: '0.5rem' }}>
                  {`\\(\\frac{\\text{${t('common_different_word_count')}}}{\\sqrt{\\text{${t('common_word_count')}}}}\\)`}
                </MathJax>
              </li>
              <li>
                <b>{t('corrector_vocabulary_infobox_mtld_bold')}</b> {t('corrector_vocabulary_infobox_mtld_value')}
              </li>
              <li>
                <b>{t('corrector_vocabulary_infobox_hdd_bold')}</b> {t('corrector_vocabulary_infobox_hdd_value')}
              </li>
              <li>
                <b>{t('corrector_vocabulary_infobox_vocabulary_range_bold')}</b> {t('corrector_vocabulary_infobox_vocabulary_range_value')}&nbsp;
                <NewTabHyperlink path={VOCABULARY_RANGE_LINK} content={t('common_here')} />).
              </li>
              <li>
                <b>{t('corrector_vocabulary_infobox_noun_abstractness_bold')}</b>&nbsp;
                {t('corrector_vocabulary_infobox_noun_abstractness_value')}&nbsp;
                <NewTabHyperlink path={VOCABULARY_TOOL_LINK} content={t('common_tool')} />
                {t('corrector_vocabulary_infobox_noun_abstractness_value_second')}&nbsp;
                <NewTabHyperlink path={VOCABULARY_DATA_LINK} content={t('correction_vocabulary_data')} />&nbsp;
                {t('corrector_vocabulary_infobox_noun_abstractness_value_end')}
              </li>
              <li>
                <b>{t('corrector_vocabulary_infobox_lexical_density_bold')}</b> {t('corrector_vocabulary_infobox_lexical_density_value')}&nbsp;
                <NewTabHyperlink path={VOCABULARY_LEXICAL_DENSITY_LINK}
                                 content={t('corrector_vocabulary_infobox_lexical_density_link')} />
              </li>
            </ul>
            <b>{t('corrector_vocabulary_infobox_reference_links_bold')}</b>&nbsp;
            {t('corrector_vocabulary_infobox_reference_links')}&nbsp;
            <NewTabHyperlink path={VOCABULARY_REFERENCE_LINK_ONE} content={t('common_here')} />&nbsp;
            {t('common_and')}&nbsp;
            <NewTabHyperlink path={VOCABULARY_REFERENCE_LINK_TWO} content={t('common_here')} />.
            <br></br><br></br>
            {t('corrector_vocabulary_infobox_outro')}
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
            newRef={newRef}
            setGrammarErrorList={setGrammarErrorList}
            setSpellerErrorList={setSpellerErrorList}
            setNoQuery={setNoQuery}
          />
        </div>
        <div className="corrector-right">
          {complexityAnswer ?
            <div>
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
                      <div>{t('corrector_vocabulary_statistics_the_words_considered')}</div>
                      <div>{complexityAnswer.sonad.length}</div>
                    </div>
                    <div className="tab-table">
                      <div>{t('corrector_vocabulary_statistics_different_words')}</div>
                      <div>{complexityAnswer.mitmekesisus[11] || 0}</div>
                    </div>
                    <div className="tab-table">
                      <div>{t('corrector_vocabulary_statistics_low_frequency_words')}</div>
                      <div>{complexityAnswer.korrektoriLoendid.harvaesinevad || 0}</div>
                    </div>
                    <div className="tab-table">
                      <div>{t('corrector_vocabulary_statistics_content_words')}</div>
                      <div>{complexityAnswer.korrektoriLoendid.sisusonad || 0}</div>
                    </div>
                    {abstractWords &&
                      <div className="tab-table">
                        <div>{t('corrector_vocabulary_statistics_abstract_nouns')}</div>
                        <div>{complexityAnswer.korrektoriLoendid.abstraktsed || 0}</div>
                      </div>
                    }
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
                    title={t('corrector_vocabulary_indexes_root_type_token_ratio')}
                    startValue={0}
                    endValue={15}
                    value={complexityAnswer.mitmekesisus[1]}
                    startText={t('corrector_vocabulary_repetitive_vocabulary')}
                    endText={t('corrector_vocabulary_diverse_vocabulary')}
                  />
                  <Divider />
                  {complexityAnswer.mitmekesisus[4] > -1 &&
                    <>
                      <CorrectionScale
                        title={t('corrector_vocabulary_mtld_index')}
                        startValue={0}
                        endValue={400}
                        value={complexityAnswer.mitmekesisus[4]}
                        startText={t('corrector_vocabulary_repetitive_vocabulary')}
                        endText={t('corrector_vocabulary_diverse_vocabulary')}
                      />
                      <Divider />
                    </>
                  }
                  {complexityAnswer.mitmekesisus[5] > 0 &&
                    <>
                      <CorrectionScale
                        title={t('corrector_vocabulary_hdd_index')}
                        startValue={0.5}
                        endValue={1}
                        value={complexityAnswer.mitmekesisus[5]}
                        startText={t('corrector_vocabulary_repetitive_vocabulary')}
                        endText={t('corrector_vocabulary_diverse_vocabulary')}
                      />
                      <Divider />
                    </>}
                  {abstractWords &&
                    <>
                      <CorrectionScale
                        title={t('corrector_vocabulary_noun_abstractness')}
                        startValue={1}
                        endValue={3}
                        value={complexityAnswer.korrektoriLoendid.abskeskmine}
                        startText={t('corrector_vocabulary_more_concrete_vocabulary')}
                        endText={t('corrector_vocabulary_more_abstract_vocabulary')}
                      />
                      <Divider />
                    </>
                  }
                  <CorrectionScale
                    title={t('corrector_vocabulary_range')}
                    startValue={0}
                    endValue={10}
                    value={complexityAnswer.korrektoriLoendid.harvaesinevad * 100 / complexityAnswer.mitmekesisus[10]}
                    startText={t('corrector_vocabulary_more_frequent_vocabulary')}
                    endText={t('corrector_vocabulary_less_frequent_vocabulary')}
                    percentage={true}
                  />
                  <Divider />
                  <CorrectionScale
                    title={t('corrector_vocabulary_lexical_density')}
                    startValue={30}
                    endValue={70}
                    value={complexityAnswer.korrektoriLoendid.sisusonad * 100 / complexityAnswer.mitmekesisus[10]}
                    startText={t('corrector_vocabulary_less_content_words')}
                    endText={t('corrector_vocabulary_more_content_words')}
                    percentage={true}
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
                  {t('corrector_vocabulary_gray_box')}
                </Alert>
              }
            </Box>
          }
        </div>
      </div>
    </div>
  );
};
