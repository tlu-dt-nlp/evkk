import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatches } from 'react-router-dom';

export default function PageTitle() {
  const { t } = useTranslation();
  const matches = useMatches();

  useEffect(() => {
    const matchWithCrumb = [...matches]
      .reverse()
      .find(m => m.handle?.crumb);

    const titleKey = matchWithCrumb?.handle?.crumb()?.translateKey ?? 'page_title_homepage';

    document.title = `${t(titleKey)} | ELLE`;
  }, [matches, t]);

  return null;
}
