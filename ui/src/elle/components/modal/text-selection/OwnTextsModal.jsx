import ModalBase from '../ModalBase';
import TextUpload from '../../TextUpload';
import { Button, TextField } from '@mui/material';
import { DefaultButtonStyle } from '../../../const/StyleConstants';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { changeOwnTexts, queryStore } from '../../../store/QueryStore';

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
      <TextField
        multiline
        rows={8}
        label={t('textupload_primary_modal_title')}
        value={textInput}
        onChange={e => setTextInput(e.target.value)}
        slotProps={{
          input: {
            endAdornment: <TextUpload sendTextFromFile={setTextInput} />
          }
        }}
      />
      <Button
        variant="contained"
        sx={DefaultButtonStyle}
        disabled={textInput === ''}
        onClick={handleSubmit}
      >
        {t('textupload_primary_modal_save')}
      </Button>
    </ModalBase>
  );
}
