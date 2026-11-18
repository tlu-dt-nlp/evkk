import { describe, expect, it } from 'vitest';
import {
  buildNoticePages,
  getNoticePageLabel,
  getPageKey,
  isNoticeShownOnPage,
  isPageKeyCoveredBy,
  mapPagesByKey,
  removeCoveredPageKeys
} from './NoticePages';

const crumb = (translateKey) => ({ crumb: () => ({ translateKey }) });

describe('getPageKey', () => {
  it('returns HOME for the root path', () => {
    expect(getPageKey('/')).toBe('HOME');
    expect(getPageKey('')).toBe('HOME');
  });

  it('joins route constant names along the path', () => {
    expect(getPageKey('/tools/wordlist')).toBe('TOOLS/WORDLIST');
    expect(getPageKey('/tools/wordlist/')).toBe('TOOLS/WORDLIST');
    expect(getPageKey('/admin/notices')).toBe('ADMIN/NOTICES');
  });

  it('uses the constant name, not the path value', () => {
    expect(getPageKey('/corrector-test')).toBe('CORRECTOR_TEST');
  });

  it('turns unknown segments into key-safe names', () => {
    expect(getPageKey('/some-page/x.y')).toBe('SOME_PAGE/X_Y');
  });
});

describe('isPageKeyCoveredBy', () => {
  it('covers the page itself and its subpages', () => {
    expect(isPageKeyCoveredBy('TOOLS', 'TOOLS')).toBe(true);
    expect(isPageKeyCoveredBy('TOOLS/WORDLIST', 'TOOLS')).toBe(true);
    expect(isPageKeyCoveredBy('TOOLS/WORDLIST/X', 'TOOLS')).toBe(true);
  });

  it('does not cover parents, siblings or keys that only share a prefix', () => {
    expect(isPageKeyCoveredBy('TOOLS', 'TOOLS/WORDLIST')).toBe(false);
    expect(isPageKeyCoveredBy('TOOLS/COLLOCATES', 'TOOLS/WORDLIST')).toBe(false);
    expect(isPageKeyCoveredBy('TOOLSET', 'TOOLS')).toBe(false);
  });
});

describe('isNoticeShownOnPage', () => {
  it('shows a notice everywhere when no pages are specified', () => {
    expect(isNoticeShownOnPage({ pages: [] }, 'HOME')).toBe(true);
    expect(isNoticeShownOnPage({ pages: [] }, 'ADMIN/NOTICES')).toBe(true);
  });

  it('shows a notice only on its pages and their subpages', () => {
    const notice = { pages: ['HOME', 'TOOLS'] };
    expect(isNoticeShownOnPage(notice, 'HOME')).toBe(true);
    expect(isNoticeShownOnPage(notice, 'TOOLS/WORDLIST')).toBe(true);
    expect(isNoticeShownOnPage(notice, 'ABOUT')).toBe(false);
  });
});

describe('removeCoveredPageKeys', () => {
  it('drops subpages of selected sections and keeps the order', () => {
    expect(removeCoveredPageKeys(['TOOLS/WORDLIST', 'HOME', 'TOOLS', 'TOOLS/COLLOCATES']))
      .toEqual(['HOME', 'TOOLS']);
  });

  it('keeps unrelated keys', () => {
    expect(removeCoveredPageKeys(['HOME', 'ABOUT/US'])).toEqual(['HOME', 'ABOUT/US']);
  });
});

describe('buildNoticePages', () => {
  const routes = [
    {
      path: '/',
      children: [
        { index: true },
        {
          path: 'tools',
          handle: crumb('tools_label'),
          children: [
            { index: true },
            { path: 'wordlist', handle: crumb('wordlist_label') }
          ]
        },
        { path: 'about', handle: crumb('about_label') },
        { path: 'hidden-legacy-route' },
        { path: '*' },
        { children: [{ path: 'login', handle: crumb('login_label') }] }
      ]
    }
  ];

  const pages = buildNoticePages(routes);

  it('lists home first, then every route with a breadcrumb', () => {
    expect(pages.map(page => page.key)).toEqual(['HOME', 'TOOLS', 'TOOLS/WORDLIST', 'ABOUT', 'LOGIN']);
  });

  it('marks routes with breadcrumb children as sections and links subpages to them', () => {
    const byKey = mapPagesByKey(pages);
    expect(byKey.get('TOOLS').isSection).toBe(true);
    expect(byKey.get('TOOLS/WORDLIST').section).toBe(byKey.get('TOOLS'));
    expect(byKey.get('ABOUT')).toMatchObject({ isSection: false, section: null, labelKey: 'about_label' });
  });
});

describe('getNoticePageLabel', () => {
  const t = (key, options) => {
    if (options?.name) return `${key}(${options.name})`;
    if (options?.key) return `${key}(${options.key})`;
    return key;
  };
  const pagesByKey = mapPagesByKey(buildNoticePages([
    { path: 'tools', handle: crumb('tools_label'), children: [{ path: 'wordlist', handle: crumb('wordlist_label') }] }
  ]));

  it('labels sections, subpages, top-level pages and unknown keys', () => {
    expect(getNoticePageLabel('TOOLS', pagesByKey, t)).toBe('admin_notices.pages.section(tools_label)');
    expect(getNoticePageLabel('TOOLS/WORDLIST', pagesByKey, t)).toBe('tools_label › wordlist_label');
    expect(getNoticePageLabel('HOME', pagesByKey, t)).toBe('admin_notices.pages.home');
    expect(getNoticePageLabel('REMOVED/PAGE', pagesByKey, t)).toBe('admin_notices.pages.unknown(REMOVED/PAGE)');
  });
});
