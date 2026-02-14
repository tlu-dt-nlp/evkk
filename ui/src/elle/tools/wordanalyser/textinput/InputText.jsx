import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AnalyseContext } from '../Contexts';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box } from '@mui/material';

export const InputText = ({ onMarkWords, onWordSelect, onWordInfo }) => {
  const analyse = useContext(AnalyseContext)[0];
  const [idNumber, setIdNumber] = useState(0);
  const handleWord = useCallback((e) => {
    onWordInfo(e);
    onWordSelect(e);
  }, [onWordInfo, onWordSelect]);
  const markedIds = useMemo(() => {
    const ids = analyse?.ids ?? [];
    const selected = new Set(onMarkWords ?? []);
    return ids.filter(id => selected.has(id));
  }, [analyse?.ids, onMarkWords]);

  useEffect(() => {
    setIdNumber(0);
    if (markedIds.length > 0) {
      onWordInfo(markedIds[0]);
    }
    // eslint-disable-next-line
  }, [onMarkWords]);

  const renderWord = (ids, i, className, analysedWords, onClickHandler) => (
    <span
      id={ids[i]}
      className={className}
      key={ids[i]}
      onClick={(e) => onClickHandler(e.target.id)}
    >
      {analysedWords[i]}
    </span>
  );

  const markedSet = useMemo(() => new Set(onMarkWords ?? []), [onMarkWords]);

  const updatedText = useMemo(() => {
    let text = analyse.text;
    const analysedWords = analyse.wordsOrig;
    const ids = analyse.ids;
    const content = [];

    if (!analysedWords) return null;

    for (let i = 0; i < analysedWords.length; i++) {
      const index = text.indexOf(analysedWords[i]);
      const isMarked = markedIds.includes(ids[i]);

      if (index > 0) {
        let sequence = text.slice(0, index);
        // check for line breaks and preserve them
        let match = /[\r\n]/.exec(sequence);
        while (match) {
          if (match.index > 0) {
            content.push(sequence.slice(0, match.index));
            content.push(<br key={index} />);
            sequence = sequence.substring(match.index + 1, sequence.length);
            match = /[\r\n]/.exec(sequence);
          } else {
            content.push(<br key={index} />);
            sequence = sequence.substring(1, sequence.length);
            match = /[\r\n]/.exec(sequence);
          }
        }
        content.push(sequence);
      }

      const markedClassName = ids[i] === markedIds[idNumber]
        ? 'word blue'
        : 'word marked';

      content.push(renderWord(
        ids,
        i,
        isMarked ? markedClassName : 'word',
        analysedWords,
        handleWord
      ));
      text = text.substring(index + analysedWords[i].length, text.length);
    }

    content.push(text);
    return <>{content}</>;
    // eslint-disable-next-line
  }, [analyse, markedSet, handleWord, markedIds, idNumber]);

  const handleLeftIconClick = () => {
    if (idNumber > 0) {
      onWordInfo(markedIds[idNumber - 1]);
      setIdNumber(n => n - 1);
    }
  };

  const handleRightIconClick = () => {
    if (idNumber < markedIds.length - 1) {
      onWordInfo(markedIds[idNumber + 1]);
      setIdNumber(n => n + 1);
    }
  };

  return (
    <>
      <div className="text-input-div">
        {updatedText}
      </div>
      <span className="word-highlight-buttons">
        {idNumber > 0 ? (
          <KeyboardArrowLeftIcon
            fontSize="large"
            cursor="pointer"
            onClick={handleLeftIconClick}
          />
        ) : (
          <Box className="empty-button" />
        )}
        {idNumber < markedIds.length - 1 ? (
          <KeyboardArrowRightIcon
            fontSize="large"
            cursor="pointer"
            onClick={handleRightIconClick}
          />
        ) : null}
      </span>
    </>
  );
};
