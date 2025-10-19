/**
 * @fileoverview Theme selection control.
 * @description
 *    Stellt einen zyklischen Theme-Schalter bereit. Ein einzelner Button
 *    wechselt nacheinander zwischen Light, Dark und System. Die Komponente
 *    konsumiert den ThemeContext aus `Layout`.
 * @module components/ThemeToggle
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { useContext } from 'react';
import { ThemeContext } from '../routes/_layout/Layout.jsx';

// ── Abschnitt: Daten ──────────────────────────────────────────────────────────
// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component ThemeToggle
 * @description
 *    Rendert den Button, der beim Klick das nächste Theme aktiviert.
 *
 * @returns {JSX.Element}
 */
function ThemeToggle() {
  // `useContext` holt den aktuellen Wert aus dem Provider in Layout.jsx.
  const { preference, setPreference } = useContext(ThemeContext);
  const OPTIONS = ['light', 'dark', 'system'];
  // Wir finden die aktuelle Position und bestimmen den nächstfolgenden Wert.
  const currentIndex = OPTIONS.indexOf(preference);
  const nextIndex = (currentIndex + 1) % OPTIONS.length;
  const nextValue = OPTIONS[nextIndex];
  const iconFor = {
    light: '☀️',
    dark: '🌙',
    system: '🖥️',
  };

  return (
    <button
      type="button"
      className="theme-toggle__button"
      aria-label={`Theme wechseln, aktuell ${preference}`}
      onClick={() => setPreference(nextValue)}
    >
      <span aria-hidden="true">{iconFor[preference]}</span>
    </button>
  );
}

export default ThemeToggle;
