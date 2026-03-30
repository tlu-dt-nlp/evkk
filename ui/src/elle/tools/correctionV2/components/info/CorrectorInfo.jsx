import NewTabHyperlink from '../../../../components/NewTabHyperlink';
import { CORRECTION_TAB_LINK } from '../../../correction/const/PathConstants';
import Translate from '../../../../components/Translate';

export default function CorrectorInfo() {

  return (
    <Translate
      i18nKey="corrector_proofreading_infobox"
      components={{
        linkTag: <NewTabHyperlink path={CORRECTION_TAB_LINK} />
      }}
    />
  );
}
