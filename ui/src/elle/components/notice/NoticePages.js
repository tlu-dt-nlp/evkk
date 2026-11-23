import { RouteConstants } from '../../const/RouteConstants';

/*
 * Notices are targeted at pages by "page keys" built from RouteConstants names rather than raw URLs,
 * so changing a path value keeps existing notices working. A key consists of the route names along the
 * path joined with "/": '/tools/wordlist' -> 'TOOLS/WORDLIST'. The home page is 'HOME'.
 *
 * A key also covers its subpages, so 'TOOLS' (a section) matches 'TOOLS/WORDLIST', 'TOOLS/COLLOCATES' etc.
 * A notice without any page keys is shown on all pages.
 */

const HOME_PAGE_KEY = 'HOME';
const KEY_SEPARATOR = '/';

const ROUTE_NAME_BY_PATH = Object.fromEntries(
  Object.entries(RouteConstants).map(([name, path]) => [path, name])
);

const segmentToKey = (segment) =>
  ROUTE_NAME_BY_PATH[segment] ?? segment.toUpperCase().replace(/[^A-Z0-9]/g, '_');

export const getPageKey = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments.length
    ? segments.map(segmentToKey).join(KEY_SEPARATOR)
    : HOME_PAGE_KEY;
};

export const isPageKeyCoveredBy = (pageKey, targetKey) =>
  pageKey === targetKey || pageKey.startsWith(targetKey + KEY_SEPARATOR);

export const isNoticeShownOnPage = (notice, pageKey) =>
  !notice.pages?.length || notice.pages.some(targetKey => isPageKeyCoveredBy(pageKey, targetKey));

const getCrumbTranslateKey = (route) =>
  typeof route.handle?.crumb === 'function' ? route.handle.crumb()?.translateKey : null;

/**
 * Builds the list of pages notices can be targeted at from the router config.
 * Only routes with a breadcrumb are included, i.e. real pages, not redirects or hidden legacy routes.
 *
 * @returns {Array<{key: string, labelKey: string, isSection: boolean, section: object|null}>}
 */
export const buildNoticePages = (routes) => {
  const pages = [{ key: HOME_PAGE_KEY, labelKey: 'admin_notices.pages.home', isSection: false, section: null }];

  const walk = (routeList, parentSegments, section) => {
    routeList.forEach(route => {
      if (route.index || route.path === '*') return;

      // layout routes (no path / root path) only group children
      if (!route.path || route.path === '/') {
        if (route.children) walk(route.children, parentSegments, section);
        return;
      }

      const labelKey = getCrumbTranslateKey(route);
      if (!labelKey) return;

      const segments = [...parentSegments, route.path];
      const isSection = !!route.children?.some(child => !child.index && getCrumbTranslateKey(child));
      const page = { key: segments.map(segmentToKey).join(KEY_SEPARATOR), labelKey, isSection, section };
      pages.push(page);

      if (route.children) walk(route.children, segments, isSection ? page : section);
    });
  };

  walk(routes, [], null);
  return pages;
};

export const getNoticePageLabel = (key, pagesByKey, t) => {
  const page = pagesByKey.get(key);
  // React escapes rendered text itself, so i18next must not HTML-escape the interpolated values
  const interpolation = { escapeValue: false };
  if (!page) return t('admin_notices.pages.unknown', { key, interpolation });
  if (page.isSection) return t('admin_notices.pages.section', { name: t(page.labelKey), interpolation });
  return page.section ? `${t(page.section.labelKey)} › ${t(page.labelKey)}` : t(page.labelKey);
};

export const mapPagesByKey = (pages) => new Map(pages.map(page => [page.key, page]));

// a selected section already covers its subpages, so subpage keys are redundant next to it
export const removeCoveredPageKeys = (keys) =>
  keys.filter(key => !keys.some(other => other !== key && isPageKeyCoveredBy(key, other)));
