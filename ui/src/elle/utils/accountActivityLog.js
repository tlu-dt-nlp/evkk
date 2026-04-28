const STORAGE_KEY = 'elle_account_teegevused';
const MAX_ENTRIES = 200;

export function readAccountActivities() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function prependAccountActivity(entry) {
  if (typeof window === 'undefined') return;
  try {
    const prev = readAccountActivities();
    const row = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      type: entry.type,
      label: entry.label || '',
      createdAt: new Date().toISOString(),
      result: entry.result != null ? String(entry.result) : '',
      status: entry.status,
      openPath: entry.openPath || '',
    };
    const next = [row, ...prev].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('elle-account-activity'));
  } catch (e) {
    console.warn('prependAccountActivity', e);
  }
}
