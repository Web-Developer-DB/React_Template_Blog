# React Lern-Blog (Vite + React)

Ein didaktisches Projekt, das zeigt, wie du ein modernes Blog-Frontend mit React & Vite aufbaust – inklusive Theming, Suche, SEO und ausführlicher Dokumentation. Jeder Quelltext ist kommentiert und erklärt, damit Junior-Entwickler:innen den Aufbau Schritt für Schritt nachvollziehen können.

## Highlights

- 🌗 **Automatisches Theming** (Light/Dark/System) inkl. `meta[name="theme-color"]`, Persistenz und Rücksicht auf `prefers-contrast` & `prefers-reduced-motion`.
- 📱 **Responsive Layouts** mit Mobile-First-Ansatz, Desktop-Sidebar und hamburgergestützter Mobilnavigation, unterstützt von Container Queries und Fluid Typography.
- 🧭 **Content-Autodiscovery** über `import.meta.glob`: Markdown, MDX und JSX werden automatisch indiziert, Metadaten & Auto-Hashtags inklusive.
- 🔎 **Clientseitige Suche** mit Fuse.js, kombinierbaren Tag-/Topic-Filtern und Debounce-Suche.
- 🧠 **SEO & Feeds**: `react-helmet-async`, dynamische JSON-LD, automatische `sitemap.xml` und `rss.xml`.
- 📚 **Lernpfad** (`/docs`) und stark kommentierter Code für Selbststudium & Team-Onboarding.

## Schnellstart

```bash
npm i
npm run dev
# optional direkt alles aktualisieren:
npm run update:apply
```

Der Dev-Server läuft standardmäßig auf `http://localhost:5173`. Öffne die Konsole, um Linting-Hinweise oder Build-Logs zu sehen.

## Anforderungen

- Node.js ≥ 20
- npm ≥ 10

Prüfe deine Versionen via `node -v` und `npm -v`. Nutze `nvm`, falls du mehrere Node-Versionen verwalten möchtest.

## Skripte

| Script               | Beschreibung                                                                 |
| -------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`        | Startet den Vite-Entwicklungsserver mit HMR.                                 |
| `npm run build`      | Erstellt den Production-Build im `dist` Ordner.                              |
| `npm run preview`    | Vorschau des Production-Builds (lokaler Static-Server).                      |
| `npm run update:check` | Prüft verfügbare Updates via `npm-check-updates`.                         |
| `npm run update:apply` | Aktualisiert Abhängigkeiten (führt `ncu -u && npm i` aus).                |

Der Build ruft anschließend automatisch `node scripts/generate-feeds.mjs` auf und generiert Sitemap & RSS.

## Architektur (ASCII)

```
┌──────────────────────────────┐
│   content/blog/*.md(x|jsx)   │
└──────────────┬───────────────┘
               │ import.meta.glob
┌──────────────▼───────────────┐
│   src/lib/content/index.js   │  ← Index, Auto-Hashtags, Plaintext
└──────────────┬───────────────┘
               │ Posts[]
┌──────────────▼───────────────┐
│    Routen & Komponenten      │  ← Layout, Blog, Tags, Suche
└──────────────┬───────────────┘
               │ JSX
┌──────────────▼───────────────┐
│          Vite Build          │  ← React + @mdx-js/rollup
└──────────────┬───────────────┘
               │ postbuild
┌──────────────▼───────────────┐
│  sitemap.xml & rss.xml (dist)│
└──────────────────────────────┘
```

## Projektstruktur

```
src/
  App.jsx
  main.jsx
  components/
  routes/
  lib/content/
  styles/
content/blog/
public/images/
docs/
scripts/generate-feeds.mjs
```

Jede React-Datei enthält Datei-Header, Abschnittsbanner und JSDoc-Kommentare. Lies den Code wie ein Tutorial.

## Content-Guide

1. Neue Datei unter `content/blog` anlegen (`YYYY-MM-titel.md|mdx|jsx`).
2. Frontmatter nach Schema ausfüllen.
3. Optional: MDX für interaktive Komponenten oder JSX für Spezialfälle.
4. Cover-Datei (SVG/PNG/WEBP) unter `public/images` ablegen.
5. `npm run dev` starten und Ergebnisse unter `/blog` prüfen.

Auto-Hashtags ergänzen deine Tags automatisch. Passe bei Bedarf `src/lib/content/stopwords.de.txt` an.

## Theming & Accessibility

- `Layout.jsx` verwaltet `ThemeContext`.
- ThemeToggle bietet `light`, `dark`, `system`.
- `prefers-reduced-motion` deaktiviert Transitionen.
- `prefers-contrast: more` reduziert Schatten und erhöht Kontraste.
- Meta-Farbe (`<meta name="theme-color">`) bleibt synchron, damit Browser-Chrome zum Theme passt.

## Responsive Patterns

- Mobile Hamburger-Menü (`< lg`) und Desktop-Sidebar (`≥ lg`).
- Container Queries steuern Grid-Spalten der Card-Layouts.
- Fluid Typography via `clamp()` sorgt für harmonische Schriftgrößen.

## Suche & Filter

- Fuse.js Index umfasst `title`, `excerpt`, `body`, `tags`, `topics`.
- Debounce (~250 ms) verhindert unnötige Re-Renders.
- Tag/Topic-Chips lassen sich kombinieren, Reset jederzeit möglich.
- Relevanz-Score (1 - score) wird angezeigt, um Trefferqualität einzuschätzen.

## SEO & Feeds

- `react-helmet-async` setzt pro Route Title, Description, Canonical & Social Tags.
- Blog-Detailseiten liefern JSON-LD (`BlogPosting`).
- `scripts/generate-feeds.mjs` baut `dist/sitemap.xml` und `dist/rss.xml`.
- `SITE_URL` kann beim Build via Umgebungsvariable überschrieben werden.

## Pakete aktuell halten

Dank `npm-check-updates` kannst du Abhängigkeiten regelmäßig pflegen:

```bash
npm run update:check   # zeigt verfügbare Updates
npm run update:apply   # aktualisiert package.json + installiert neu
```

Nach einem Update bitte `npm run dev` bzw. `npm run build` ausführen und die wichtigsten Seiten testen.

## Deployment (Beispiel: Vercel)

1. Repository in GitHub/GitLab/Bitbucket pushen.
2. Neues Vercel-Projekt anlegen und Repo verknüpfen.
3. Build Command: `npm run build`, Output: `dist`.
4. `NODE_VERSION` auf `20` (oder höher) setzen.
5. Deploy starten – das Post-Build-Skript erzeugt Sitemap & RSS automatisch.

Previews für Pull Requests sind empfehlenswert, damit Reviewer UI-Änderungen direkt sehen.

## FAQ / Troubleshooting

- **Suchergebnisse leer?** Prüfe, ob Frontmatter korrekt ausgefüllt ist und die Datei-Endung stimmt.
- **Keine Auto-Hashtags?** Eventuell enthält der Text nur Stopwörter – erweitere `stopwords.de.txt`.
- **Dark-Mode flackert beim Laden?** Stelle sicher, dass `localStorage` Zugriff hat (kein strenger Privacy-Modus) und lade die Seite neu.
- **Sitemap/RSS fehlen?** `npm run build` erneut ausführen; das Script legt Dateien im `dist` Ordner ab.
- **Hinweis zu React Router Warnungen:** Wir haben die `future`-Flags `v7_relativeSplatPath` und `v7_startTransition` bereits aktiviert (siehe `src/main.jsx`), damit erscheinen in der Konsole keine Deprecation-Hinweise. Falls du weitere Router-Warnungen siehst, prüfe, ob du die gleichen Flags gesetzt hast.

## Lizenz

Siehe [LICENSE](LICENSE). Nutze das Projekt frei für Lernzwecke oder als Basis für eigene Blogs. Über Credits freuen wir uns.
