import { InputText } from './InputText';
import { useContext, useEffect, useState } from 'react';
import '../../../translations/i18n';
import { TabContext } from '../Contexts';
import i18n from 'i18next';

export const Input = ({
                        onSubmit,
                        onMarkWords,
                        onWordSelect,
                        onWordInfo,
                        onReset,
                        isTextTooLong,
                        isFinishedLoading
                      }) => {
  const [selectedWords, setSelectedWords] = useState(onMarkWords);
  const setTableValue = useContext(TabContext)[1];

  useEffect(() => {
    const handleLanguageChange = () => {
      resubmit();
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (JSON.stringify(selectedWords) !== JSON.stringify(onMarkWords)) {
      setSelectedWords(onMarkWords);
    }
  }, [onMarkWords, selectedWords]);

  const resubmit = () => {
    resetAnalyser();
    onSubmit();
  };

  const resetAnalyser = () => {
    setTableValue(0);
    onReset();
  };

  if (isTextTooLong || !isFinishedLoading) return null;

  return (
    <div>
      <InputText
        onMarkWords={onMarkWords}
        onWordSelect={onWordSelect}
        onWordInfo={onWordInfo}
      />
    </div>
  );
};
