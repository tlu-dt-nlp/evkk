import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { DefaultButtonStyle } from '../../../../const/StyleConstants';
import { useEditorContext } from '../../providers/EditorProvider';
import { useAnalytics } from '../../../../context/AnalyticsContext';

export default function CorrectorButton() {
  const { trackToolAnalyze } = useAnalytics();
  const { t } = useTranslation();
  const { text, analyzeText } = useEditorContext((state) => ({
    text: state.text
  }));

  const handleClick = async () => {
    await analyzeText(text);
    trackToolAnalyze('corrector');
  };

  return (
    <Button
      sx={{ ...DefaultButtonStyle, borderRadius: '5px', marginTop: '1rem' }}
      variant="contained"
      onClick={handleClick}
      disabled={text.length === 0}
    >
      {t('analyse_button')}
    </Button>
  );
}
