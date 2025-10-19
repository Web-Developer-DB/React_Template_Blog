# 02 · Architektur & Datenfluss

Die Architektur folgt einem einfachen, aber lehrreichen Prinzip: **Clear Separation of Concerns**.

## 1. Datenquelle

- Alle Inhalte liegen unter `/content/blog`.
- Frontmatter liefert Metadaten (Titel, Datum, Tags, Topics, Excerpt, Cover).
- `import.meta.glob` lädt zur Buildzeit alle Dateien und stellt React-Komponenten bereit.

## 2. Indizierung

`src/lib/content/index.js` baut ein einheitliches Post-Objekt:

- Slug: Dateiname ohne Endung.
- Body (plain text): dient der Suche.
- Tags: Kombination aus manuellen Tags + Auto-Hashtags.
- Topics: Kategorie-Labels für UI-Filter.

Der Index wird beim ersten Import erzeugt und als In-Memory-Cache wiederverwendet.

## 3. Routing

React Router organisiert den Code:

- `/` – Startseite mit Hero, Suche und neuesten Posts.
- `/blog` – Filterbare Liste aller Artikel.
- `/blog/:slug` – Detailansicht inklusive JSON-LD.
- `/tags` – Fokus auf Metadaten & Filter.
- `/search` – Fuse.js Suche + Filterchips.

`Layout.jsx` kapselt gemeinsame Elemente (Header, Nav, Footer) und liefert den Theme-Context.

## 4. Styling & UI

- CSS liegt in drei thematischen Dateien: `globals`, `layout`, `components`.
- Mobile First: alle Styles starten ohne Breakpoint, `@media` erweitert.
- Container Queries + `clamp()` ermöglichen fluides Verhalten.
- `prefers-reduced-motion` und `prefers-contrast` werden respektiert.

## 5. Builds & Feeds

- `npm run build` baut das Projekt.
- `node scripts/generate-feeds.mjs` erzeugt Sitemap und RSS im `dist` Ordner.
- Die Skripte lassen sich leicht erweitern (z. B. für JSON-Feeds).

Visualisiere den Datenfluss von links nach rechts: **Content → Index → Komponenten → Routen → Build**.
