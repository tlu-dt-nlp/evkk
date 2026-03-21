import { Trans, useTranslation } from 'react-i18next';
import NewTabHyperlink from '../../../../components/NewTabHyperlink';
import { CORRECTION_TAB_LINK } from '../../../correction/const/PathConstants';

export default function CorrectorInfo() {
  const { t } = useTranslation();

  return (
    <Trans
      i18nKey="corrector_proofreading_infobox"
      components={{
        link: <NewTabHyperlink path={CORRECTION_TAB_LINK} content={t('common_here')} />
      }}
    />
  );
}
