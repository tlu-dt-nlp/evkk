import { DefaultButtonStyle } from '../../const/StyleConstants';
import { Alert, Button, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useSubmitExerciseAnswers } from '../../hooks/service/ExerciseGeneratorService';
import './styles/Exercise.css';
import TooltipOnText from '../../components/tooltip/TooltipOnText';

export default function Exercise({ content, setContent, setParamsExpanded }) {

  const { t } = useTranslation();
  const [answers, setAnswers] = useState([]);
  const [response, setResponse] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showMissingAnswers, setShowMissingAnswers] = useState(false);
  const { submitExerciseAnswers } = useSubmitExerciseAnswers();

  const textBlanks = useMemo(() => content.blanks ?? [], [content.blanks]);

  const sentenceBlankBaseIndexes = useMemo(() => {
    let total = 0;
    return (content.sentencesWithBlanks ?? []).map(sentenceWithBlanks => {
      const baseIndex = total;
      total += sentenceWithBlanks.blanks?.length ?? 0;
      return baseIndex;
    });
  }, [content.sentencesWithBlanks]);

  const totalBlankCount = useMemo(() => {
    const sentenceBasedBlankCount = (content.sentencesWithBlanks ?? []).reduce(
      (sum, sentenceWithBlanks) => sum + (sentenceWithBlanks.blanks?.length ?? 0),
      0
    );

    if (sentenceBasedBlankCount > 0) {
      return sentenceBasedBlankCount;
    }

    return textBlanks.length;
  }, [content.sentencesWithBlanks, textBlanks]);

  const incorrectIndexes = useMemo(() => {
    if (!Array.isArray(response)) {
      return new Set();
    }

    return new Set(response.map(item => item.index));
  }, [response]);

  const incorrectAnswerByIndex = useMemo(() => {
    if (!Array.isArray(response)) {
      return new Map();
    }

    return new Map(response.map(item => [item.index, item]));
  }, [response]);

  const missingAnswerIndexes = useMemo(() => {
    const missingIndexes = new Set();

    for (let i = 0; i < totalBlankCount; i++) {
      const answer = answers[i];
      if (typeof answer !== 'string' || answer.trim().length === 0) {
        missingIndexes.add(i);
      }
    }

    return missingIndexes;
  }, [answers, totalBlankCount]);

  useEffect(() => {
    setAnswers(new Array(totalBlankCount).fill(null));
  }, [totalBlankCount]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setAnswers([]);
    setResponse(null);
    setIsAnswered(false);
    setShowMissingAnswers(false);
  }, [content]);

  const handleAnswerChange = (answerIndex, value) => {
    setAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[answerIndex] = value;
      return updatedAnswers;
    });
  };

  const getAnswerResultClass = answerIndex => {
    if (!isAnswered) {
      return '';
    }

    return incorrectIndexes.has(answerIndex) ? 'answer-incorrect' : 'answer-correct';
  };

  const getAnswerClass = answerIndex => {
    if (!isAnswered && showMissingAnswers && missingAnswerIndexes.has(answerIndex)) {
      return 'answer-missing';
    }

    return getAnswerResultClass(answerIndex);
  };

  const renderSingleBlank = (blank, answerIndex, key) => {
    const answerValue = answers[answerIndex] ?? '';
    const incorrectAnswer = incorrectAnswerByIndex.get(answerIndex);
    const isIncorrect = !!incorrectAnswer;
    const inputWidthCh = Math.max(8, answerValue.length + 3);

    const answerIcon = isAnswered && (
      isIncorrect
        ? <ClearIcon sx={{ color: '#b91c1c' }} />
        : <CheckIcon sx={{ color: '#15803d' }} />
    );

    return (
      <span
        key={key}
        className="exercise-text-blank-wrapper"
      >
        <div className="answers-wrapper">
          <TooltipOnText
            title={incorrectAnswer?.explanation}
            disabled={!isAnswered || !isIncorrect || !incorrectAnswer.explanation}
            className="hover-tooltip"
            placement="top"
          >
            <TextField
              variant="standard"
              size="small"
              value={answerValue}
              disabled={isAnswered}
              className={getAnswerClass(answerIndex)}
              sx={{ width: `${inputWidthCh}ch` }}
              onChange={e => handleAnswerChange(answerIndex, e.target.value)}
              slotProps={{
                input: {
                  endAdornment: answerIcon
                }
              }}
            />
          </TooltipOnText>
          {isAnswered && isIncorrect && (
            <span className="expected-answer">{incorrectAnswer.correctAnswer}</span>
          )}
        </div>
        <span className="hint">
          ({blank.hint})
        </span>
    </span>
    );
  };

  const renderBlanksInText = (text, blanks, getAnswerIndex, keyPrefix, startElements = []) => {
    if (blanks.length === 0) {
      return startElements.length > 0 ? [...startElements, text] : text;
    }

    const elements = [...startElements];
    let previousEndChar = 0;

    blanks.forEach((blank, blankIndex) => {
      if (blank.startChar > previousEndChar) {
        elements.push(text.slice(previousEndChar, blank.startChar));
      }

      const answerIndex = getAnswerIndex(blankIndex);
      previousEndChar = blank.endChar;

      elements.push(renderSingleBlank(blank, answerIndex, `${keyPrefix}-${blankIndex}`));
    });

    if (previousEndChar < text.length) {
      elements.push(text.slice(previousEndChar));
    }

    return elements;
  };

  const renderTextWithBlanks = () => {
    return renderBlanksInText(
      content.textWithBlanks,
      textBlanks,
      blankIndex => blankIndex,
      'text-blank'
    );
  };

  const renderSentenceWithBlanks = (sentenceWithBlanks, sentenceIndex) => {
    const blanks = sentenceWithBlanks.blanks ?? [];

    return renderBlanksInText(
      sentenceWithBlanks.sentence,
      blanks,
      blankIndex => sentenceBlankBaseIndexes[sentenceIndex] + blankIndex,
      `sentence-${sentenceIndex}-blank`,
      [<b key={`sentence-number-${sentenceIndex}`}>{sentenceIndex + 1}. </b>]
    );
  };

  const handleSubmit = event => {
    event.preventDefault();

    setShowMissingAnswers(missingAnswerIndexes.size > 0);

    submitExerciseAnswers(content.exerciseId, answers)
      .then(response => {
        setResponse(response);
        setIsAnswered(!!response);
        window.scrollTo(0, 0);
      });
  };

  const handleGenerateNewExercise = () => {
    setContent(null);
    setParamsExpanded(true);
    window.scrollTo(0, 0);
  };

  const buildResultMessage = () => {
    return <>
      {Array.isArray(response) && response.length === 0
        ? (
          <Alert severity="success">
            {t('exercise_generator_exercise_completed_successfully')}
          </Alert>
        ) : (
          <>
            <Alert severity="info">
              {t('exercise_generator_exercise_completed_with_mistakes', {
                correctAnswers: totalBlankCount - response.length,
                totalAnswers: totalBlankCount
              })}
            </Alert>
            {response.some(item => item.explanation === null) && (
              <>
                <br />
                <Alert severity="error">
                  {t('exercise_generator_exercise_explanation_generation_failed')}
                </Alert>
              </>
            )}
          </>
        )}
      <br />
    </>;
  };

  return (
    <>
      <br /><br />
      {isAnswered && buildResultMessage()}
      {content.textWithBlanks && <p>{renderTextWithBlanks()}</p>}
      {content.sentencesWithBlanks?.map((sentenceWithBlanks, index) => (
        <p key={`${sentenceWithBlanks.sentence}-${index}`}>
          {renderSentenceWithBlanks(sentenceWithBlanks, index)}
        </p>
      ))}
      <br />
      <Button
        sx={DefaultButtonStyle}
        variant="contained"
        onClick={e => isAnswered ? handleGenerateNewExercise() : handleSubmit(e)}
      >
        {t(isAnswered ? 'exercise_generator_new_exercise' : 'exercise_generator_check_answers')}
      </Button>
    </>
  );
}
