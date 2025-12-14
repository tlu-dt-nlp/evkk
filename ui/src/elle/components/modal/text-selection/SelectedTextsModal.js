import { Alert, Chip } from '@mui/material';
import { ElleDefaultChip } from '../../../const/StyleConstants';
import React, { useEffect, useState } from 'react';
import { changeCorpusTexts, changeOwnTexts, queryStore } from '../../../store/QueryStore';
import { useTranslation } from 'react-i18next';
import ModalBase from '../ModalBase';
import './styles/SelectedTextsModal.css';

export default function SelectedTextsModal({ isOpen, setIsOpen }) {

  const { t } = useTranslation();
  const [corpusTextsSelected, setCorpusTextsSelected] = useState(0);
  const [ownTextsSelected, setOwnTextsSelected] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  queryStore.subscribe(() => {
    refreshData();
  });

  const refreshData = () => {
    const storeState = queryStore.getState();
    setCorpusTextsSelected(storeState.corpusTextIds !== null
      ? storeState.corpusTextIds.length
      : 0
    );
    setOwnTextsSelected(storeState.ownTexts !== null);
  };

  const handleChipDelete = type => queryStore.dispatch(
    type === ChipDeleteType.CORPUS_TEXTS
      ? changeCorpusTexts(null)
      : changeOwnTexts(null)
  );

  return (
    <ModalBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="query_results_saved_for_analysis"
      innerClassName="selected-texts-modal"
    >
      <span className="chip-container">
        {corpusTextsSelected < 1 && ownTextsSelected < 1 &&
          <Alert severity="warning">
            {t('tools_warning_no_texts_saved')}
          </Alert>
        }
        {corpusTextsSelected > 0 &&
          <Chip
            sx={ElleDefaultChip}
            avatar={
              <div className="number-avatar">
                {corpusTextsSelected > 1 ? corpusTextsSelected : 1}
              </div>
            }
            label={
              corpusTextsSelected > 1
                ? t('query_results_saved_for_analysis_corpus_plural', { amount: corpusTextsSelected })
                : t('query_results_saved_for_analysis_corpus')
            }
            variant="outlined"
            onDelete={() => handleChipDelete(ChipDeleteType.CORPUS_TEXTS)}
          />
        }
        {ownTextsSelected > 0 &&
          <Chip
            sx={ElleDefaultChip}
            label={t('query_results_saved_for_analysis_own_texts')}
            variant="outlined"
            onDelete={() => handleChipDelete(ChipDeleteType.OWN_TEXTS)}
          />
        }
      </span>
    </ModalBase>
  );
}

const ChipDeleteType = {
  CORPUS_TEXTS: 'CORPUS_TEXTS',
  OWN_TEXTS: 'OWN_TEXTS'
};
