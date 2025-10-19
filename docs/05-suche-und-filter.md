# 05 · Suche & Filter

Die Kombination aus Volltextsuche und Metadaten-Filtern macht Content auffindbar.

## 1. Fuse.js Basics

- Fuse ist ein clientseitiger Fuzzy-Search-Index.
- Konfiguration (`src/routes/search/index.jsx`):
  - `keys`: `title`, `excerpt`, `body`, `tags`, `topics`
  - `threshold`: 0.35 (kleiner = exakter)
  - `ignoreLocation`: true (Position im Text egal)
- `SearchBar` debounced Eingaben (250 ms) und synchronisiert Query-Parameter (`?q=`).

## 2. Filter-Logik

- `TagChips` Komponente rendert Buttons für Tags/Topics.
- Routes (`/blog`, `/tags`, `/search`) kombinieren Filter:
  - Tags müssen alle matchen (`every`).
  - Topics ebenso.
- Filter-Rücksetzen über Buttons möglich.

## 3. UX-Aspekte

- Zeige bei leerer Suche einen Hinweis („Starte oben…“).
- Liste Relevanzscores (`1 - score`) für Transparenz.
- Lasse Nutzer:innen per Chip weitere Filter setzen oder entfernen.

## 4. Erweiterungen

- Treffer hervorheben (`mark` Tags) → in `SearchResults` implementierbar.
- Caching: Speichere die Fuse-Instanz in Context, wenn du große Datenmengen hast.
- Server-Suche: Für sehr große Blogs lohnt sich ElasticSearch oder Algolia – das Template bildet die Basis, um später umzusteigen.

Teste die Suche regelmäßig: Ergänze neue Posts, prüfe Filter-Kombinationen und beobachte, ob Ergebnisse sinnvoll bleiben. Datenqualität entscheidet über die Güte der Suche.
