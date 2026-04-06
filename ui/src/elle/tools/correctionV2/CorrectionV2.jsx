import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Tab } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { useEditorContext } from './providers/EditorProvider';
import './CorrectionV2.css';
import { tabValueMap, ToggleButtonCategories } from './constants/tabConfig';
import { useGetCorrectorResult } from '../../hooks/service/ToolsService';
import { GRAMMARCHECKER } from '../correction/const/Constants';
import TextLevelView from './views/TextLevelView';
import ComplexityView from './views/ComplexityView';
import VocabularyView from './views/VocabularyView';
import GenericTabs from '../../components/GenericTabs';
import CorrectorButtonGroup from './components/buttons/CorrectorButtonGroup';
import CorrectorInput from './components/editor/CorrectorInput';
import CorrectorButton from './components/buttons/CorrectorButton';
import CorrectionInfoIcon from '../correction/components/CorrectionInfoIcon';
import CorrectorInfo from './components/info/CorrectorInfo';
import TextLevelInfo from './components/info/TextLevelInfo';
import ComplexityInfo from './components/info/ComplexityInfo';
import VocabularyInfo from './components/info/VocabularyInfo';
import ErrorAccordionV2 from './components/errors/ErrorAccordionV2';

const infoContentMap = {
  [tabValueMap.CORRECTOR]: <CorrectorInfo />,
  [tabValueMap.PROFICIENCY_LEVEL]: <TextLevelInfo />,
  [tabValueMap.COMPLEXITY]: <ComplexityInfo />,
  [tabValueMap.VOCABULARY]: <VocabularyInfo />
};

export default function CorrectionV2() {
  const {
    setInitialText,
    initialText,
    text,
    errorResponse,
    setErrorResponse,
    setSelectedSubTab
  } = useEditorContext(state => ({
    setInitialText: state.setInitialText,
    initialText: state.initialText,
    text: state.text,
    errorResponse: state.errorResponse,
    setErrorResponse: state.setErrorResponse,
    setSelectedSubTab: state.setSelectedSubTab
  }));
  const { getCorrectorResult } = useGetCorrectorResult();
  const { t } = useTranslation();
  const [value, setValue] = useState(tabValueMap.CORRECTOR);

  const tabValues = [
    <Tab label={t('corrector_proofreading')} value={tabValueMap.CORRECTOR} />,
    <Tab label={t('corrector_proficiency_level')} value={tabValueMap.PROFICIENCY_LEVEL} />,
    <Tab label={t('corrector_complexity')} value={tabValueMap.COMPLEXITY} />,
    <Tab label={t('corrector_vocabulary')} value={tabValueMap.VOCABULARY} />
  ];

  const errorBoxTabPanels = [
    <TabPanel sx={{ padding: 0 }} value={tabValueMap.CORRECTOR}>
      <ErrorAccordionV2 />
    </TabPanel>,
    <TabPanel sx={{ padding: 0 }} value={tabValueMap.PROFICIENCY_LEVEL}>
      <TextLevelView />
    </TabPanel>,
    <TabPanel sx={{ padding: 0 }} value={tabValueMap.COMPLEXITY}>
      <ComplexityView />
    </TabPanel>,
    <TabPanel sx={{ padding: 0 }} value={tabValueMap.VOCABULARY}>
      <VocabularyView />
    </TabPanel>
  ];

  const handleChange = async (_, newValue) => {
    setValue(newValue);
    setSelectedSubTab(ToggleButtonCategories[newValue][0].value);
    if (initialText !== text && Object.keys(errorResponse).length !== 0) {
      setInitialText(text);
      const result = await getCorrectorResult({
        tekst: text,
        model: GRAMMARCHECKER
      });
      setErrorResponse(result);
    }
  };

  return (
    <Box className="global-page-content-container">
      <div className="global-page-content-container-inner correction-container-inner">
        <Box className="correction-tab-context-wrapper">
          <TabContext value={value}>
            <Box className="correction-tab-group-box">
              <GenericTabs
                value={value}
                handleChange={handleChange}
                leftPadding={true}
              >
                {tabValues}
              </GenericTabs>
            </Box>
            <Box className="correction-layout">
              <div className="correction-button-group">
                <CorrectorButtonGroup key={value} selectedTab={value} />
                <CorrectionInfoIcon fixedHeight>
                  {infoContentMap[value]}
                </CorrectionInfoIcon>
              </div>
              <div className="correction-input-group">
                <div className="correction-input-group-inner">
                  <CorrectorInput />
                  <CorrectorButton />
                </div>
                <div className="correction-input-group-inner">
                  {errorBoxTabPanels}
                </div>
              </div>
            </Box>
          </TabContext>
        </Box>
      </div>
    </Box>
  );
}
