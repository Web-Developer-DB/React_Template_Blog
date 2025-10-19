# 03 · Content-Workflow

Content sollte sich anfühlen wie Textbearbeitung, nicht wie Code-Gymnastik. So arbeitest du effizient:

## 1. Neue Beiträge anlegen

1. Lege eine Datei im Format `YYYY-MM-title.md` (oder `.mdx` / `.jsx`) an.
2. Kopiere das Frontmatter-Schema:

```yaml
---
title: "Titel"
date: "YYYY-MM-DD"
tags: ["stichwort1","stichwort2"]
topics: ["Kategorie1","Kategorie2"]
excerpt: "Kurzer Teaser."
cover: "/images/dein-cover.svg"
---
```

3. Schreibe den Inhalt. Bei `.mdx` kannst du JSX-Komponenten einbetten. Bei `.jsx` nutze einen Kommentarblock für das Frontmatter (siehe Deployment-Artikel).

## 2. Auto-Hashtags nutzen

- Die Hashtag-Logik extrahiert häufige Wörter und bündelt sie mit deinen Tags.
- Passe `stopwords.de.txt` an, falls fachspezifische Wörter zu häufig auftauchen.

## 3. Vorschau & Tests

- `npm run dev` startet Vite mit Hot Reloading.
- Öffne `/blog`, um zu prüfen, ob dein Beitrag auftaucht.
- Kontrolliere `/search`, ob der Text gefunden wird.

## 4. Qualitätssicherung

- Schreibe prägnante Excerpts (1–2 Sätze).
- Nutze sprechende Topics – sie erscheinen als Filter.
- Prüfe, ob das Cover-Bild existiert (unter `public/images`).

## 5. Veröffentlichung

- Merge den Branch.
- `npm run build` (lokal oder via CI) erzeugt die Produktionsversion.
- Das Post-Build-Script legt `sitemap.xml` und `rss.xml` an – wichtig für SEO & Feeds.

Content-Produktion wird damit reproduzierbar: gleiche Struktur, gleiche Schritte, keine Überraschungen.
