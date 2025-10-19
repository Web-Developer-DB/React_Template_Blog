/**
 * @fileoverview Application shell and theming controller.
 * @description
 *    The layout component provides the persistent frame around all routes.
 *    It keeps the navigation, header/footer, and theme management logic in a
 *    single place so content pages can stay focused on data and rendering.
 *
 *    Lehrmodus-Hinweis:
 *    - Der theming-Context kapselt lokale Storage-Logik + Systempräferenzen.
 *    - Wir beobachten `prefers-color-scheme`, `prefers-reduced-motion` und
 *      `prefers-contrast` und spiegeln die Werte per `data-*` Attribute wider.
 *    - Das Layout ist bewusst semantisch strukturiert (`header/nav/main/footer`)
 *      und nutzt Landmark-Rollen für Screenreader.
 *
 * @module routes/_layout/Layout
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

import Seo from './Seo.jsx';
import ThemeToggle from '../../components/ThemeToggle.jsx';
import MobileNav from '../../components/MobileNav.jsx';
import DesktopNav from '../../components/DesktopNav.jsx';

// ── Abschnitt: Konstanten ─────────────────────────────────────────────────────
const STORAGE_KEY = 'react-template-blog:theme-preference';
const META_THEME_COLOR = {
  light: '#ffffff',
  dark: '#0f172a',
};

// ── Abschnitt: Kontext ────────────────────────────────────────────────────────
/**
 * @typedef {Object} ThemeContextValue
 * @property {'light' | 'dark' | 'system'} preference - User selection.
 * @property {'light' | 'dark'} resolved - Active theme after resolving `system`.
 * @property {(next: 'light' | 'dark' | 'system') => void} setPreference
 */

/**
 * Context gives components access to the current theme preference.
 * We default to `system` so first-time visitors inherit their OS theme.
 */
export const ThemeContext = createContext({
  preference: 'system',
  resolved: 'light',
  setPreference: () => {},
});

// ── Abschnitt: Hilfsfunktionen ────────────────────────────────────────────────
/**
 * Inspects localStorage for a previously stored preference.
 * Defensive coding is necessary because Vite renders on the client, but tests
 * may touch this function in a Node environment where `window` is undefined.
 *
 * @returns {'light' | 'dark' | 'system'}
 */
function readStoredPreference() {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
}

/**
 * Computes the system's preferred theme using the media query API.
 *
 * @returns {'light' | 'dark'}
 */
function getSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component Layout
 * @description
 *    Wraps each route with the global application chrome.
 *
 * @ui
 *    - Header: Logo/Branding + ThemeToggle + Primäre Navigation (Desktop).
 *    - MobileNav: Fixed bottom navigation nur < lg (per CSS gesteuert).
 *    - Main: liefert `<Outlet />` für Kindrouten.
 *    - Footer: Kurze Info + dynamisches Jahr.
 *
 * @a11y
 *    - Enthält Skip-Link, Landmark-Rollen und sinnvolle `aria-label` Werte.
 *    - ThemeToggle kündigt Zustand per `aria-pressed` an (siehe Komponente).
 *
 * @returns {JSX.Element}
 */
function Layout() {
  // ── Abschnitt: State ────────────────────────────────────────────────────────
  const [preference, setPreference] = useState(() => readStoredPreference());
  const [systemTheme, setSystemTheme] = useState(() => getSystemTheme());
  const [prefersContrast, setPrefersContrast] = useState('no-preference');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Abgeleitetes Theme: bei "system" greifen wir auf das MediaQuery-Ergebnis zurück.
  const resolvedTheme = preference === 'system' ? systemTheme : preference;

  // ── Abschnitt: Effekte ──────────────────────────────────────────────────────
  // Beobachtet das Betriebssystem für Theme-Änderungen.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event) => setSystemTheme(event.matches ? 'dark' : 'light');

    handleChange(query); // sofortige Initialisierung
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  // Persistiert die Nutzer-Präferenz.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, preference);
  }, [preference]);

  // Synchronisiert Theme, Kontrast und Motion-Werte auf dem <html>-Element.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.theme = resolvedTheme;
    root.dataset.contrast = prefersContrast;
    root.dataset.motion = prefersReducedMotion ? 'reduced' : 'full';

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', META_THEME_COLOR[resolvedTheme] ?? META_THEME_COLOR.light);
    }
  }, [resolvedTheme, prefersContrast, prefersReducedMotion]);

  // Beobachtet `prefers-contrast` (nicht von allen Browsern unterstützt, daher guard).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-contrast: more)');
    const handleChange = (event) => setPrefersContrast(event.matches ? 'more' : 'no-preference');

    handleChange(query);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  // Beobachtet `prefers-reduced-motion`.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (event) => setPrefersReducedMotion(event.matches);

    handleChange(query);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  // ── Abschnitt: Callbacks ────────────────────────────────────────────────────
  /**
   * Aktualisiert die gespeicherte Präferenz.
   *
   * @param {'light' | 'dark' | 'system'} next
   */
  const handlePreferenceChange = useCallback((next) => {
    setPreference(next);
  }, []);

  // ── Abschnitt: Memoization ──────────────────────────────────────────────────
  const contextValue = useMemo(
    () => ({
      preference,
      resolved: resolvedTheme,
      setPreference: handlePreferenceChange,
    }),
    [preference, resolvedTheme, handlePreferenceChange],
  );

  // ── Abschnitt: Render ───────────────────────────────────────────────────────
  return (
    <ThemeContext.Provider value={contextValue}>
      <Seo />

      <a className="skip-link" href="#main-content">
        Zum Inhalt springen
      </a>

      <div className="app-shell">
        <header className="app-header" role="banner">
          <div className="brand">
            <NavLink to="/" className="brand-link">
              React Lern-Blog
            </NavLink>
            <p className="brand-tagline">Von Junioren für Junioren – Schritt für Schritt.</p>
          </div>
          <ThemeToggle />
        </header>

        <DesktopNav />

        <main id="main-content" className="app-main" role="main">
          <Outlet />
        </main>

        <footer className="app-footer" role="contentinfo">
          <p>&copy; {new Date().getFullYear()} React Lern-Blog. Lernen, anwenden, teilen.</p>
        </footer>
      </div>

      <MobileNav />
    </ThemeContext.Provider>
  );
}

export default Layout;
