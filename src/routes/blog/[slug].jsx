/**
 * @fileoverview Detailansicht eines Blogposts.
 * @description
 *    Sorgt für das Rendering der MD/MDX/JSX Inhalte, zeigt Meta-Informationen
 *    und bindet strukturierte Daten (JSON-LD) für SEO ein.
 * @module routes/blog/[slug]
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';

import Seo from '../_layout/Seo.jsx';
import TagChips from '../../components/TagChips.jsx';
import { getPostBySlug } from '../../lib/content/index.js';

// ── Abschnitt: Hilfsfunktionen ────────────────────────────────────────────────
function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const mdxComponents = {
  pre: (props) => <pre className="mdx-pre" {...props} />,
  code: (props) => <code className="mdx-code" {...props} />,
};

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component BlogDetailRoute
 * @description
 *    Holt den passenden Post via Slug und rendert ihn mit MDXProvider.
 *
 * @returns {JSX.Element}
 */
function BlogDetailRoute() {
  const { slug } = useParams();
  const navigate = useNavigate();
  // Wir ziehen den Post synchron aus dem vorab gebauten Index.
  const post = getPostBySlug(slug);

  const jsonLd = useMemo(() => {
    if (!post) return null;
    // JSON-LD hilft Suchmaschinen – wir legen hier alle Pflichtfelder an.
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.date,
      description: post.excerpt,
      image: post.cover ? [`https://example.com${post.cover}`] : undefined,
      keywords: post.tags.join(', '),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://example.com/blog/${post.slug}`,
      },
      author: {
        '@type': 'Organization',
        name: 'React Lern-Blog',
      },
    };
  }, [post]);

  if (!post) {
    return (
      <div className="page page--blog-detail">
        <Seo title="Beitrag nicht gefunden" />
        {/* 404-Fallback erklärt Nutzer:innen, was passiert ist und bietet Navigation zurück. */}
        <p>Ups! Für diese URL existiert kein Beitrag. Zurück zur Übersicht?</p>
        <button type="button" className="cta-button" onClick={() => navigate('/blog')}>
          Zur Blogübersicht
        </button>
      </div>
    );
  }

  const PostComponent = post.render;

  return (
    <article className="page page--blog-detail">
      <Seo
        title={post.title}
        description={post.excerpt}
        canonical={`https://example.com/blog/${post.slug}`}
        openGraph={{
          type: 'article',
          image: post.cover,
        }}
        twitter={{
          card: post.cover ? 'summary_large_image' : 'summary',
          image: post.cover,
        }}
        jsonLd={jsonLd}
      />

      <header className="detail-header">
        <p className="detail-date">{formatDate(post.date)}</p>
        <h1>{post.title}</h1>
        <p className="detail-excerpt">{post.excerpt}</p>
        {/* TagChips geben direkten Zugriff auf verwandte Themen. */}
        <TagChips tags={post.tags} topics={post.topics} />
        {post.cover ? (
          <figure className="detail-cover">
            <img src={post.cover} alt={`Coverbild: ${post.title}`} />
            <figcaption>Visual inspiriert vom Artikelthema.</figcaption>
          </figure>
        ) : null}
      </header>

      <MDXProvider components={mdxComponents}>
        <div className="detail-body">
          {/* `render` ist eine React-Komponente (MDX/JSX). Wir rendern sie wie jede andere. */}
          <PostComponent />
        </div>
      </MDXProvider>

      <footer className="detail-footer">
        <h2>Weiterlesen</h2>
        <p>
          Lust auf mehr? Entdecke weitere Kategorien über die Tag- und Topic-Übersicht oder nutze die
          Volltextsuche.
        </p>
        <div className="detail-footer__actions">
          <button type="button" className="cta-button" onClick={() => navigate('/blog')}>
            Zurück zur Übersicht
          </button>
          <button type="button" className="cta-button cta-button--secondary" onClick={() => navigate('/tags')}>
            Tags &amp; Topics
          </button>
        </div>
      </footer>
    </article>
  );
}

export default BlogDetailRoute;
