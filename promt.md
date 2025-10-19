

---

> **MASTER-PROMPT (Copy & Paste)**
>
> Erzeuge ein **einsprachiges React-(Vite)-Projekt** (nur **JavaScript** & **CSS**, **ohne** TypeScript/Tailwind) im **Lehrmodus**: Der gesamte Code ist **ausführlich kommentiert** (Datei-Header, JSDoc, Inline-Erklärungen, Abschnitts-Banner). Zielgruppe sind Junior-Entwickler.
>
> ---
>
> ## 1) Projektziele & UX
>
> * **Automatisches Theming**: Light/Dark/System; beachte `prefers-contrast` & `prefers-reduced-motion`; Nutzer-Auswahl via `localStorage` persistieren; dynamisches `<meta name="theme-color">`.
> * **Responsives Layout**: Mobile-First, CSS-Breakpoints, **Container-Queries**, **Fluid Typography** mit `clamp()`.
>   Zwei Navigationen: **MobileNav** (Bottom-Bar `< lg`) & **DesktopNav** (Sidebar `≥ lg`).
> * **Content-Autodiscovery**: via
>   `import.meta.glob('/content/**/+(*.md|*.mdx|*.jsx)', { eager: true })`
>   mit Frontmatter:
>
>   ```yaml
>   ---
>   title: "Titel"
>   date: "YYYY-MM-DD"
>   tags: ["kurzlabel1","kurzlabel2"]    # Hashtags (Kurzlabels)
>   topics: ["Thema1","Thema2"]          # Themen-Kategorien (Text)
>   excerpt: "Kurzer Teaser."
>   cover: "/images/cover.jpg"
>   ---
>   ```
>
>   Index speichert: `slug, title, excerpt, date, tags, topics, autoHashtags, cover, body (plain), render (MDX/JSX-Komponente)`.
> * **Hashtags & Topics**:
>
>   * Hashtags = `tags` aus Frontmatter **+ Auto-Extraktion** aus Body (Stopwort-Filter, Normalisierung, Top-N=5).
>   * Topics = textuelle Kategorien (z. B. „Frontend“, „Barrierefreiheit“).
>   * UI: kombinierbare Filter (Chips/Badges); klare visuelle Unterscheidung.
> * **Suche (Clientseitig)**: **Fuse.js** über `title`, `excerpt`, `body`, `tags`, `topics` mit Debounce (~250 ms); Suchseite `/search` + Komponenten `SearchBar` & `SearchResults`.
> * **SEO & Feeds**: Standard-Meta (Title-Template, Description, OG/Twitter, Canonical) je Seite überschreibbar; **/sitemap.xml**, **/rss.xml**; **JSON-LD** (`BlogPosting`) auf Detailseiten.
> * **Doku**: Umfangreiche **README.md** + `/docs` Lernpfad (5 Kapitel).
>
> ---
>
> ## 2) Always-Latest-Paketstrategie
>
> * Installiere initial **neuestes** Ökosystem:
>
>   ```bash
>   npm i react@latest react-dom@latest react-router-dom@latest \
>         react-helmet-async@latest fuse.js@latest @mdx-js/react@latest
>   npm i -D @mdx-js/rollup@latest npm-check-updates@latest
>   ```
> * Ergänze in `package.json`:
>
>   ```json
>   {
>     "scripts": {
>       "dev": "vite",
>       "build": "vite build",
>       "preview": "vite preview",
>       "update:check": "ncu",
>       "update:apply": "ncu -u && npm i"
>     },
>     "engines": {
>       "node": ">=20.0.0",
>       "npm": ">=10.0.0"
>     }
>   }
>   ```
> * README-Abschnitt „Pakete aktuell halten“ mit Workflow:
>
>   ```bash
>   npm run update:check
>   npm run update:apply
>   ```
>
> ---
>
> ## 3) Projektstruktur (erzwingen)
>
> ```
> /src
>   /routes
>     /blog/[slug].jsx
>     /blog/index.jsx
>     /tags/index.jsx
>     /search/index.jsx
>     /_layout/Layout.jsx
>     /_layout/Seo.jsx
>     /index.jsx
>   /components
>     ContentCard.jsx
>     TagChips.jsx
>     ThemeToggle.jsx
>     SearchBar.jsx
>     SearchResults.jsx
>     MobileNav.jsx
>     DesktopNav.jsx
>   /lib/content
>     index.js           # Scannen/Indexieren (stark kommentiert)
>     hashtag.js         # Auto-Hashtags (stark kommentiert)
>     stopwords.de.txt
>   /styles
>     globals.css
>     layout.css
>     typography.css
>     components.css
>   main.jsx
>   App.jsx
> /content/blog            # ~10 Beispielposts
> /public/images
> /scripts/generate-feeds.mjs
> /docs
>   01-uebersicht.md
>   02-architektur.md
>   03-content-workflow.md
>   04-styling-und-theming.md
>   05-suche-und-filter.md
> README.md
> vite.config.js
> ```
>
> ---
>
> ## 4) Implementierungsdetails (Pflichtenheft)
>
> ### 4.1 Layout & Navigation
>
> * `Layout.jsx`: App-Shell mit Landmark-Regionen (`header`, `nav`, `main`, `footer`), **Skip-Link**, dynamische Theme-Klasse (`data-theme` auf `<html>` oder `<body>`), `<HelmetProvider>` + `<Seo>`.
> * `MobileNav.jsx` (Bottom-Bar, `< lg`) & `DesktopNav.jsx` (Sidebar, `≥ lg`) mit ARIA-Labels, sichtbarem Fokus & Tastatur-Support.
> * **CSS**:
>
>   * `globals.css`: Reset, Farb-/Spacing-Variablen, Fokus-Styles, Utility-Container, Motion-Reduktion.
>   * `typography.css`: Fluid Type via `clamp()`, Prosa-Stile, Code-Blöcke.
>   * `layout.css`: Grids, Breakpoints, Container-Queries.
>   * `components.css`: Chips, Cards, Badges, Buttons.
>
> ### 4.2 Theming
>
> * Variablen in `:root` (Light) + `[data-theme="dark"]` (Dark).
> * System-Erkennung (`prefers-color-scheme`), **ThemeToggle.jsx**: Light/Dark/System, Persistenz via `localStorage`.
> * `react-helmet-async`: `<meta name="theme-color">` je Theme setzen.
> * Beachte `prefers-contrast: more` & `prefers-reduced-motion: reduce`.
>
> ### 4.3 Content-Autodiscovery
>
> * `lib/content/index.js` nutzt `import.meta.glob('/content/**/+(*.md|*.mdx|*.jsx)', { eager: true })`.
> * Für `.md/.mdx`: Frontmatter lesen; für `.jsx`: Frontmatter als Kommentarblock am Dateianfang erlauben (Parser bereitstellen).
> * Exporte:
>
>   * `getAllPosts(): Post[]` (sortiert `date desc`),
>   * `getPostBySlug(slug): Post`.
> * **Post-Schema**:
>
>   ```ts
>   type Post = {
>     slug: string;
>     title: string;
>     excerpt: string;
>     date: string;      // ISO
>     tags: string[];
>     topics: string[];
>     autoHashtags: string[];
>     cover?: string;
>     body: string;      // plain text für Suche
>     render: React.ComponentType; // MDX/JSX-Komponente
>   };
>   ```
>
> ### 4.4 Auto-Hashtags
>
> * `lib/content/hashtag.js`:
>
>   ```js
>   /**
>    * Extrahiert Auto-Hashtags aus Text.
>    * - Lowercase, Tokenize, Stopwörter filtern (stopwords.de.txt)
>    * - Umlaute/Diakritika normalisieren
>    * - Häufigkeiten zählen, Top-N (Default 5)
>    * @param {string} text
>    * @param {{ max?: number }} [opts]
>    * @returns {string[]}
>    */
>   export function extractHashtags(text, opts = { max: 5 }) { /* ... */ }
>   ```
> * In `index.js` `autoHashtags` berechnen und mit Frontmatter-`tags` de-duplizieren.
>
> ### 4.5 Blog-Routen & Komponenten
>
> * `/routes/blog/index.jsx`: Liste, Grid/Kartenlayout, Sort `date desc`, simple Pagination/„Mehr laden“.
> * `/routes/blog/[slug].jsx`: Content-Rendering (MDX/MD/JSX), Cover, Meta (Tags/Topics), **JSON-LD BlogPosting**.
> * `ContentCard.jsx`: Cover, Titel, Datum, Excerpt, Chips/Badges.
> * `TagChips.jsx`: Mehrfach-Filter (togglebar), unterscheide visuell **tags** (Hashtags) und **topics** (Badges).
>
> ### 4.6 Suche (Fuse.js)
>
> * `SearchBar.jsx`: Eingabe + Debounce (~250 ms), Weiterleiten auf `/search?q=...`.
> * `/routes/search/index.jsx` + `SearchResults.jsx`: Fuse-Index über `title`, `excerpt`, `body`, `tags`, `topics`; Score & Snippets anzeigen.
>
> ### 4.7 SEO & Feeds
>
> * `Seo.jsx`: Defaults (Titel-Template, Description, OG/Twitter, Canonical), Props zur Überschreibung.
> * `scripts/generate-feeds.mjs`: zur Build-Zeit `dist/sitemap.xml` & `dist/rss.xml` aus `getAllPosts()` generieren. In `package.json`:
>
>   ```json
>   { "scripts": { "postbuild": "node scripts/generate-feeds.mjs" } }
>   ```
> * Blog-Detail: `<script type="application/ld+json">` mit `BlogPosting`.
>
> ### 4.8 Beispiel-Content (~10 Posts)
>
> Lege unter `/content/blog` realistische Inhalte (200–600 Wörter) an:
>
> * `2025-01-hello-react.md` – topics: Frontend, React
> * `2025-01-responsive-design.mdx` – topics: CSS, Responsive
> * `2025-02-darkmode-theming.md` – topics: Designsysteme, Dark-Mode
> * `2025-02-content-architektur.md` – topics: Content-Architektur
> * `2025-03-auto-hashtags.mdx` – topics: NLP, Metadaten
> * `2025-03-performance-tuning.md` – topics: Leistung
> * `2025-04-seo-tipps.md` – topics: SEO
> * `2025-04-ux-im-web.md` – topics: UX-Optimierung
> * `2025-05-barrierefreiheit-check.md` – topics: Barrierefreiheit
> * `2025-05-deployment-vercel.jsx` – topics: Deployment (JSX, Frontmatter als Kommentar)
>
> ---
>
> ## 5) Lehrmodus-Dokustandard (verpflichtend)
>
> * **Datei-Header** (Zweck, Kontext, Haupt-Exports, Abhängigkeiten).
> * **JSDoc** an jeder Funktion (Was/Warum, Params, Return, Beispiel).
> * **Inline-Kommentare** mit Begründungen (Trade-offs, SSR/CSR-Hinweise).
> * **Abschnitts-Banner**: `// ── Abschnitt: …`
> * Komponenten-Header: **Props**, **State**, **UI-Logik**, **A11y-Hinweise**, **Gotchas**.
>
> ---
>
> ## 6) README & `/docs`
>
> * **README.md** (Junior-freundlich): Überblick, Features, Architektur (ASCII-Skizze), Setup (Node-Version, Skripte), Ordnerstruktur, Content-Guide, Theming, Responsiveness, Suche/Filter, **„Pakete aktuell halten“** (mit `update:check`/`update:apply`), Deployment (Vercel), FAQ/Troubleshooting, Lizenz.
> * `/docs/01..05`:
>
>   1. Übersicht & Lernziele
>   2. Architektur & Datenfluss
>   3. Content-Workflow (Frontmatter, MD/MDX/JSX, Slugs)
>   4. Styling & Theming (Variablen, Fluid Type, Container-Queries)
>   5. Suche & Filter (Fuse-Tuning, Erweiterungen)
>
> ---
>
> ## 7) Akzeptanzkriterien (ohne Tests/CI)
>
> * `npm install && npm run dev` startet; Routen **Home/Blog/Tags/Suche** funktionieren.
> * Theme folgt System; Toggle persistiert; `<meta name="theme-color">` wechselt korrekt.
> * Responsiv: MobileNav ↔ DesktopNav; Karten/Listen per Container-Queries.
> * `/blog` listet ~10 Posts; Detailseiten rendern MD/MDX/JSX inkl. Cover, Datum, Tags/Topics.
> * **Filter** (Tags + Topics) kombinierbar; **Suche** liefert sinnvolle Treffer.
> * **SEO/Feeds**: Defaults, pro Seite überschreibbar; `/sitemap.xml`, `/rss.xml`, Blog-`JSON-LD` vorhanden.
> * **README.md** + **/docs** vollständig; Abschnitt „Pakete aktuell halten“ vorhanden.
>
> ---
>
> ## 8) Startbefehle (ins Projekt integrieren & in README dokumentieren)
>
> ```bash
> npm i
> npm run dev
> # optional direkt alles aktualisieren:
> npm run update:apply
> ```

---

Wenn du möchtest, packe ich dir als Nächstes einen **Minimal-Seed (Schritte 1–4, sofort lauffähig)** mit den wichtigsten Dateien direkt hier in den Chat.
