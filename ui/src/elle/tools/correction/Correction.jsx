import './styles/CorrectionCommon.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Tab } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { useEditorContext } from './providers/EditorProvider';
import './Correction.css';
import { tabValueMap, ToggleButtonCategories } from './constants/tabConfig';
import TextLevelView from './views/TextLevelView';
import ComplexityView from './views/ComplexityView';
import VocabularyView from './views/VocabularyView';
import GenericTabs from '../../components/GenericTabs';
import CorrectorButtonGroup from './components/buttons/CorrectorButtonGroup';
import CorrectorInput from './components/editor/CorrectorInput';
import CorrectorButton from './components/buttons/CorrectorButton';
import CorrectionInfoIcon from './components/info/CorrectionInfoIcon';
import CorrectorInfo from './components/info/CorrectorInfo';
import TextLevelInfo from './components/info/TextLevelInfo';
import ComplexityInfo from './components/info/ComplexityInfo';
import VocabularyInfo from './components/info/VocabularyInfo';
import ErrorAccordion from './components/errors/ErrorAccordion';
import { useAnalytics } from '../../context/AnalyticsContext';

const infoContentMap = {
  [tabValueMap.CORRECTOR]: <CorrectorInfo />,
  [tabValueMap.PROFICIENCY_LEVEL]: <TextLevelInfo />,
  [tabValueMap.COMPLEXITY]: <ComplexityInfo />,
  [tabValueMap.VOCABULARY]: <VocabularyInfo />
};

export default function Correction() {
  const { reanalyzeIfStale, setSelectedSubTab } = useEditorContext();
  const { t } = useTranslation();
  const { trackEvent } = useAnalytics();
  const [value, setValue] = useState(tabValueMap.CORRECTOR);

  const tabValues = [
    <Tab key={tabValueMap.CORRECTOR} label={t('corrector_proofreading')} value={tabValueMap.CORRECTOR} />,
    <Tab key={tabValueMap.PROFICIENCY_LEVEL} label={t('corrector_proficiency_level')}
         value={tabValueMap.PROFICIENCY_LEVEL} />,
    <Tab key={tabValueMap.COMPLEXITY} label={t('corrector_complexity')} value={tabValueMap.COMPLEXITY} />,
    <Tab key={tabValueMap.VOCABULARY} label={t('corrector_vocabulary')} value={tabValueMap.VOCABULARY} />
  ];

  const errorBoxTabPanels = [
    <TabPanel key={tabValueMap.CORRECTOR} sx={{ padding: 0 }} value={tabValueMap.CORRECTOR}>
      <ErrorAccordion />
    </TabPanel>,
    <TabPanel key={tabValueMap.PROFICIENCY_LEVEL} sx={{ padding: 0 }} value={tabValueMap.PROFICIENCY_LEVEL}>
      <TextLevelView />
    </TabPanel>,
    <TabPanel key={tabValueMap.COMPLEXITY} sx={{ padding: 0 }} value={tabValueMap.COMPLEXITY}>
      <ComplexityView />
    </TabPanel>,
    <TabPanel key={tabValueMap.VOCABULARY} sx={{ padding: 0 }} value={tabValueMap.VOCABULARY}>
      <VocabularyView />
    </TabPanel>
  ];

  const handleChange = async (_, newValue) => {
    setValue(newValue);
    setSelectedSubTab(ToggleButtonCategories[newValue][0].value);
    trackEvent('Correction', 'main-tab-change', newValue);
    await reanalyzeIfStale();
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
                  <CorrectorInput tab={value} />
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
