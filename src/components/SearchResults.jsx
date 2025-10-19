/**
 * @fileoverview Ergebnisliste der Fuse.js Suche.
 * @description
 *    Präsentiert Treffer mit Score, Snippet und Meta-Daten. Die Komponente
 *    kapselt Formatierung, damit die Route schlank bleibt.
 * @module components/SearchResults
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React from 'react';
import { Link } from 'react-router-dom';

import TagChips from './TagChips.jsx';

// ── Abschnitt: Hilfsfunktionen ────────────────────────────────────────────────
/**
 * Baut ein kurzes Snippet rund um den Query-Begriff.
 *
 * @param {string} body
 * @param {string} query
 * @returns {string}
 */
function buildSnippet(body, query) {
  if (!body) return '';
  const lowerBody = body.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerBody.indexOf(lowerQuery);
  const start = Math.max(0, index - 60);
  const end = index === -1 ? Math.min(body.length, 160) : Math.min(body.length, index + query.length + 60);
  const snippet = body.slice(start, end).trim();
  return start > 0 ? `…${snippet}` : snippet;
}

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component SearchResults
 * @description
 *    Rendert Trefferliste samt Score und Snippet.
 *
 * @param {Object} props
 * @param {string} props.query
 * @param {{ item: import('../lib/content/index.js').Post, score: number }[]} props.results
 * @param {(value: string, type: 'tag' | 'topic') => void} [props.onFilterToggle]
 * @returns {JSX.Element}
 */
function SearchResults({ query, results, onFilterToggle }) {
  if (!query) {
    return <p className="search-results__placeholder">Starte oben eine Suche, wir durchsuchen Titel, Auszüge, Tags und Topics.</p>;
  }

  if (results.length === 0) {
    return <p className="search-results__empty">Keine Treffer für „{query}“. Versuche andere Begriffe oder prüfe die Schreibweise.</p>;
  }

  return (
    <ul className="search-results">
      {results.map(({ item, score }) => (
        <li key={item.slug} className="search-results__item">
          <article>
            <header>
              <h3>
                <Link to={`/blog/${item.slug}`}>{item.title}</Link>
              </h3>
              <p className="search-results__meta">Relevanz-Score: {(1 - score).toFixed(2)}</p>
            </header>
            <p className="search-results__snippet">{buildSnippet(item.body, query)}</p>
            <TagChips
              tags={item.tags}
              topics={item.topics}
              onToggle={onFilterToggle}
              compact
            />
          </article>
        </li>
      ))}
    </ul>
  );
}

export default SearchResults;
