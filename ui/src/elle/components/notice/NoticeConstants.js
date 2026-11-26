export const NoticeSeverity = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
  SUCCESS: 'SUCCESS'
};

export const NoticeStatus = {
  ACTIVE: 'ACTIVE',
  SCHEDULED: 'SCHEDULED',
  EXPIRED: 'EXPIRED'
};

export const NoticeStatusChipColor = {
  [NoticeStatus.ACTIVE]: 'success',
  [NoticeStatus.SCHEDULED]: 'info',
  [NoticeStatus.EXPIRED]: 'default'
};

export const toAlertSeverity = (severity) => severity?.toLowerCase() ?? 'info';

export const getNoticeStatus = (notice, now = new Date()) => {
  if (notice.validFrom && new Date(notice.validFrom) > now) {
    return NoticeStatus.SCHEDULED;
  }
  if (notice.validTo && new Date(notice.validTo) <= now) {
    return NoticeStatus.EXPIRED;
  }
  return NoticeStatus.ACTIVE;
};
