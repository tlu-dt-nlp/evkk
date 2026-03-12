import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Tab } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { useEditorContext } from './providers/EditorProvider';
import CorrectorView from './views/CorrectorView/CorrectorView';
import './CorrectorPage.css';
import { tabValueMap, ToggleButtonCategories } from './const/ToggleButtonConstantsV2';
import { useGetCorrectorResult } from '../../hooks/service/ToolsService';
import { GRAMMARCHECKER } from '../correction/const/Constants';
import CorrectorLayout from './views/CorrectorLayout/CorrectorLayout';
import TextLevelView from './views/TextLevelView/TextLevelView';
import ComplexityView from './views/ComplexityView/ComplexityView';
import VocabularyView from './views/VocabularyView/VocabularyView';
import GenericTabs from '../../components/GenericTabs';

export default function CorrectorPage() {
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
    <TabPanel sx={{ padding: 0 }} value={tabValueMap.CORRECTOR}><CorrectorView /></TabPanel>,
    <TabPanel sx={{ padding: 0 }} value={tabValueMap.PROFICIENCY_LEVEL}><TextLevelView /></TabPanel>,
    <TabPanel sx={{ padding: 0 }} value={tabValueMap.COMPLEXITY}><ComplexityView /></TabPanel>,
    <TabPanel sx={{ padding: 0 }} value={tabValueMap.VOCABULARY}><VocabularyView /></TabPanel>
  ];

  const handleChange = async (event, newValue) => {
    setValue(newValue);
    setSelectedSubTab(ToggleButtonCategories[newValue][0].value);
    if (initialText !== text && Object.keys(errorResponse).length !== 0) {
      setInitialText(text);
      const result = await getCorrectorResult({ tekst: text, model: GRAMMARCHECKER });
      setErrorResponse(result);
    }
  };

  return (
    <Box className="global-page-content-container">
      <div className="global-page-content-container-inner correction-container-inner">
        <Box className="tab-context-wrapper" sx={{ width: '100%' }}>
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
            <CorrectorLayout selectedTab={value} errorListSlot={errorBoxTabPanels} />
          </TabContext>
        </Box>
      </div>
    </Box>
  );
};
