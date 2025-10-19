/**
 * @fileoverview Blog-Übersichtsseite mit Filter- und Pagination-Logik.
 * @description
 *    Listet alle Beiträge, erlaubt das kombinierte Filtern nach Tags & Topics
 *    und bietet ein simples "Mehr laden"-Pattern für bessere Performance.
 * @module routes/blog/index
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react';

import Seo from '../_layout/Seo.jsx';
import ContentCard from '../../components/ContentCard.jsx';
import TagChips from '../../components/TagChips.jsx';
import { getAllPosts } from '../../lib/content/index.js';

const INITIAL_VISIBLE = 6;
const LOAD_STEP = 3;

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component BlogIndexRoute
 * @description
 *    Zeigt alle Blog Posts + Filter UI.
 *
 * @returns {JSX.Element}
 */
function BlogIndexRoute() {
  const posts = useMemo(() => getAllPosts(), []);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [activeTags, setActiveTags] = useState([]);
  const [activeTopics, setActiveTopics] = useState([]);

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts],
  );
  const allTopics = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.topics))).sort(),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTags = activeTags.every((tag) => post.tags.includes(tag));
      const matchesTopics = activeTopics.every((topic) => post.topics.includes(topic));
      return matchesTags && matchesTopics;
    });
  }, [posts, activeTags, activeTopics]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleFilterToggle = (value, type) => {
    if (type === 'tag') {
      setActiveTags((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
      );
    } else {
      setActiveTopics((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
      );
    }
  };

  return (
    <div className="page page--blog-index">
      <Seo
        title="Alle Blogbeiträge"
        description="Filterbare Liste aller Lernartikel zu React, UX, Performance, Dark-Mode und mehr."
        canonical="https://example.com/blog"
      />

      <header className="page-header">
        <h1>Blog</h1>
        <p>
          Filtere nach Hashtags und Topics, kombiniere sie beliebig und entdecke Schritt-für-Schritt
          Erklärungen für moderne Frontend-Themen.
        </p>
      </header>

      <section className="filters">
        <h2>Tags &amp; Topics filtern</h2>
        <div className="filters__group">
          <h3># Hashtags</h3>
          <TagChips
            tags={allTags}
            activeTags={activeTags}
            onToggle={(value) => handleFilterToggle(value, 'tag')}
          />
        </div>
        <div className="filters__group">
          <h3>⬖ Topics</h3>
          <TagChips
            topics={allTopics}
            activeTopics={activeTopics}
            onToggle={(value) => handleFilterToggle(value, 'topic')}
          />
        </div>

        {(activeTags.length > 0 || activeTopics.length > 0) && (
          <button
            type="button"
            className="cta-button cta-button--secondary"
            onClick={() => {
              setActiveTags([]);
              setActiveTopics([]);
            }}
          >
            Filter zurücksetzen
          </button>
        )}
      </section>

      <section className="blog-grid">
        {visiblePosts.length === 0 ? (
          <p className="empty-state">
            Keine Beiträge passen zu dieser Kombination. Entferne einen Filter und versuche es erneut.
          </p>
        ) : (
          <div className="blog-grid__items">
            {visiblePosts.map((post) => (
              <ContentCard
                key={post.slug}
                post={post}
                onFilterToggle={handleFilterToggle}
              />
            ))}
          </div>
        )}

        {hasMore ? (
          <div className="blog-grid__more">
            <button
              type="button"
              className="cta-button"
              onClick={() => setVisibleCount((count) => count + LOAD_STEP)}
            >
              Mehr laden
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default BlogIndexRoute;
