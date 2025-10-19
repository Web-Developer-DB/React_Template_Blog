/**
 * @fileoverview Content discovery + indexing.
 * @description
 *    Scans `/content` for markdown, MDX und JSX Dateien. Extrahiert Frontmatter,
 *    erzeugt React-Komponenten für das Rendering und stellt ein vereinheitlichtes
 *    Post-Schema bereit. Die Implementierung ist bewusst ausführlich kommentiert,
 *    damit Lernende jede Transformation nachvollziehen können.
 * @module lib/content/index
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import { extractHashtags } from './hashtag.js';

// ── Abschnitt: Content-Globs ──────────────────────────────────────────────────
// Vite wandelt den Glob während des Builds in ein statisches Objekt um.
const moduleGlob = import.meta.glob('/content/**/+(*.md|*.mdx|*.jsx)', { eager: true });
const rawMarkdownGlob = import.meta.glob('/content/**/+(*.md|*.mdx)', {
  eager: true,
  import: 'default',
  query: '?raw',
});
const rawJsxGlob = import.meta.glob('/content/**/*.jsx', {
  eager: true,
  import: 'default',
  query: '?raw',
});

// ── Abschnitt: Frontmatter Parsing ────────────────────────────────────────────
/**
 * Parsen eines einfachen YAML-ähnlichen Blocks (nur Key: Value oder Arrays).
 *
 * Wir unterstützen Strings (mit/ohne Anführungszeichen), Zahlen, Boolesche Werte
 * und Array-Literale im JSON-Stil. Für das Bildungsprojekt genügt dieser Umfang.
 *
 * @param {string} source
 * @returns {Record<string, any>}
 */
function parseFrontmatterBlock(source) {
  const data = {};
  if (!source) return data;

  const lines = source.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const [key, ...rest] = line.split(':');
    if (!key || rest.length === 0) continue;
    const valueRaw = rest.join(':').trim();

    const cleanKey = key.trim();
    let value;

    // Versuch: Array-Literal (JSON-kompatibel).
    if (valueRaw.startsWith('[') && valueRaw.endsWith(']')) {
      try {
        value = JSON.parse(valueRaw.replace(/'/g, '"'));
      } catch {
        value = [];
      }
    } else if (valueRaw === 'true' || valueRaw === 'false') {
      value = valueRaw === 'true';
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(valueRaw)) {
      // Datumswerte als String belassen (ISO-Format).
      value = valueRaw;
    } else if (!Number.isNaN(Number(valueRaw))) {
      value = Number(valueRaw);
    } else {
      value = valueRaw.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    }

    data[cleanKey] = value;
  }

  return data;
}

/**
 * Extrahiert Frontmatter aus einer Markdown/MDX-Datei.
 *
 * @param {string} raw
 * @returns {{ frontmatter: Record<string, any>, body: string }}
 */
function parseMarkdown(raw) {
  if (!raw || typeof raw !== 'string') return { frontmatter: {}, body: '' };
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]+([\s\S]*)$/);
  if (!match) {
    return {
      frontmatter: {},
      body: stripFormatting(raw),
    };
  }
  const [, frontmatterBlock, body] = match;
  return {
    frontmatter: parseFrontmatterBlock(frontmatterBlock),
    body: stripFormatting(body),
  };
}

/**
 * Extrahiert Frontmatter aus einem JSX Kommentarblock am Dateianfang.
 *
 * @param {string} raw
 * @returns {{ frontmatter: Record<string, any>, body: string }}
 */
function parseJsx(raw) {
  if (!raw || typeof raw !== 'string') return { frontmatter: {}, body: '' };
  const match = raw.match(/^\/\*\*?[\s\S]*?---\s*[\r\n]+([\s\S]*?)\r?\n---[\s\S]*?\*\/\s*/);
  if (!match) {
    return { frontmatter: {}, body: stripFormatting(raw) };
  }
  const [, inner] = match;
  const body = raw.slice(match[0].length);
  return {
    frontmatter: parseFrontmatterBlock(inner),
    body: stripFormatting(body),
  };
}

/**
 * Entfernt einfache Markdown-/JSX-Formatierungen, damit die Volltextsuche mit
 * purem Text arbeiten kann. Ziel ist kein perfekter Parser, sondern eine
 * hinreichend gute Heuristik.
 *
 * @param {string} value
 * @returns {string}
 */
function stripFormatting(value) {
  if (!value) return '';
  return value
    .replace(/`{1,3}[\s\S]*?`{1,3}/g, ' ') // Inline + Block Code
    .replace(/<[^>]*>/g, ' ') // HTML/JSX Tags
    .replace(/[#>*_~`]/g, ' ') // Markdown Sonderzeichen
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links -> Text
    .replace(/\s+/g, ' ') // Mehrfachräume reduzieren
    .trim();
}

/**
 * Erstellt aus einem Dateipfad einen URL-tauglichen Slug.
 *
 * @param {string} path
 * @returns {string}
 */
function deriveSlug(path) {
  return path
    .replace(/^\/content\/blog\//, '')
    .replace(/\.[^.]+$/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

// ── Abschnitt: Post-Index ─────────────────────────────────────────────────────
/**
 * Baut einmalig den Content-Index auf.
 *
 * @returns {Post[]}
 */
function buildIndex() {
  const posts = [];

  for (const [path, moduleValue] of Object.entries(moduleGlob)) {
    const extensionMatch = path.match(/\.(mdx?|jsx)$/);
    if (!extensionMatch) continue;
    const extension = extensionMatch[1];

    let frontmatter = {};
    let bodyText = '';

    if (extension === 'md' || extension === 'mdx') {
      const raw = rawMarkdownGlob[path];
      const source =
        typeof raw === 'string' ? raw : typeof raw?.default === 'string' ? raw.default : '';
      const parsed = parseMarkdown(source);
      frontmatter = parsed.frontmatter;
      bodyText = parsed.body;
    } else if (extension === 'jsx') {
      const raw = rawJsxGlob[path];
      const source =
        typeof raw === 'string' ? raw : typeof raw?.default === 'string' ? raw.default : '';
      const parsed = parseJsx(source);
      frontmatter = parsed.frontmatter;
      bodyText = parsed.body;
    }

    const slug = deriveSlug(path);
    const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
    const topics = Array.isArray(frontmatter.topics) ? frontmatter.topics : [];
    const autoHashtags = extractHashtags(bodyText, { max: 5 });

    const mergedTags = Array.from(new Set([...tags, ...autoHashtags]));

    posts.push({
      slug,
      title: frontmatter.title ?? slug,
      excerpt: frontmatter.excerpt ?? '',
      date: frontmatter.date ?? '1970-01-01',
      tags: mergedTags,
      topics,
      autoHashtags,
      cover: frontmatter.cover,
      body: bodyText,
      render: moduleValue.default ?? (() => null),
    });
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Der Index wird beim ersten Import gebaut und anschließend wiederverwendet.
const POST_INDEX = buildIndex();

// ── Abschnitt: Öffentliche API ────────────────────────────────────────────────
/**
 * Gibt alle Posts sortiert nach Datum zurück.
 *
 * @returns {Post[]}
 */
export function getAllPosts() {
  return [...POST_INDEX];
}

/**
 * Liefert einen einzelnen Post anhand seines Slugs.
 *
 * @param {string} slug
 * @returns {Post | undefined}
 */
export function getPostBySlug(slug) {
  return POST_INDEX.find((post) => post.slug === slug);
}

/**
 * @typedef {Object} Post
 * @property {string} slug
 * @property {string} title
 * @property {string} excerpt
 * @property {string} date
 * @property {string[]} tags
 * @property {string[]} topics
 * @property {string[]} autoHashtags
 * @property {string | undefined} cover
 * @property {string} body
 * @property {React.ComponentType} render
 */
