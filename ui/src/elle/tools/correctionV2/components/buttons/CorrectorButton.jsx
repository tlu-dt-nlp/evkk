import { useTranslation } from 'react-i18next';
import { useGetCorrectorResult } from '../../../../hooks/service/ToolsService';
import { Button } from '@mui/material';
import { DefaultButtonStyle } from '../../../../const/StyleConstants';
import { GRAMMARCHECKER } from '../../../correction/const/Constants';
import { useEditorContext } from '../../providers/EditorProvider';

export default function CorrectorButton() {
  const { t } = useTranslation();
  const { setErrorResponse, text, setInitialText } = useEditorContext((state) => ({
    setErrorResponse: state.setErrorResponse,
    text: state.text,
    setInitialText: state.setInitialText
  }));

  const { getCorrectorResult } = useGetCorrectorResult();

  const handleClick = async () => {
    const result = await getCorrectorResult({ tekst: text, model: GRAMMARCHECKER });
    setInitialText(text);
    setErrorResponse(result);
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
