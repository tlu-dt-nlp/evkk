import {
  closestCenter,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { useCallback, useMemo, useState } from 'react';
import { useMatchingBankStickySizing } from './useMatchingBankStickySizing';

export const MATCHING_BANK_DROPPABLE_ID = 'matching-bank';
export const MATCHING_BLANK_ID_PREFIX = 'matching-blank-';
export const MATCHING_FILLED_ID_PREFIX = 'matching-filled-';
const MATCHING_OPTION_ID_PREFIX = 'matching-option-';

export function useMatchingExercise({
                                      contentBlanks,
                                      isMatchingFormat,
                                      showMatchingBank,
                                      isAnswered,
                                      answers,
                                      handleAnswerChange,
                                      setAnswers
                                    }) {
  const [selectedMatchingOptionId, setSelectedMatchingOptionId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(TouchSensor)
  );

  const matchingOptions = useMemo(() => {
    if (!showMatchingBank) {
      return [];
    }

    return (contentBlanks ?? [])
      .map((blank, index) => ({ id: `${MATCHING_OPTION_ID_PREFIX}${index}`, value: blank.hint }))
      .filter(item => !!item.value);
  }, [contentBlanks, showMatchingBank]);

  const matchingOptionById = useMemo(() => (
    new Map(matchingOptions.map(option => [option.id, option.value]))
  ), [matchingOptions]);

  const selectedMatchingValue = useMemo(() => {
    if (!selectedMatchingOptionId) {
      return null;
    }

    return matchingOptionById.get(selectedMatchingOptionId) ?? null;
  }, [matchingOptionById, selectedMatchingOptionId]);

  const availableMatchingOptions = useMemo(() => {
    if (!showMatchingBank) {
      return [];
    }

    if (isMatchingFormat) {
      return matchingOptions.filter(option => !new Set(answers).has(option.value));
    }

    return matchingOptions;
  }, [answers, isMatchingFormat, matchingOptions, showMatchingBank]);

  const { matchingBankRef, matchingBankStyle } = useMatchingBankStickySizing({
    showMatchingBank,
    isAnswered,
    availableMatchingOptionsCount: availableMatchingOptions.length
  });

  const clearMatchingSelection = useCallback(() => {
    setSelectedMatchingOptionId(null);
  }, []);

  const matchingCollisionDetection = useCallback(args => {
    const activeId = String(args.active?.id ?? '');
    const dragType = getMatchingDragType(activeId);

    const eligibleDroppableContainers = getEligibleDroppableContainers(args.droppableContainers, dragType);
    const collisionArgs = {
      ...args,
      droppableContainers: eligibleDroppableContainers
    };

    return resolveMatchingCollisions(collisionArgs, dragType, args.pointerCoordinates);
  }, []);

  const handleMatchingDrop = useCallback(event => {
    const { active, over } = event;
    if (isAnswered || !active || !over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);
    const droppedOnBank = overId === MATCHING_BANK_DROPPABLE_ID || overId.startsWith(MATCHING_OPTION_ID_PREFIX);

    // return word to bank
    if (droppedOnBank && activeId.startsWith(MATCHING_FILLED_ID_PREFIX)) {
      const sourceIndex = getBlankIndexFromId(activeId, MATCHING_FILLED_ID_PREFIX);
      if (sourceIndex !== null) {
        handleAnswerChange(sourceIndex, null);
      }
      clearMatchingSelection();
      return;
    }

    // dropped onto nothing
    if (!overId.startsWith(MATCHING_BLANK_ID_PREFIX)) {
      return;
    }

    const targetIndex = getBlankIndexFromId(overId, MATCHING_BLANK_ID_PREFIX);
    if (targetIndex === null) {
      return;
    }

    // word from bank dropped onto a blank
    const droppedOptionValue = matchingOptionById.get(activeId);
    if (droppedOptionValue) {
      handleAnswerChange(targetIndex, droppedOptionValue);
      clearMatchingSelection();
      return;
    }

    if (!activeId.startsWith(MATCHING_FILLED_ID_PREFIX)) {
      return;
    }

    const sourceIndex = getBlankIndexFromId(activeId, MATCHING_FILLED_ID_PREFIX);
    if (sourceIndex === null || sourceIndex === targetIndex) {
      return;
    }

    // swap answers
    setAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      const sourceValue = updatedAnswers[sourceIndex];
      const targetValue = updatedAnswers[targetIndex];

      updatedAnswers[targetIndex] = sourceValue ?? null;
      updatedAnswers[sourceIndex] = targetValue ?? null;
      return updatedAnswers;
    });

    clearMatchingSelection();
  }, [clearMatchingSelection, handleAnswerChange, isAnswered, matchingOptionById, setAnswers]);

  const handleMatchingOptionClick = useCallback(optionId => {
    if (isAnswered) {
      return;
    }

    setSelectedMatchingOptionId(prev => prev === optionId ? null : optionId);
  }, [isAnswered]);

  const handleMatchingBlankClick = useCallback(answerIndex => {
    if (isAnswered) {
      return;
    }

    const selectedValue = selectedMatchingOptionId
      ? matchingOptionById.get(selectedMatchingOptionId)
      : null;

    if (selectedValue) {
      handleAnswerChange(answerIndex, selectedValue);
      clearMatchingSelection();
      return;
    }

    if (answers[answerIndex]) {
      handleAnswerChange(answerIndex, null);
    }
  }, [answers, clearMatchingSelection, handleAnswerChange, isAnswered, matchingOptionById, selectedMatchingOptionId]);

  const handleMatchingBlankKeyDown = useCallback((answerIndex, event) => {
    if (isAnswered) {
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      handleAnswerChange(answerIndex, null);
    }
  }, [handleAnswerChange, isAnswered]);

  return {
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
  };
}

const getBlankIndexFromId = (id, prefix) => {
  const index = Number(id.replace(prefix, ''));
  return Number.isNaN(index) ? null : index;
};

const getMatchingDragType = activeId => {
  if (activeId.startsWith(MATCHING_FILLED_ID_PREFIX)) {
    return MatchingDragType.FILLED_BLANK;
  }

  if (activeId.startsWith(MATCHING_OPTION_ID_PREFIX)) {
    return MatchingDragType.BANK_OPTION;
  }

  return MatchingDragType.OTHER;
};

const isEligibleDropId = (dropId, dragType) => {
  if (dropId.startsWith(MATCHING_BLANK_ID_PREFIX)) {
    return true;
  }

  if (dragType === MatchingDragType.FILLED_BLANK) {
    // on bank itself + on bank's options are both allowed
    return dropId === MATCHING_BANK_DROPPABLE_ID || dropId.startsWith(MATCHING_OPTION_ID_PREFIX);
  }

  return false;
};

const getEligibleDroppableContainers = (droppableContainers, dragType) => {
  if (dragType === MatchingDragType.OTHER) {
    return [];
  }

  return droppableContainers.filter(container => {
    const dropId = String(container.id);
    return isEligibleDropId(dropId, dragType);
  });
};

const getBankPriorityPointerCollisions = (pointerCollisions, dragType) => {
  if (dragType !== MatchingDragType.FILLED_BLANK) {
    return pointerCollisions;
  }

  const bankCollision = pointerCollisions.find(collision => String(collision.id) === MATCHING_BANK_DROPPABLE_ID);
  if (bankCollision) {
    return [bankCollision];
  }

  return pointerCollisions;
};

const resolveMatchingCollisions = (collisionArgs, dragType, pointerCoordinates) => {
  const pointerCollisions = pointerWithin(collisionArgs);
  if (pointerCollisions.length > 0) {
    return getBankPriorityPointerCollisions(pointerCollisions, dragType);
  }

  // for dragged element overlap with a dropzone to be detected
  const intersectionCollisions = rectIntersection(collisionArgs);
  if (intersectionCollisions.length > 0) {
    return intersectionCollisions;
  }

  // for keyboard navigation
  if (!pointerCoordinates) {
    return closestCenter(collisionArgs);
  }

  return [];
};

const MatchingDragType = {
  FILLED_BLANK: 'filledBlank',
  BANK_OPTION: 'bankOption',
  OTHER: 'other'
};
