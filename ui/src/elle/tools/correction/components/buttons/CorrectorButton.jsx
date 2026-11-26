import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import { DefaultButtonStyle } from '../../../../const/StyleConstants';
import { useEditorContext } from '../../providers/EditorProvider';

export default function CorrectorButton() {
  const { t } = useTranslation();
  const { text, analyzeText, isAnalyzing } = useEditorContext((state) => ({
    text: state.text
  }));

  const handleClick = async () => {
    await analyzeText(text, { checkLanguage: true, track: true });
  };

  return (
    <Button
      sx={{ ...DefaultButtonStyle, borderRadius: '5px', marginTop: '1rem' }}
      variant="contained"
      onClick={handleClick}
      disabled={text.length === 0 || isAnalyzing}
    >
      {t('analyse_button')}
    </Button>
  );
}
