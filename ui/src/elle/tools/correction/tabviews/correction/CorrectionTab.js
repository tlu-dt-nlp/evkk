import React, { useEffect, useState } from 'react';
import { Alert, Box } from '@mui/material';
import '../../styles/CorrectionTab.css';
import ErrorAccordion from './components/ErrorAccordion';
import CorrectionInput from '../../components/CorrectionInput';
import CorrectionInfoIcon from '../../components/CorrectionInfoIcon';
import { useTranslation } from 'react-i18next';
import CorrectionToggleButtonGroup from '../../components/CorrectionToggleButtonGroup';
import { CorrectionAndTextLevelToggleButtons } from '../../const/ToggleButtonConstants';
import { CORRECTION_TAB_LINK } from '../../const/PathConstants';
import { CORRECTION, GRAMMARCHECKER_TEST, SPELLCHECKER } from '../../const/Constants';
import NewTabHyperlink from '../../../../components/NewTabHyperlink';
import { ELLE_PATH } from '../../../../const/PathConstants';
import { RouteConstants } from '../../../../../AppRoutes';

export default function CorrectionTab(
  {
    requestingText,
    setRequestingText,
    textBoxRef,
    newRef,
    setNewRef,
    setInputText,
    inputText,
    errorList,
    setErrorList,
    grammarAnswer,
    setGrammarAnswer,
    spellerAnswer,
    setSpellerAnswer,
    setComplexityAnswer,
    correctionModel,
    setCorrectionModel,
    setAbstractWords,
    complexityAnswer,
    setGrammarErrorList,
    setSpellerErrorList,
    hoveredId,
    setHoveredId,
    noQuery,
    setNoQuery,
    tabsVariant
  }) {
  const { t } = useTranslation();
  const [totalErrors, setTotalErrors] = useState(null);

  useEffect(() => {
    if (!errorList) return;
    const totalCorrections = Object.values(errorList).reduce((sum, currentArray) => sum + currentArray.length, 0);
    setTotalErrors(totalCorrections);
  }, [errorList]);

  return (
    <div className="corrector-border-box">
      <Box className="corrector-border-box-inner">
        {correctionModel !== GRAMMARCHECKER_TEST ?
          <CorrectionToggleButtonGroup
            newRef={newRef}
            toggleButtons={CorrectionAndTextLevelToggleButtons}
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
            setGrammarErrorList={setGrammarErrorList}
            setSpellerErrorList={setSpellerErrorList}
            noQuery={noQuery}
            tabsVariant={tabsVariant}
          />
          :
          <Alert severity="warning" className="mb-2">
            <div>{t('corrector_test_version_text')}</div>
            <div>{t('corrector_test_version_thanks')}</div>
          </Alert>
        }
        <div>
          <CorrectionInfoIcon>
            {correctionModel === GRAMMARCHECKER_TEST
              ?
              <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                {t('corrector_test_version_info')}
                <img
                  src={require('../../../../resources/images/misc/el_est_dual_logo.png').default}
                  height="200px"
                  width="350px"
                  alt="EL-Eesti logod"
                />
                <img
                  src={require('../../../../resources/images/misc/eki_logo.png').default}
                  height="150px"
                  width="300px"
                  alt="EKI logo"
                />
              </div>
              :
              <div>
                {t('corrector_proofreading_infobox')}&nbsp;
                <NewTabHyperlink path={CORRECTION_TAB_LINK}
                                 content={t('common_here')} />.
              </div>
            }
          </CorrectionInfoIcon>
        </div>
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
          grammarAnswer={grammarAnswer}
          spellerAnswer={spellerAnswer}
          setGrammarAnswer={setGrammarAnswer}
          setSpellerAnswer={setSpellerAnswer}
          setAbstractWords={setAbstractWords}
          tab={CORRECTION}
          complexityAnswer={complexityAnswer}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          setNoQuery={setNoQuery}
        />
        <div className="corrector-right">
          {errorList ?
            <>
              <Box className="h4">{t('corrector_errors_in_total')}: {totalErrors}</Box>
              <ErrorAccordion
                setErrorList={setErrorList}
                errorList={errorList}
                inputText={inputText}
                setHoveredId={setHoveredId}
                setInputType={correctionModel === SPELLCHECKER ? setSpellerAnswer : setGrammarAnswer}
                correctionModel={correctionModel}
              />
            </>
            :
            <Box className="corrector-right-inner">
              <Alert severity="info">
                {t('corrector_proofreading_gray_box')}
                {correctionModel !== GRAMMARCHECKER_TEST && (
                  <>
                    <br /><br />
                    {t('corrector_proofreading_gray_box_beta_advert_1')}&nbsp;
                    <NewTabHyperlink path={ELLE_PATH + RouteConstants.CORRECTOR_TEST}
                                     content={t('corrector_proofreading_gray_box_beta_advert_2')} />&nbsp;
                    {t('corrector_proofreading_gray_box_beta_advert_3')}
                  </>
                )}
              </Alert>
            </Box>
          }
        </div>
      </div>
    </div>
  );
};
