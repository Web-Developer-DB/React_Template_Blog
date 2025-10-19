---
title: "Content-Architektur für React-Blogs: Ordnung in der Dateistruktur"
date: "2025-02-21"
tags: ["content","struktur","slug-strategie"]
topics: ["Content-Architektur"]
excerpt: "Wie du Markdown, MDX und JSX-Inhalte konsistent organisierst und automatisch indizierst."
cover: "/images/cover-content.svg"
---

Eine gute Content-Architektur trennt Rohinhalte von Präsentationslogik. Im Template legen wir alle Beiträge unter `/content/blog` ab – egal ob Markdown, MDX oder JSX. Der Clou: `import.meta.glob` durchforstet das Verzeichnis und liefert uns sowohl Komponenten als auch Rohtext. So bleibt die Content-Schicht unabhängig von der UI.

Warum drei Formate? Markdown eignet sich für einfache Texte, MDX erlaubt Einbettungen von React-Komponenten und JSX bietet völlige Freiheit bei Spezialfällen (z. B. interaktive Demos). Damit diese Vielfalt nicht im Chaos endet, definieren wir ein gemeinsames Frontmatter-Schema. Titel, Datum, Tags, Topics, Excerpt, Cover – alles klar strukturiert und dokumentiert. Selbst bei JSX-Dateien erlauben wir Frontmatter, indem wir es im Kommentarblock einschließen, den der Parser erkennt.

Der Indexer (`/src/lib/content/index.js`) erzeugt aus jedem Dokument ein einheitliches Objekt. Wir normalisieren Slugs, konvertieren Body-Inhalte in Plaintext (für die Suche) und kombinieren Tags aus dem Frontmatter mit automatisch extrahierten Hashtags. Wichtig ist auch die Sortierung: `date desc` sorgt dafür, dass neue Beiträge oben stehen. Wer neue Felder braucht, erweitert an einer Stelle das Schema und hat sofort konsistente Daten.

Praktischer Tipp aus der Content-Strategie: Benenne Dateien so, dass sie die URL widerspiegeln (`YYYY-MM-title`). Dadurch behältst du die zeitliche Reihenfolge und erzeugst menschenlesbare Slugs. Nutze Topics für größere Themenbereiche (z. B. „Performance“, „Barrierefreiheit“) und Tags für detailreiche Stichworte. So lassen sich Filter-Interfaces intuitiv gestalten – ganz wie in diesem Projekt.
