export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('et-EE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date(dateString));
};

export const formatOptionalDate = (dateString, fallback = '–') =>
  dateString ? formatDate(dateString) : fallback;

const pad2 = (value) => String(value).padStart(2, '0');

// ISO date-time -> 'YYYY-MM-DDTHH:mm' in the browser's local time, the value format of <input type="datetime-local">
export const toDateTimeLocalInputValue = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};

// <input type="datetime-local"> value (local time) -> ISO date-time in UTC, or null when empty
export const fromDateTimeLocalInputValue = (value) => value ? new Date(value).toISOString() : null;
