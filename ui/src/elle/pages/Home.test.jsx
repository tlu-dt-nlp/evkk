import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import HeroElement from '../components/home/HeroElement';
import Navbar from '../components/Navbar';
import StatisticsElement from '../components/home/StatisticsElement';
import { AnalyticsProvider } from '../context/AnalyticsContext';
import RootContext from '../context/RootContext';

const renderWithProviders = (children, path = '/') => render(
  <RootContext.Provider value={{ user: null, clearAuthContext: () => {} }}>
    <AnalyticsProvider>
      <MemoryRouter initialEntries={[path]}>
        {children}
      </MemoryRouter>
    </AnalyticsProvider>
  </RootContext.Provider>
);

describe('Home page', () => {
  it('has the button that scrolls to the tools overview', () => {
    renderWithProviders(<HeroElement />);
    expect(screen.getByRole('button', { name: 'Tutvu tööriistadega' })).toBeTruthy();
  });

  it('switches the language from the navbar and remembers it', async () => {
    const { container } = renderWithProviders(<><Navbar /><HeroElement /></>);

    fireEvent.click(container.querySelector('.language-icon'));
    fireEvent.click(await screen.findByRole('menuitem', { name: /English/ }));

    expect(await screen.findByRole('button', { name: 'Check out our tools' })).toBeTruthy();
    expect(localStorage.getItem('language')).toBe('EN');
  });

  it('navigates to text donation from the statistics section', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/" element={<StatisticsElement />} />
        <Route path="/adding" element={<p>adding page</p>} />
      </Routes>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Loovuta oma tekst' }));

    expect(await screen.findByText('adding page')).toBeTruthy();
  });
});
