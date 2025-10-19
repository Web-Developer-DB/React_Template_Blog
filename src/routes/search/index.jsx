/**
 * @fileoverview Clientseitige Suche mit Fuse.js.
 * @description
 *    Kombiniert Textsuche und Tag/Topic-Filter. Das Debounce-Verhalten sitzt
 *    in der `SearchBar`, diese Route verwaltet die Query-Parameter.
 * @module routes/search/index
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';

import Seo from '../_layout/Seo.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import SearchResults from '../../components/SearchResults.jsx';
import TagChips from '../../components/TagChips.jsx';
import { getAllPosts } from '../../lib/content/index.js';

const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  keys: ['title', 'excerpt', 'body', 'tags', 'topics'],
};

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
function SearchRoute() {
  const posts = useMemo(() => getAllPosts(), []);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const query = params.get('q') ?? '';
  const [activeTags, setActiveTags] = useState([]);
  const [activeTopics, setActiveTopics] = useState([]);

  const fuse = useMemo(() => new Fuse(posts, FUSE_OPTIONS), [posts]);

  const rawResults = useMemo(() => {
    if (!query) {
      return posts.map((post) => ({ item: post, score: 1 }));
    }
    return fuse.search(query);
  }, [fuse, posts, query]);

  const filteredResults = useMemo(() => {
    return rawResults.filter(({ item }) => {
      const tagsOk = activeTags.length === 0 || activeTags.every((tag) => item.tags.includes(tag));
      const topicsOk =
        activeTopics.length === 0 || activeTopics.every((topic) => item.topics.includes(topic));
      return tagsOk && topicsOk;
    });
  }, [rawResults, activeTags, activeTopics]);

  const handleSearch = (value) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set('q', value);
      } else {
        next.delete('q');
      }
      return next;
    });
  };

  const handleToggle = (value, type) => {
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

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts],
  );
  const allTopics = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.topics))).sort(),
    [posts],
  );

  return (
    <div className="page page--search">
      <Seo
        title="Suche"
        description="Durchsuche alle Blogbeiträge nach Titeln, Auszügen, Tags und Topics – sekundenschnell dank Fuse.js."
        canonical="https://example.com/search"
      />

      <header className="page-header">
        <h1>Suche &amp; Filter</h1>
        <p>
          Wir durchsuchen Titel, Auszüge, Volltext sowie Hashtags/Topics. Die Filter arbeiten
          kombinatorisch – so findest du genau den Lernartikel, den du brauchst.
        </p>
        <SearchBar initialQuery={query} onSearch={handleSearch} />
      </header>

      <section className="search-filters">
        <TagChips
          tags={allTags}
          topics={allTopics}
          activeTags={activeTags}
          activeTopics={activeTopics}
          onToggle={handleToggle}
        />
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

      <SearchResults query={query} results={filteredResults} onFilterToggle={handleToggle} />

      <footer className="search-footer">
        <button type="button" className="cta-button" onClick={() => navigate('/blog')}>
          Zur Beitragsübersicht
        </button>
      </footer>
    </div>
  );
}

export default SearchRoute;
