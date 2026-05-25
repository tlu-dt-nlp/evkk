import { useDraggable, useDroppable } from '@dnd-kit/core';

export function MatchingOption({ id, value, selected, disabled, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({ id, disabled });

  const {
    onClick: draggableOnClick,
    ...draggableListeners
  } = listeners ?? {};

  return (
    <button
      ref={setNodeRef}
      type="button"
      className={`matching-option ${selected ? 'selected' : ''}`}
      style={getStyle(transform, isDragging)}
      disabled={disabled}
      aria-pressed={selected}
      onClick={event => {
        event.stopPropagation();
        draggableOnClick?.(event);
        onClick();
      }}
      {...attributes}
      {...draggableListeners}
    >
      {value}
    </button>
  );
}

export function MatchingDropzone({ id, draggableId, value, className, dragDisabled, onClick, onKeyDown, endIcon }) {
  const effectiveDraggableId = draggableId ?? `matching-empty-${id}`;
  const isDraggableFilled = !dragDisabled && !!draggableId;
  const isReadOnly = !!dragDisabled;

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: effectiveDraggableId,
    disabled: dragDisabled || !draggableId
  });

  const {
    onClick: draggableOnClick,
    onKeyDown: draggableOnKeyDown,
    ...draggableListeners
  } = listeners ?? {};
  const { isOver, setNodeRef } = useDroppable({ id });

  const setRefs = node => {
    setNodeRef(node);
    setDraggableNodeRef(node);
  };

  const handleDropzoneClick = event => {
    draggableOnClick?.(event);
    onClick?.(event);
  };

  const handleDropzoneKeyDown = event => {
    draggableOnKeyDown?.(event);
    onKeyDown?.(event);
  };

  return (
    <button
      ref={setRefs}
      type="button"
      className={[
        'matching-dropzone',
        className,
        isOver ? 'over' : '',
        isDraggableFilled ? 'draggable' : '',
        isReadOnly ? 'readonly' : ''
      ].filter(Boolean).join(' ')}
      style={getStyle(transform, isDragging)}
      tabIndex={dragDisabled ? -1 : 0}
      onClick={handleDropzoneClick}
      onKeyDown={handleDropzoneKeyDown}
      {...attributes}
      {...draggableListeners}
    >
      <span>{value || '_____'}</span>
      {endIcon}
    </button>
  );
}

export function MatchingBankDropzone({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`matching-options-wrapper ${isOver ? 'over' : ''}`}
    >
      {children}
    </div>
  );
}

const getStyle = (transform, isDragging) => {
  return {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.6 : 1
  };
}
