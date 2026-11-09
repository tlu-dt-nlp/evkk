import { useState } from 'react';
import { Box, Tab, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ToggleButtonCategories } from '../../constants/tabConfig';
import { useEditorContext } from '../../providers/EditorProvider';
import GenericTabs from '../../../../components/GenericTabs';
import { useAnalytics } from '../../../../context/AnalyticsContext';

export default function CorrectorButtonGroup({ selectedTab }) {
  const { reanalyzeIfStale, setSelectedSubTab } = useEditorContext();

  const toggleButtons = ToggleButtonCategories[selectedTab];

  const { trackEvent } = useAnalytics();

  const [value, setValue] = useState(toggleButtons[0].value);

  const { t } = useTranslation();

  const handleChange = async (_, newValue) => {
    setValue(newValue);
    trackEvent('Correction', 'sub-tab-change', newValue);
    await reanalyzeIfStale();
    setSelectedSubTab(newValue);
  };

  return (
    <Box className="d-flex" sx={{ minWidth: 0 }}>
      <GenericTabs
        className="correction-toggle-button-group"
        value={value}
        handleChange={handleChange}
      >
        {toggleButtons.map(button => (
          <Tab
            key={button.title}
            value={button.value}
            label={
              <Tooltip
                key={button.title}
                placement="top"
                title={t(button.title)}
              >
                <span>{t(button.text)}</span>
              </Tooltip>
            }
          />
        ))}
      </GenericTabs>
    </Box>
  );
}
