# 01 · Überblick & Lernziele

Willkommen im React Lern-Blog! Dieses Projekt ist bewusst als Lehrpfad aufgebaut. Jede Datei enthält Kommentare, Banner und JSDoc-Beschreibungen. Du kannst den Code wie ein Arbeitsbuch lesen:

- **Verstehen**: Lies die Kommentare in `Layout.jsx`, um Theming-Strategien zu erfassen.
- **Anwenden**: Ergänze eigene Inhalte unter `/content/blog` und beobachte, wie der Indexer sie automatisiert erkennt.
- **Reflektieren**: Nutze die `/docs` Kapitel als Nachschlagewerk für eigene Projekte.

## Lernziele

1. Du kannst ein React/Vite Projekt aufsetzen und erklären, warum Vite für Lernprojekte sinnvoll ist.
2. Du verstehst, wie Themen (Light/Dark/System) technisch umgesetzt werden – inklusive ARIA und Meta-Updates.
3. Du kannst Content-Dateien strukturieren, Frontmatter definieren und Filter/Suche mit Fuse.js einsetzen.
4. Du weißt, wie SEO-Basics (Meta-Tags, JSON-LD, Sitemap) funktionieren und in den Build-Prozess integriert werden.

## Projektaufbau

```
src/
  components/    # Gemeinsame UI-Elemente (ThemeToggle, SearchBar, …)
  routes/        # Seiten, organisiert nach React Router
  lib/content/   # Indexer & Hashtag-Logik
  styles/        # CSS nach Themen gegliedert
```

Nimm dir Zeit für jeden Bereich. Die Kommentare erklären Hintergründe, Trade-offs und Optionen zum Weiterdenken. Dieses Projekt lebt davon, dass du experimentierst: ändere Variablen, füge neue Routen hinzu oder erweitere die Suche um zusätzliche Felder.
