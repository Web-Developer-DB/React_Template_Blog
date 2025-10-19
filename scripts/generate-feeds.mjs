/**
 * @fileoverview Post-Build Feed Generator.
 * @description
 *    Läuft nach `vite build` und erzeugt `dist/sitemap.xml` sowie `dist/rss.xml`.
 *    Der Code liest die Inhalte direkt aus `/content/blog`, damit das Script
 *    unabhängig von Vite-Interna funktioniert. Die Logik spiegelt die
 *    Frontmatter-Personalisierung des Content-Indexers wider.
 *
 * Ausführung:
 *    node scripts/generate-feeds.mjs
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ── Abschnitt: Konstanten ─────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.resolve(ROOT_DIR, 'content', 'blog');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const SITE_URL = process.env.SITE_URL ?? 'https://example.com';

// ── Abschnitt: Hilfsfunktionen ────────────────────────────────────────────────
/**
 * Liest rekursiv alle Dateien im Content-Verzeichnis.
 *
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function readAllContentFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return readAllContentFiles(fullPath);
      }
      if (/\.(md|mdx|jsx)$/.test(entry.name)) {
        return fullPath;
      }
      return [];
    }),
  );
  return files.flat();
}

/**
 * Parst Frontmatter ähnlich wie in der Laufzeitlogik.
 *
 * @param {string} raw
 * @returns {{ frontmatter: Record<string, any>, body: string }}
 */
function parseContent(raw, extension) {
  if (extension === 'jsx') {
    const match = raw.match(/^\/\*\*?[\s\S]*?---\s*[\r\n]+([\s\S]*?)\r?\n---[\s\S]*?\*\/\s*/);
    if (match) {
      return {
        frontmatter: parseFrontmatter(match[1]),
        body: raw.slice(match[0].length),
      };
    }
    return { frontmatter: {}, body: raw };
  }

  const fmMatch = raw.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*[\r\n]+([\s\S]*)$/);
  if (fmMatch) {
    return {
      frontmatter: parseFrontmatter(fmMatch[1]),
      body: fmMatch[2],
    };
  }

  return { frontmatter: {}, body: raw };
}

/**
 * Simpler Frontmatter-Parser (siehe src/lib/content/index.js).
 *
 * @param {string} block
 * @returns {Record<string, any>}
 */
function parseFrontmatter(block) {
  const data = {};
  block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      if (line.startsWith('#')) return;
      const [key, ...rest] = line.split(':');
      if (!key || rest.length === 0) return;
      const rawValue = rest.join(':').trim();
      let value;
      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
        try {
          value = JSON.parse(rawValue.replace(/'/g, '"'));
        } catch {
          value = [];
        }
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
        value = rawValue;
      } else {
        value = rawValue.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      }
      data[key.trim()] = value;
    });
  return data;
}

/**
 * Erzeugt aus einem Dateipfad einen Slug.
 *
 * @param {string} file
 * @returns {string}
 */
function createSlug(file) {
  return path
    .relative(CONTENT_DIR, file)
    .replace(/\.[^.]+$/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

/**
 * Baut das Sitemap-XML.
 *
 * @param {Array<{ slug: string, date: string }>} posts
 * @returns {string}
 */
function buildSitemap(posts) {
  const now = new Date().toISOString();
  const entries = [
    { loc: `${SITE_URL}/`, lastmod: now },
    { loc: `${SITE_URL}/blog`, lastmod: now },
    { loc: `${SITE_URL}/tags`, lastmod: now },
    { loc: `${SITE_URL}/search`, lastmod: now },
    ...posts.map((post) => ({
      loc: `${SITE_URL}/blog/${post.slug}`,
      lastmod: new Date(post.date).toISOString(),
    })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>`;
}

/**
 * Baut ein minimal RSS 2.0 Feed.
 *
 * @param {Array<{ slug: string, title: string, excerpt: string, date: string }>} posts
 * @returns {string}
 */
function buildRss(posts) {
  const items = posts
    .map(
      (post) => `  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${SITE_URL}/blog/${post.slug}</link>
    <guid>${SITE_URL}/blog/${post.slug}</guid>
    <description><![CDATA[${post.excerpt}]]></description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  </item>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>React Lern-Blog</title>
  <link>${SITE_URL}</link>
  <description>Kommentiertes Lernprojekt für React &amp; Vite</description>
${items}
</channel>
</rss>`;
}

// ── Abschnitt: Hauptlogik ─────────────────────────────────────────────────────
async function main() {
  const files = await readAllContentFiles(CONTENT_DIR);
  const posts = [];

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8');
    const extension = path.extname(file).replace('.', '');
    const { frontmatter } = parseContent(raw, extension);
    posts.push({
      slug: createSlug(file),
      title: frontmatter.title ?? 'Ohne Titel',
      date: frontmatter.date ?? new Date().toISOString().slice(0, 10),
      excerpt: frontmatter.excerpt ?? '',
    });
  }

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  await fs.mkdir(DIST_DIR, { recursive: true });
  await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), buildSitemap(posts), 'utf8');
  await fs.writeFile(path.join(DIST_DIR, 'rss.xml'), buildRss(posts), 'utf8');

  console.log(`Sitemap & RSS wurden generiert (${posts.length} Beiträge).`);
}

main().catch((error) => {
  console.error('Feed-Generierung fehlgeschlagen:', error);
  process.exitCode = 1;
});
