import ModalBase from '../ModalBase';
import TextUpload from '../../TextUpload';
import { Button } from '@mui/material';
import { DefaultButtonStyle } from '../../../const/StyleConstants';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { changeOwnTexts, queryStore } from '../../../store/QueryStore';
import './styles/OwnTextsModal.css';

export default function OwnTextsModal({ isOpen, setIsOpen }) {

  const { t } = useTranslation();
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    setTextInput(queryStore.getState().ownTexts);
  }, []);

  const handleSubmit = () => {
    queryStore.dispatch(changeOwnTexts(textInput));
    setIsOpen(false);
  };

  return (
    <ModalBase
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="own_texts"
    >
      <div>
        {t('textupload_primary_modal_title')}
      </div>
      <br />
      <div>
        <TextUpload sendTextFromFile={setTextInput} />
        <textarea
          spellCheck="false"
          className="own-texts-textarea"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        ></textarea>
        <Button
          variant="contained"
          sx={DefaultButtonStyle}
          disabled={textInput === ''}
          onClick={handleSubmit}
        >
          {t('textupload_primary_modal_save')}
        </Button>
      </div>
    </ModalBase>
  );
}
