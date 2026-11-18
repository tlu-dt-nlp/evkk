import { describe, expect, it } from 'vitest';
import { getNoticeStatus, NoticeStatus, toAlertSeverity } from './NoticeConstants';

describe('getNoticeStatus', () => {
  const now = new Date('2026-06-01T12:00:00Z');

  it('is active without a validity period or within it', () => {
    expect(getNoticeStatus({}, now)).toBe(NoticeStatus.ACTIVE);
    expect(getNoticeStatus({ validFrom: '2026-06-01T11:00:00Z' }, now)).toBe(NoticeStatus.ACTIVE);
    expect(getNoticeStatus({ validFrom: '2026-06-01T11:00:00Z', validTo: '2026-06-01T13:00:00Z' }, now))
      .toBe(NoticeStatus.ACTIVE);
  });

  it('is scheduled before the start time', () => {
    expect(getNoticeStatus({ validFrom: '2026-06-01T12:00:01Z' }, now)).toBe(NoticeStatus.SCHEDULED);
  });

  it('is expired from the end time on', () => {
    expect(getNoticeStatus({ validFrom: '2026-06-01T10:00:00Z', validTo: '2026-06-01T12:00:00Z' }, now))
      .toBe(NoticeStatus.EXPIRED);
  });
});

describe('toAlertSeverity', () => {
  it('maps the backend severity to the MUI Alert severity', () => {
    expect(toAlertSeverity('WARNING')).toBe('warning');
    expect(toAlertSeverity(undefined)).toBe('info');
  });
});
