import { Alert, Container, Stack } from '@mui/material';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import RootContext from '../../context/RootContext';
import { toAlertSeverity } from './NoticeConstants';
import { getPageKey, isNoticeShownOnPage } from './NoticePages';
import { Languages } from '../../translations/i18n';

const DISMISSED_NOTICES_KEY = 'dismissedNotices';

const getNoticeContent = (notice, language) =>
  language === Languages.ENGLISH ? notice.contentEn : notice.contentEt;

const getDismissedNoticeIds = () => {
  try {
    const value = JSON.parse(localStorage.getItem(DISMISSED_NOTICES_KEY));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const setDismissedNoticeIds = (ids) => {
  localStorage.setItem(DISMISSED_NOTICES_KEY, JSON.stringify(ids));
};

export default function NoticeBanners() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const { notices } = useContext(RootContext);
  const [dismissedIds, setDismissedIds] = useState(getDismissedNoticeIds);

  // forget dismissals of notices that are no longer active, so localStorage does not grow forever
  useEffect(() => {
    if (!notices) return;
    const activeIds = new Set(notices.map(notice => notice.id));
    const stillRelevant = getDismissedNoticeIds().filter(id => activeIds.has(id));
    setDismissedNoticeIds(stillRelevant);
    setDismissedIds(stillRelevant);
  }, [notices]);

  const pageKey = getPageKey(pathname);

  const visibleNotices = useMemo(() => (notices ?? []).filter(notice =>
    isNoticeShownOnPage(notice, pageKey)
    && !(notice.dismissible && dismissedIds.includes(notice.id))
  ), [notices, pageKey, dismissedIds]);

  const dismiss = useCallback((id) => {
    const updated = [...new Set([...getDismissedNoticeIds(), id])];
    setDismissedNoticeIds(updated);
    setDismissedIds(updated);
  }, []);

  if (!visibleNotices.length) {
    return null;
  }

  return (
    <Container disableGutters maxWidth={false} className="global-page-container notices-container">
      <Stack spacing={1}>
        {visibleNotices.map(notice => (
          <Alert
            key={notice.id}
            severity={toAlertSeverity(notice.severity)}
            onClose={notice.dismissible ? () => dismiss(notice.id) : undefined}
            sx={{ whiteSpace: 'pre-line' }}
          >
            {getNoticeContent(notice, i18n.language)}
          </Alert>
        ))}
      </Stack>
    </Container>
  );
}
