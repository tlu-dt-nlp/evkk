import { Alert, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../providers/EditorProvider';
import ComplexityAccordionV2 from '../components/accordions/ComplexityAccordionV2';

export default function ComplexityView() {
  const { t } = useTranslation();

  const { errorResponse } = useEditorContext((state) => ({
    errorResponse: state.errorResponse
  }));

  const content = (() => {
    if (!errorResponse || Object.entries(errorResponse).length === 0) {
      return (
        <Box className="corrector-right-inner">
          <Alert severity="info" className="level-tab-short-text-notice">
            {t('corrector_complexity_gray_box')}
          </Alert>
        </Box>
      );
    }
    return <ComplexityAccordionV2 complexityAnswer={errorResponse} />;
  })();

  return (
    <div className="corrector-border-box">
      <div className="d-flex gap-2 flex-wrap">{content}</div>
    </div>
  );
}
