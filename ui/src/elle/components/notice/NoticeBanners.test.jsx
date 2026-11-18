import { act, fireEvent, render, screen, within } from '@testing-library/react';
import i18n from 'i18next';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import RootContext from '../../context/RootContext';
import { Languages } from '../../translations/i18n';
import NoticeBanners from './NoticeBanners';

const notice = (id, overrides = {}) => ({
  id,
  contentEt: `Teade ${id}`,
  contentEn: `Notice ${id}`,
  severity: 'INFO',
  pages: [],
  dismissible: false,
  ...overrides
});

const renderBanners = (notices, path = '/') => render(
  <RootContext.Provider value={{ notices }}>
    <MemoryRouter initialEntries={[path]}>
      <NoticeBanners />
    </MemoryRouter>
  </RootContext.Provider>
);

const getDismissedIds = () => JSON.parse(localStorage.getItem('dismissedNotices'));

describe('NoticeBanners', () => {
  it('shows notices meant for all pages and for the current page or its section', () => {
    renderBanners([
      notice('all'),
      notice('section', { pages: ['TOOLS'] }),
      notice('page', { pages: ['TOOLS/WORDLIST'] }),
      notice('other', { pages: ['ABOUT'] })
    ], '/tools/wordlist');

    expect(screen.getByText('Teade all')).toBeTruthy();
    expect(screen.getByText('Teade section')).toBeTruthy();
    expect(screen.getByText('Teade page')).toBeTruthy();
    expect(screen.queryByText('Teade other')).toBeNull();
  });

  it('renders nothing without notices for the page', () => {
    const { container } = renderBanners([notice('other', { pages: ['ABOUT'] })], '/');
    expect(container.innerHTML).toBe('');
  });

  it('shows the content in the selected language', async () => {
    renderBanners([notice('1')]);
    expect(screen.getByText('Teade 1')).toBeTruthy();

    await act(() => i18n.changeLanguage(Languages.ENGLISH));

    expect(screen.getByText('Notice 1')).toBeTruthy();
  });

  it('only closable notices can be closed, and they stay closed', () => {
    const notices = [notice('closable', { dismissible: true }), notice('permanent')];
    const { unmount } = renderBanners(notices);

    expect(within(screen.getByText('Teade permanent').closest('[role="alert"]')).queryByRole('button')).toBeNull();
    fireEvent.click(within(screen.getByText('Teade closable').closest('[role="alert"]')).getByRole('button'));

    expect(screen.queryByText('Teade closable')).toBeNull();
    expect(getDismissedIds()).toEqual(['closable']);

    unmount();
    renderBanners(notices);
    expect(screen.queryByText('Teade closable')).toBeNull();
    expect(screen.getByText('Teade permanent')).toBeTruthy();
  });

  it('forgets dismissals of notices that are no longer active', () => {
    localStorage.setItem('dismissedNotices', JSON.stringify(['removed', 'closable']));

    renderBanners([notice('closable', { dismissible: true })]);

    expect(getDismissedIds()).toEqual(['closable']);
  });
});
