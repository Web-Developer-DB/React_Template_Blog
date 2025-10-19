/**
 * @fileoverview SEO helper component powered by react-helmet-async.
 * @description
 *    Centralises default meta tags for consistent branding while allowing each
 *    route to override page-specific values. The component keeps logic explicit
 *    so junior developers can learn what every meta tag does.
 * @module routes/_layout/Seo
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React from 'react';
import { Helmet } from 'react-helmet-async';

// ── Abschnitt: Defaults ───────────────────────────────────────────────────────
const SITE_NAME = 'React Lern-Blog';
const SITE_DESCRIPTION =
  'Ein didaktisches Blog-Template mit React & Vite. Fokus: Theming, Suche, SEO und Content-Workflows.';
const SITE_URL = 'https://example.com';

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component Seo
 * @description
 *    Renders document head meta tags with sensible defaults.
 *
 * @param {Object} props
 * @param {string} [props.title] - Optional page-specific title.
 * @param {string} [props.description] - Custom description (falls leer -> Default).
 * @param {string} [props.canonical] - Canonical URL for SEO.
 * @param {Object} [props.openGraph] - Additional OG tags (e.g. { type, image }).
 * @param {Object} [props.twitter] - Twitter Card overrides (e.g. { card, image }).
 * @param {Object} [props.jsonLd] - JSON-LD payload to embed as structured data.
 * @returns {JSX.Element}
 */
function Seo({
  title,
  description = SITE_DESCRIPTION,
  canonical,
  openGraph = {},
  twitter = {},
  jsonLd,
}) {
  // Titel wird mit dem Seitennamen kombiniert – SEO-Best-Practice.
  const computedTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  // Fallback-URL verhindert, dass Suchmaschinen leere hrefs sehen.
  const url = canonical ?? SITE_URL;

  return (
    <Helmet>
      <title>{computedTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={computedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={openGraph.type ?? 'website'} />
      <meta property="og:url" content={url} />
      {openGraph.image ? <meta property="og:image" content={openGraph.image} /> : null}

      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitter.card ?? 'summary_large_image'} />
      <meta name="twitter:title" content={computedTitle} />
      <meta name="twitter:description" content={description} />
      {twitter.image ? <meta name="twitter:image" content={twitter.image} /> : null}

      {/* JSON-LD */}
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd, null, 2)}</script>
      ) : null}
    </Helmet>
  );
}

export default Seo;
