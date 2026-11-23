import { ThemeProvider } from '@mui/material';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { theme } from '../../const/StyleConstants';
import NoticeFormModal from './NoticeFormModal';

// labels are real translation keys, so the Estonian texts can be used in the assertions
const PAGES = [
  { key: 'HOME', labelKey: 'admin_notices.pages.home', isSection: false, section: null },
  { key: 'TOOLS', labelKey: 'common_tools', isSection: true, section: null },
  { key: 'ABOUT', labelKey: 'common_about', isSection: false, section: null }
];

const ACTIVE_CLOSABLE_NOTICE = {
  id: '1',
  contentEt: 'Vana',
  contentEn: 'Old',
  severity: 'WARNING',
  pages: ['ABOUT'],
  dismissible: true,
  validFrom: null,
  validTo: null
};

const renderForm = ({ notice = null, onSubmit = vi.fn() } = {}) => {
  render(
    // the real theme matters: its TextField defaults once broke the pages dropdown
    <ThemeProvider theme={theme}>
      <NoticeFormModal isOpen setIsOpen={vi.fn()} notice={notice} pages={PAGES} onSubmit={onSubmit} />
    </ThemeProvider>
  );
  return onSubmit;
};

const contentField = (label) => screen.getByRole('textbox', { name: new RegExp(label) });

describe('NoticeFormModal', () => {
  it('does not submit without content and shows the errors', () => {
    const onSubmit = renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Salvesta' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getAllByText('Sisu on kohustuslik')).toHaveLength(2);
  });

  it('requires a page when not shown on all pages', () => {
    const onSubmit = renderForm();
    fireEvent.change(contentField('Sisu eesti keeles'), { target: { value: 'Tere' } });
    fireEvent.change(contentField('Sisu inglise keeles'), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('switch', { name: 'Kõik lehed' }));

    fireEvent.click(screen.getByRole('button', { name: 'Salvesta' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Vali vähemalt üks leht')).toBeTruthy();
  });

  it('pages can be picked from the dropdown and are submitted', () => {
    const onSubmit = renderForm();
    fireEvent.change(contentField('Sisu eesti keeles'), { target: { value: '  Tere  ' } });
    fireEvent.change(contentField('Sisu inglise keeles'), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('switch', { name: 'Kõik lehed' }));

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Kuvatakse' }));
    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options).toHaveLength(PAGES.length);
    fireEvent.click(screen.getByRole('option', { name: 'Avaleht' }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvesta' }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      contentEt: 'Tere',
      contentEn: 'Hello',
      pages: ['HOME'],
      validFrom: null,
      validTo: null
    }));
  });

  it('submits an empty page list for all pages', () => {
    const onSubmit = renderForm({ notice: ACTIVE_CLOSABLE_NOTICE });

    fireEvent.click(screen.getByRole('switch', { name: 'Kõik lehed' }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvesta' }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ pages: [] }));
  });

  it('rejects an end time without a start time', () => {
    const onSubmit = renderForm({ notice: ACTIVE_CLOSABLE_NOTICE });

    fireEvent.change(screen.getByLabelText('Kehtib kuni'), { target: { value: '2030-01-01T10:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvesta' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Lõpuaega saab määrata ainult koos algusajaga')).toBeTruthy();
  });

  it('warns when editing an active closable notice', () => {
    renderForm({ notice: ACTIVE_CLOSABLE_NOTICE });
    expect(screen.getByText(/kes on selle juba sulgenud/)).toBeTruthy();
  });

  it('does not warn when editing a permanent notice', () => {
    renderForm({ notice: { ...ACTIVE_CLOSABLE_NOTICE, dismissible: false } });
    expect(screen.queryByText(/kes on selle juba sulgenud/)).toBeNull();
  });
});
