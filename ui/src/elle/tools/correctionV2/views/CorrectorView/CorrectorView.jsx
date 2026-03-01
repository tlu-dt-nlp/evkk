import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import ErrorAccordionV2 from './ErrorAccordionV2/ErrorAccordionV2';
import NewTabHyperlink from '../../../../components/NewTabHyperlink';
import { CORRECTION_TAB_LINK } from '../../../correction/const/PathConstants';
import CorrectionInfoIcon from '../../../correction/components/CorrectionInfoIcon';

export default function CorrectorView() {
  const { t } = useTranslation();

  return <div>
    <CorrectionInfoIcon containerHeight={'44px'}>
      <Trans
        i18nKey="corrector_proofreading_infobox"
        components={{
          link: <NewTabHyperlink path={CORRECTION_TAB_LINK} content={t('common_here')} />
        }}
      />
    </CorrectionInfoIcon>
    <ErrorAccordionV2 />
  </div>;
};
