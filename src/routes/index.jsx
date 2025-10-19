/**
 * @fileoverview Startseite des Lern-Blogs.
 * @description
 *    Fasst die wichtigsten Features zusammen, zeigt die neuesten Beiträge und
 *    enthält direkt zugängliche Aktionen (z. B. Suche).
 * @module routes/index
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Seo from './_layout/Seo.jsx';
import SearchBar from '../components/SearchBar.jsx';
import ContentCard from '../components/ContentCard.jsx';
import { getAllPosts } from '../lib/content/index.js';

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component HomeRoute
 * @description
 *    Liefert eine hero-Sektion + Liste der neuesten Beiträge. Wir nutzen
 *    `useMemo`, um nur einmal pro Renderzyklus die Top-Beiträge zu berechnen.
 *
 * @returns {JSX.Element}
 */
function HomeRoute() {
  const navigate = useNavigate();
  // `getAllPosts` liefert eine Kopie des Index; Memo vermeidet Neuaufbau bei jedem Render.
  const posts = useMemo(() => getAllPosts(), []);

  // Wir zeigen nur drei Karten – `slice` kopiert die ersten Einträge.
  const latestPosts = useMemo(() => posts.slice(0, 3), [posts]);

  return (
    <div className="page page--home">
      <Seo
        title="Lern-Blog für React"
        description="Erkunde ein kommentiertes React/Vite-Template mit Fokus auf Theming, Suche und Content-Workflows."
        canonical="https://example.com/"
      />

      <section className="hero">
        <h1>Willkommen zum React Lern-Blog</h1>
        <p>
          Dieses Projekt erklärt dir jeden wichtigen Schritt: vom Content-Loading mit
          <code>import.meta.glob</code> über responsives Theming bis hin zur Fuse.js Suche.
          Nutze es als Lernpfad oder als Startpunkt für dein eigenes Blog.
        </p>

        <div className="hero__actions">
          <SearchBar
            placeholder="Direkt loslegen: Suchbegriff tippen…"
            // Der SearchBar-Callback navigiert zur Suchseite. encodeURIComponent verhindert kaputte URLs.
            onSearch={(value) => value && navigate(`/search?q=${encodeURIComponent(value)}`)}
          />
          <button type="button" className="cta-button" onClick={() => navigate('/blog')}>
            Zum Blog
          </button>
          <button type="button" className="cta-button cta-button--secondary" onClick={() => navigate('/search')}>
            Suche &amp; Filter entdecken
          </button>
        </div>
      </section>

      <section className="home-latest">
        <header>
          <h2>Neueste Beiträge</h2>
          <p>Frisch veröffentlicht und voller Praxisbeispiele – ideal zum Nachbauen.</p>
        </header>

        <div className="home-latest__grid">
          {latestPosts.map((post) => (
            // Jede ContentCard kennt die Filter-Logik und kann direkt benutzt werden.
            <ContentCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="home-latest__more">
          <button type="button" className="cta-button" onClick={() => navigate('/blog')}>
            Alle Beiträge anzeigen
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomeRoute;
