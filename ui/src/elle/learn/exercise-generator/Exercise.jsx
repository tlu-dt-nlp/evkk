import { DefaultButtonStyle } from '../../const/StyleConstants';
import { Alert, Button, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { DndContext } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useSubmitExerciseAnswers } from '../../hooks/service/ExerciseGeneratorService';
import './styles/Exercise.css';
import TooltipOnText from '../../components/tooltip/TooltipOnText';
import { MatchingBankDropzone, MatchingDropzone, MatchingOption } from './MatchingDndComponents';
import {
  MATCHING_BANK_DROPPABLE_ID,
  MATCHING_BLANK_ID_PREFIX,
  MATCHING_FILLED_ID_PREFIX,
  useMatchingExercise
} from './hooks/useMatchingExercise';
import { ExerciseFormat } from '../../enum/ExerciseFormat';
import { ExerciseType } from '../../enum/ExerciseType';
import Translate from '../../components/Translate';

export default function Exercise({ content, exerciseFormat, exerciseType, setContent, setParamsExpanded }) {

  const { t } = useTranslation();
  const [answers, setAnswers] = useState([]);
  const [usedHybridOptionIds, setUsedHybridOptionIds] = useState(new Set());
  const [response, setResponse] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showMissingAnswers, setShowMissingAnswers] = useState(false);
  const { submitExerciseAnswers } = useSubmitExerciseAnswers();
  const isAdjectiveFillHybrid = exerciseFormat === ExerciseFormat.FILL_IN_THE_BLANKS
    && exerciseType === ExerciseType.ADJECTIVE;
  const isMatchingFormat = exerciseFormat === ExerciseFormat.MATCHING;
  const showMatchingBank = isMatchingFormat || isAdjectiveFillHybrid;

  const textBlanks = useMemo(() => (
    showMatchingBank
      ? (content.textBlankIndexes ?? [])
      : (content.blanks ?? [])
  ), [content.blanks, content.textBlankIndexes, showMatchingBank]);

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

  const toggleHybridOptionUsed = optionId => {
    if (!isAdjectiveFillHybrid || isAnswered) {
      return;
    }

    setUsedHybridOptionIds(prevUsedOptionIds => {
      const updatedUsedOptionIds = new Set(prevUsedOptionIds);
      if (updatedUsedOptionIds.has(optionId)) {
        updatedUsedOptionIds.delete(optionId);
      } else {
        updatedUsedOptionIds.add(optionId);
      }

      return updatedUsedOptionIds;
    });
  };

  const handleAnswerChange = (answerIndex, value) => {
    setAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[answerIndex] = value;
      return updatedAnswers;
    });
  };

  const {
    sensors,
    matchingCollisionDetection,
    matchingOptions,
    selectedMatchingOptionId,
    selectedMatchingValue,
    availableMatchingOptions,
    matchingBankRef,
    matchingBankStyle,
    handleMatchingDrop,
    handleMatchingOptionClick,
    handleMatchingBlankClick,
    handleMatchingBlankKeyDown,
    clearMatchingSelection
  } = useMatchingExercise({
    contentBlanks: content.blanks,
    isMatchingFormat,
    showMatchingBank,
    isAnswered,
    answers,
    handleAnswerChange,
    setAnswers
  });

  useEffect(() => {
    setAnswers(new Array(totalBlankCount).fill(null));
  }, [totalBlankCount]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setAnswers([]);
    setUsedHybridOptionIds(new Set());
    setResponse(null);
    setIsAnswered(false);
    setShowMissingAnswers(false);
    clearMatchingSelection();
  }, [clearMatchingSelection, content]);

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

  const getIncorrectAnswer = answerIndex => incorrectAnswerByIndex.get(answerIndex);

  const shouldShowAnswerTooltip = incorrectAnswer => isAnswered && !!incorrectAnswer?.explanation;

  const getAnswerIcon = answerIndex => {
    if (!isAnswered) {
      return null;
    }

    return getIncorrectAnswer(answerIndex)
      ? <ClearIcon sx={{ color: '#b91c1c' }} />
      : <CheckIcon sx={{ color: '#15803d' }} />;
  };

  const renderBlankWithSharedLayout = ({ blank, answerIndex, key, field }) => {
    const incorrectAnswer = getIncorrectAnswer(answerIndex);
    const isIncorrect = !!incorrectAnswer;

    return (
      <span
        key={key}
        className="exercise-text-blank-wrapper"
      >
        <div className={`answers-wrapper ${isMatchingFormat ? 'matching' : 'fill-in-the-blanks'}`}>
          <TooltipOnText
            title={incorrectAnswer?.explanation}
            disabled={!shouldShowAnswerTooltip(incorrectAnswer)}
            className="hover-tooltip"
            placement="top"
          >
            {field}
          </TooltipOnText>
          {isAnswered && isIncorrect && (
            <span className="expected-answer">{incorrectAnswer.correctAnswer}</span>
          )}
        </div>
        {!isAdjectiveFillHybrid && blank.hint && (
          <span className="hint">
            ({blank.hint})
          </span>
        )}
      </span>
    );
  };

  const renderSingleBlank = (blank, answerIndex, key) => {
    if (isMatchingFormat) {
      const answerValue = answers[answerIndex] ?? '';

      return renderBlankWithSharedLayout({
        blank,
        answerIndex,
        key,
        field: (
          <MatchingDropzone
            id={`${MATCHING_BLANK_ID_PREFIX}${answerIndex}`}
            draggableId={answerValue ? `${MATCHING_FILLED_ID_PREFIX}${answerIndex}` : null}
            value={answerValue}
            endIcon={getAnswerIcon(answerIndex)}
            dragDisabled={isAnswered}
            className={getAnswerClass(answerIndex)}
            onClick={() => handleMatchingBlankClick(answerIndex)}
            onKeyDown={event => handleMatchingBlankKeyDown(answerIndex, event)}
          />
        )
      });
    }

    const answerValue = answers[answerIndex] ?? '';
    const inputWidthCh = Math.max(8, answerValue.length + 3);

    return renderBlankWithSharedLayout({
      blank,
      answerIndex,
      key,
      field: (
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
              endAdornment: getAnswerIcon(answerIndex)
            }
          }}
        />
      )
    });
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

  const renderMatchingBank = readOnly => {
    const bankOptions = readOnly ? matchingOptions : availableMatchingOptions;

    return (
      <div
        className="matching-bank-sticky"
        ref={matchingBankRef}
        style={matchingBankStyle}
      >
        <p className="matching-helper-text">
          <Translate
            i18nKey={readOnly
              ? 'exercise_generator_fill_in_the_blanks_interaction_hint'
              : 'exercise_generator_matching_interaction_hint'}
          />
        </p>
        {!readOnly && selectedMatchingValue && (
          <p className="matching-selected-text">
            {t('exercise_generator_matching_selected_word_hint', {
              word: selectedMatchingValue
            })}
          </p>
        )}
        <MatchingBankDropzone id={MATCHING_BANK_DROPPABLE_ID}>
          {bankOptions.map(option => readOnly ? (
            <button
              key={option.id}
              type="button"
              className={`matching-option readonly ${usedHybridOptionIds.has(option.id) ? 'used' : ''}`}
              aria-pressed={usedHybridOptionIds.has(option.id)}
              onClick={() => toggleHybridOptionUsed(option.id)}
            >
              {option.value}
            </button>
          ) : (
            <MatchingOption
              key={option.id}
              id={option.id}
              value={option.value}
              selected={selectedMatchingOptionId === option.id}
              disabled={isAnswered}
              onClick={() => handleMatchingOptionClick(option.id)}
            />
          ))}
        </MatchingBankDropzone>
      </div>
    );
  };

  const renderExerciseTextContent = () => (
    <>
      {content.textWithBlanks && <p>{renderTextWithBlanks()}</p>}
      {content.sentencesWithBlanks?.map((sentenceWithBlanks, index) => (
        <p key={`${sentenceWithBlanks.sentence}-${index}`}>
          {renderSentenceWithBlanks(sentenceWithBlanks, index)}
        </p>
      ))}
    </>
  );

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
                totalAnswers: totalBlankCount,
                correctPercentage: Math.round((totalBlankCount - response.length) / totalBlankCount * 100)
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
      <br />
      {isAnswered && buildResultMessage()}
      {isMatchingFormat ? (
        <DndContext
          sensors={sensors}
          collisionDetection={matchingCollisionDetection}
          onDragStart={clearMatchingSelection}
          onDragEnd={handleMatchingDrop}
        >
          {!isAnswered && renderMatchingBank(false)}
          {renderExerciseTextContent()}
        </DndContext>
      ) : (
        <>
          {!isAnswered && isAdjectiveFillHybrid && renderMatchingBank(true)}
          {renderExerciseTextContent()}
        </>
      )}
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
