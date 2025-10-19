/**
 * @fileoverview Blog preview card.
 * @description
 *    Displays cover image, metadata and teaser text used on list pages.
 * @module components/ContentCard
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React from 'react';
import { Link } from 'react-router-dom';

import TagChips from './TagChips.jsx';

// ── Abschnitt: Helpers ────────────────────────────────────────────────────────
/**
 * Formatiert das ISO-Datum für die Anzeige.
 *
 * @param {string} isoDate
 * @returns {string}
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component ContentCard
 * @description
 *    Card Layout für Postlisten. Wir verwenden conditional rendering für das
 *    Cover, damit Komponenten auch ohne Bild funktionieren.
 *
 * @param {Object} props
 * @param {import('../lib/content/index.js').Post} props.post
 * @param {(tag: string, type: 'tag' | 'topic') => void} [props.onFilterToggle]
 * @returns {JSX.Element}
 */
function ContentCard({ post, onFilterToggle }) {
  // Jede Karte verlinkt auf die Detailansicht des Posts. Zentraler Ort für Slug → URL.
  const linkTarget = `/blog/${post.slug}`;

  return (
    <article className="content-card">
      {post.cover ? (
        // Coverbilder sind optional. Mit dem Conditional vermeiden wir leere Wrapper.
        <Link to={linkTarget} className="content-card__cover">
          <img src={post.cover} alt={`Coverbild für ${post.title}`} loading="lazy" />
        </Link>
      ) : null}

      <div className="content-card__body">
        <header>
          {/* Datum und Titel stehen zusammen, damit Screenreader zuerst die Meta-Infos erhalten. */}
          <p className="content-card__date">{formatDate(post.date)}</p>
          <h3 className="content-card__title">
            <Link to={linkTarget}>{post.title}</Link>
          </h3>
        </header>

        <p className="content-card__excerpt">{post.excerpt}</p>

        {/* TagChips erlauben, Filters aus der Liste heraus erneut zu toggeln. */}
        <TagChips
          tags={post.tags}
          topics={post.topics}
          onToggle={onFilterToggle}
          compact
        />
      </div>
    </article>
  );
}

export default ContentCard;
