/**
 * @fileoverview Theme selection control.
 * @description
 *    Presents a small segmented control that lets visitors override the system
 *    theme. The component consumes the ThemeContext provided by `Layout`.
 * @module components/ThemeToggle
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { useContext } from 'react';
import { ThemeContext } from '../routes/_layout/Layout.jsx';

// ── Abschnitt: Daten ──────────────────────────────────────────────────────────
const OPTIONS = [
  { value: 'light', label: 'Hell', icon: '☀️' },
  { value: 'dark', label: 'Dunkel', icon: '🌙' },
  { value: 'system', label: 'System', icon: '🖥️' },
];

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component ThemeToggle
 * @description
 *    Renders three buttons that switch between light/dark/system modes.
 *
 * @ui
 *    - Buttons zeigen ein Icon + Label (per CSS hidden, aber für Screenreader via SR-Only).
 *    - Aktive Auswahl erhält `aria-pressed="true"` für assistive tech.
 *
 * @returns {JSX.Element}
 */
function ThemeToggle() {
  const { preference, resolved, setPreference } = useContext(ThemeContext);

  return (
    <div className="theme-toggle" role="group" aria-label="Theme-Einstellung">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="theme-toggle__button"
          data-active={preference === option.value}
          aria-pressed={preference === option.value}
          onClick={() => setPreference(option.value)}
        >
          <span aria-hidden="true">{option.icon}</span>
          <span className="sr-only">{option.label}</span>
        </button>
      ))}
      <p className="theme-toggle__status">
        Aktives Theme: <strong>{resolved}</strong>
      </p>
    </div>
  );
}

export default ThemeToggle;
