/**
 * @fileoverview Tag- und Topic-Übersicht.
 * @description
 *    Gruppiert alle Beiträge nach Hashtags und Themen-Kategorien. Besucher:innen
 *    können gezielt nach Metadaten filtern.
 * @module routes/tags/index
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react';

import Seo from '../_layout/Seo.jsx';
import TagChips from '../../components/TagChips.jsx';
import ContentCard from '../../components/ContentCard.jsx';
import { getAllPosts } from '../../lib/content/index.js';

// ── Abschnitt: Hilfsfunktion ──────────────────────────────────────────────────
function buildMetaIndex(posts) {
  const tagIndex = new Map();
  const topicIndex = new Map();

  posts.forEach((post) => {
    // Jeder Tag/Topic erhöht seinen Zähler – so erkennen wir Beliebtheit.
    post.tags.forEach((tag) => {
      tagIndex.set(tag, (tagIndex.get(tag) ?? 0) + 1);
    });
    post.topics.forEach((topic) => {
      topicIndex.set(topic, (topicIndex.get(topic) ?? 0) + 1);
    });
  });

  return {
    tags: Array.from(tagIndex.entries()).sort((a, b) => b[1] - a[1]),
    topics: Array.from(topicIndex.entries()).sort((a, b) => b[1] - a[1]),
  };
}

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
function TagsRoute() {
  const posts = useMemo(() => getAllPosts(), []);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  const metaIndex = useMemo(() => buildMetaIndex(posts), [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0 && selectedTopics.length === 0) return posts;
    return posts.filter((post) => {
      // Sobald keine Filter aktiv sind, lassen wir den Wert durch (OR).
      const tagMatch =
        selectedTags.length === 0 || selectedTags.every((tag) => post.tags.includes(tag));
      const topicMatch =
        selectedTopics.length === 0 || selectedTopics.every((topic) => post.topics.includes(topic));
      return tagMatch && topicMatch;
    });
  }, [posts, selectedTags, selectedTopics]);

  const handleToggle = (value, type) => {
    if (type === 'tag') {
      setSelectedTags((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
      );
    } else {
      setSelectedTopics((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
      );
    }
  };

  return (
    <div className="page page--tags">
      <Seo
        title="Tags & Topics"
        description="Alle Hashtags und Themenkategorien des Blogs. Kombiniere Filter und finde passende Lernartikel."
        canonical="https://example.com/tags"
      />

      <header className="page-header">
        <h1>Tags &amp; Topics</h1>
        <p>
          Hashtags (#) markieren prägnante Schlagworte, Topics (⬖) beschreiben größere Themenfelder.
          Klick auf die Chips, um die Beitragsliste zu filtern.
        </p>
      </header>

      <section className="tags-index">
        <div className="tags-index__group">
          <h2># Hashtags</h2>
          <ul>
            {metaIndex.tags.map(([tag, count]) => (
              <li key={tag}>
                <span className="meta-label">#{tag}</span>
                <span className="meta-count">{count} Beiträge</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="tags-index__group">
          <h2>⬖ Topics</h2>
          <ul>
            {metaIndex.topics.map(([topic, count]) => (
              <li key={topic}>
                <span className="meta-label">{topic}</span>
                <span className="meta-count">{count} Beiträge</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="tags-filter">
        <TagChips
          tags={metaIndex.tags.map(([tag]) => tag)}
          topics={metaIndex.topics.map(([topic]) => topic)}
          activeTags={selectedTags}
          activeTopics={selectedTopics}
          onToggle={handleToggle}
        />
        {(selectedTags.length > 0 || selectedTopics.length > 0) && (
          <button
            type="button"
            className="cta-button cta-button--secondary"
            onClick={() => {
              // Reset holt die komplette Liste zurück – wichtig für UX.
              setSelectedTags([]);
              setSelectedTopics([]);
            }}
          >
            Filter entfernen
          </button>
        )}
      </section>

      <section className="tags-results">
        <h2>Gefilterte Beiträge</h2>
        {filteredPosts.length === 0 ? (
          <p className="empty-state">
            Keine Beiträge gefunden. Vielleicht ist die Kombination zu speziell?
          </p>
        ) : (
          <div className="blog-grid__items">
            {filteredPosts.map((post) => (
              <ContentCard key={post.slug} post={post} onFilterToggle={handleToggle} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TagsRoute;
