

---

# 🧠 Entwickler-Prompt für Codex-Agent (REACT • JavaScript • CSS • Lehrmodus)

**Einsprachig: Deutsch**
**Lehrmodus:** Ausführlich kommentierter Code (Datei-Header, JSDoc/TSDoc-ähnliche Kommentare, Inline-Erklärungen & „Gotchas“).

## 🎯 Projektziele

Erzeuge ein **React-Projekt** (Vite), das sofort startet und folgende Funktionen bietet:

* **Automatisches Theming** (Light/Dark/System; `prefers-contrast`, `prefers-reduced-motion`, dynamisches `<meta name="theme-color">`)
* **Responsives Layout** (Mobile-First, CSS Breakpoints, **Container-Queries**, **Fluid Typography** via `clamp()`)
* **Content-Autodiscovery** für `*.md`, `*.mdx` und **optional** `*.jsx` via `import.meta.glob`
* **Hashtags** (Frontmatter + **Auto-Extraktion**) & **Themen-Tags** (Topics)
* **Clientseitige Suche** (Fuse.js) über Titel, Auszug/Body, Hashtags, Topics
* **SEO** (Meta/OG/Twitter), **Sitemap**, **RSS**, **JSON-LD**
* **Tests & CI** (Vitest + React Testing Library, Playwright, axe/pa11y)
* **~10 Beispiel-Posts** (realistische Inhalte, 200–600 Wörter, verschiedene Topics/Tags)
* **Umfangreiche README.md** + `/docs`-Tutorials
* **Ohne TypeScript, ohne Tailwind** ⇒ **nur React + JavaScript + CSS**

## 🧩 Tech-Stack

* **Build/Dev:** Vite (React)
* **UI:** React 18, **React Router** für Routing
* **Inhalte:** Markdown (`.md`) & **MDX** (`.mdx`) via `@mdx-js/react` / Vite-MDX-Plugin
* **Stil:** **pures CSS** (Module + globale Styles), CSS-Variablen für Theme
* **Suche:** Fuse.js
* **SEO:** `react-helmet-async` (oder gleichwertig)
* **Tests:** Vitest + @testing-library/react, Playwright (E2E), axe/pa11y (A11y)
* **CI:** GitHub Actions (Lint → Build → Tests → A11y)
* **Deployment:** Vercel (statisches Export-Build), `vercel.json` optional

## 🗂️ Projektstruktur (Vorgabe)

```
/src
  /routes
    /blog/[slug].jsx          # Detailseite
    /blog/index.jsx           # Liste
    /tags/index.jsx           # Tag-/Topic-Übersicht & Filter
    /search/index.jsx         # Suche
    /_layout/Layout.jsx       # App-Layout (Shell)
    /_layout/Seo.jsx          # SEO-Komponente (Helmet)
  /components
    ContentCard.jsx
    TagChips.jsx
    ThemeToggle.jsx
    SearchBar.jsx
    SearchResults.jsx
    MobileNav.jsx
    DesktopNav.jsx
  /lib/content
    index.js                  # Scan & Index (stark kommentiert)
    hashtag.js                # Auto-Hashtags (stark kommentiert)
    stopwords.de.txt
  /styles
    globals.css               # Variablen, Resets, Utilities
    layout.css                # Layout, Grid/Container, Nav
    typography.css            # Fluid Type, Prosa, Code
    components.css            # Chips, Cards, Badges, etc.
  main.jsx
  App.jsx
/content
  /blog/...                   # ~10 Beispielposts (.md/.mdx, 1–2 .jsx)
/public/images/...
/tests
  unit/hashtag.test.js
  e2e/search.spec.js
/docs
  01-uebersicht.md
  02-architektur.md
  03-content-workflow.md
  04-styling-und-theming.md
  05-suche-und-filter.md
```

> **Routing-Konvention:** React Router mit `BrowserRouter`. Ordner `/routes` dient der Übersicht; `main.jsx` bindet `<Layout>` und konfiguriert alle Routen.

## 🔧 Kernanforderungen (React/JS/CSS)

### 1) Responsives Layout

* **CSS Breakpoints:** `@media (min-width: 640px | 768px | 1024px | 1280px | 1536px)`
* **Container-Queries:** `@container` für Karten/Listen
* **Fluid Typography:** `font-size: clamp(min, vw, max)`
* **Navigation:**

  * `<MobileNav>`: Bottom-Bar **unter** `lg`
  * `<DesktopNav>`: Sidebar **ab** `lg`
* **A11y:** Fokus-Styles, Landmark-Regions (`header`, `nav`, `main`, `footer`)

### 2) Automatisches Theming

* **CSS-Variablen** in `:root` und `[data-theme="dark"]`
* **Systemerkennung:** `prefers-color-scheme`
* **Manueller Toggle:** `<ThemeToggle>` + Persistenz via `localStorage`
* **Meta Theme Color:** dynamisch je Theme (per `react-helmet-async`)
* **Respektiere:** `prefers-contrast: more` & `prefers-reduced-motion: reduce`

### 3) Content-Autodiscovery & Datenmodell

* **Import:**

  ```js
  const modules = import.meta.glob('/content/**/+(*.md|*.mdx|*.jsx)', { eager: true });
  ```
* **Frontmatter (YAML):**

  ```yaml
  ---
  title: "Titel"
  date: "2025-03-10"
  tags: ["hashtag1", "hashtag2"]   # Hashtags (Kurzlabels)
  topics: ["Thema1", "Thema2"]     # Themen-Tags (Textkategorien)
  excerpt: "Kurzer Teaser."
  cover: "/images/cover.jpg"
  ---
  ```
* **Index sammelt:** `slug, title, excerpt, date, tags, topics, autoHashtags, cover, content (plain + mdx render fn)`

### 4) Hashtags & Themen-Tags

* **Hashtags:** Frontmatter **+ Auto-Extraktion** (Stopwort-Filter, Normalisierung, Top-N, z. B. 5)
* **Topics:** textuelle Kategorien (z. B. „Frontend“, „Barrierefreiheit“)
* **UI:**

  * **Hashtags** als **Filter-Chips** (kombinierbar)
  * **Topics** als **Badges**/**Filter** (separat klar gekennzeichnet)

### 5) Suche

* **Fuse.js** mit Schlüsseln: `title`, `excerpt`, `body`, `tags`, `topics`
* **Debounce:** ~**250 ms** in `<SearchBar>`
* **Ergebnisse:** eigene Seite `/search` + Komponente `<SearchResults>`

### 6) SEO & Feeds

* **Defaults in `<Seo>`** (Titel-Template, OG/Twitter, Canonical)
* **Seitenweise überschreibbar** (Blogpost: `og:image`, `article:published_time`, `JSON-LD` `BlogPosting`)
* **/sitemap.xml** & **/rss.xml**: zur Build-Zeit generieren (Node-Script)
* **JSON-LD**: `<script type="application/ld+json">`

### 7) Tests & CI

* **Unit (Vitest):** `hashtag.js` (Extraktor-Heuristiken)
* **Component (RTL):** Theme-Toggle, TagChips, SearchBar
* **E2E (Playwright):** Theme-Toggle, Suche, Filter, Responsiveness
* **A11y:** `axe` (bei Unit/Component), `pa11y` gegen Preview/Build
* **GitHub Actions:** Node LTS, `npm ci`, Lint → Build → Test → A11y

## 🧪 Beispiel-Content (ca. 10 Posts)

Lege unter `/content/blog` realistische Posts an (200–600 Wörter, gern mit Codeblöcken), z. B.:

* `2025-01-hello-react.md` – topics: Frontend, React
* `2025-01-responsive-design.mdx` – topics: CSS, Responsive
* `2025-02-darkmode-theming.md` – topics: Designsysteme, Dark-Mode
* `2025-02-content-architektur.md` – topics: Content-Architektur
* `2025-03-auto-hashtags.mdx` – topics: NLP, Metadaten
* `2025-03-performance-tuning.md` – topics: Leistung
* `2025-04-seo-tipps.md` – topics: SEO
* `2025-04-ux-im-web.md` – topics: UX-Optimierung
* `2025-05-barrierefreiheit-check.md` – topics: Barrierefreiheit
* `2025-05-deployment-vercel.jsx` – topics: Deployment (als JSX-Seite mit Frontmatter-Block im Kommentar)

## 🧭 Dokustandard (Lehrmodus – sehr wichtig!)

* **Datei-Header-Kommentar:** Zweck, Kontext, Haupt-Exports, Abhängigkeiten
* **Funktions-Header (JSDoc):** Beschreibung, Parameter, Rückgabe, Randbedingungen, Beispiel
* **Inline-Kommentare:** *Warum* (Designentscheidungen, Trade-offs)
* **Abschnitts-Banner:** `// ── Abschnitt: …`
* **Komponenten-Header:** „Props erklärt“, „State erklärt“, „UI-Logik“, „A11y-Hinweise“
* **Gotchas:** SSR/CSR, MDX-Fallstricke, Vite-`import.meta.glob`
* **/docs:** Schritt-für-Schritt-Lernpfad (Start → Build → Content → Suche → Deployment) + FAQ

**Beispiel-JSDoc:**

```js
/**
 * Erzeugt Auto-Hashtags aus einem Text.
 * Warum: Junior-freundliche Einführung in einfache NLP-Heuristiken (Häufigkeit, Stopwörter).
 * @param {string} text Volltext (Markdown bereits bereinigt)
 * @param {{ max?: number }} [opts] Optionen; Anzahl der gewünschten Hashtags (Default: 5)
 * @returns {string[]} Liste von Strings ohne '#'
 * @example
 *   extractHashtags("React ist schnell und deklarativ", { max: 3 })
 */
export function extractHashtags(text, opts = { max: 5 }) { /* ... */ }
```

## ✅ Akzeptanzkriterien

* Startet direkt:

  ```
  npm install
  npm run dev
  ```
* Theme folgt System; Toggle mit Persistenz; `<meta name="theme-color">` dynamisch
* Mobile/Desktop-Layouts schalten korrekt; **Container-Queries aktiv**
* `/blog` listet alle ~10 Posts; Detailseiten funktionieren
* **Hashtags & Topics** sichtbar und kombinierbar filterbar
* **Suche** liefert passende Treffer (Titel/Body/Tags/Topics)
* **SEO/Sitemap/RSS/JSON-LD** vorhanden
* **Tests & A11y** in CI grün
* **Kommentardeckung:** jede Datei + zentrale Funktionen/Komponenten ausführlich dokumentiert
* **README.md** + `/docs` vollständig

## 📘 README.md (vom Agent zu erzeugen)

Enthält:

* Projektüberblick & Zielgruppe (Junior-freundlich)
* Features & Architektur (ASCII-Diagramm ok)
* Setup (Node-Version, Skripte: `dev`, `build`, `preview`, `test`, `test:e2e`, `test:a11y`)
* Ordnerstruktur & wichtige Dateien
* **Content-Guide** (neue Posts, Frontmatter, Topics vs. Tags)
* **Theming & Responsiveness** (Funktionsweise, Anpassung)
* **Suche & Filter** (Fuse-Konfiguration, Erweiterungen)
* Qualitätssicherung (ESLint/Prettier optional), Tests, A11y
* Deployment (Vercel)
* FAQ & Troubleshooting
* Lizenz & Autor

## 📝 Abschließender Befehl an den Codex-Agent

> **Erzeuge ein einsprachiges React-Projekt (Vite, JavaScript, CSS) im Lehrmodus:**
> – **kompletter Code ausführlich kommentiert** (Datei-Header, JSDoc, Inline),
> – **automatisches Theming**, **responsives Layout** (Container-Queries, Fluid Type),
> – **Content-Autodiscovery** (`.md`, `.mdx`, optional `.jsx`), **Hashtags** + **Themen-Tags**,
> – **Suche (Fuse.js)** über Titel/Body/Tags/Topics,
> – **SEO/Sitemap/RSS/JSON-LD**,
> – **Tests & CI** (Vitest, RTL, Playwright, axe/pa11y),
> – **~10 Beispiel-Posts**.
> Stelle sicher, dass das Projekt nach der Generierung sofort lauffähig ist (`npm install && npm run dev`) und eine umfangreiche **README.md** + `/docs`-Tutorials enthält.

---
