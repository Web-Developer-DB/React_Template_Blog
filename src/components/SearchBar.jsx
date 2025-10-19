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
  const [value, setValue] = useState(initialQuery);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      onSearch?.(value.trim());
    }, DEBOUNCE_MS);
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
