/**
 * @fileoverview Debounced search input.
 * @description
 *    Standalone Komponente mit Debounce-Logik (250 ms). Eltern-Komponenten
 *    können per Callback auf Suchbegriffe reagieren.
 * @module components/SearchBar
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';

const DEBOUNCE_MS = 250;

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component SearchBar
 * @description
 *    Controlled input mit internem State für Debounce. Wir synchronisieren den
 *    `initialQuery`, falls sich dieser von außen ändert (z. B. bei Navigation).
 *
 * @param {Object} props
 * @param {string} [props.initialQuery]
 * @param {(value: string) => void} props.onSearch
 * @param {string} [props.placeholder]
 * @returns {JSX.Element}
 */
function SearchBar({ initialQuery = '', onSearch, placeholder = 'Suche im Blog' }) {
  // `value` spiegelt das Input-Feld wider (Controlled Component).
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    // Wenn sich die Query außerhalb ändert (z. B. Navigation), synchronisieren wir den Input.
    setValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    // Debounce: erst nach 250 ms Inaktivität feuern wir den Callback.
    const handle = window.setTimeout(() => {
      onSearch?.(value.trim());
    }, DEBOUNCE_MS);
    // Cleanup cancelt das Timeout, falls der Nutzer noch tippt.
    return () => window.clearTimeout(handle);
  }, [value, onSearch]);

  return (
    <label className="search-bar">
      <span className="sr-only">Blog durchsuchen</span>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-label="Blog durchsuchen"
      />
    </label>
  );
}

export default SearchBar;
