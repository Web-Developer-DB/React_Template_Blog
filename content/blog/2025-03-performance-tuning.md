---
title: "Performance-Tuning im Vite/React-Blog: Kleine Schritte, große Wirkung"
date: "2025-03-18"
tags: ["performance","vite","optimierung"]
topics: ["Leistung"]
excerpt: "Wie du mit Code-Splitting, Bildoptimierung und Lighthouse-Checks deinen React-Blog beschleunigst."
cover: "/images/cover-performance.svg"
---

Performance beginnt nicht erst bei Webpack-Konfigurationen. Schon die Content-Struktur beeinflusst Ladezeiten: kurze Excerpts, optimierte Bilder, sinnvolle Überschriften-Hierarchien. In diesem Template setzen wir auf Vite, das dank ESBuild rasante Dev-Builds liefert. Für den Production-Build übernimmt Rollup und sorgt für effizientes Tree Shaking. Das heißt: Unbenutzter Code wird gar nicht erst ausgeliefert.

Ein weiterer Hebel ist Code-Splitting. React Router unterstützt Lazy Loading mit `React.lazy` und `Suspense`. In diesem Lernprojekt lassen wir bewusst alles eager, damit du die Architektur leichter nachvollziehen kannst. In echten Projekten solltest du große Seiten (z. B. Admin-Tools) trotzdem nachladen. Ein sauberer Startpfad reduziert die Time-to-Interactive deutlich.

Auch Medien spielen eine tragende Rolle. Selbst generische Platzhalter sollten als SVG oder hochkomprimierte WebP-Dateien vorliegen. Für echte Projekte empfiehlt sich ein Bild-CDN, das je nach Device variierende Größen ausliefert. Kombiniere das mit dem `loading="lazy"` Attribut, um Browsern das asynchrone Nachladen zu erlauben. Die ContentCards in diesem Template demonstrieren das.

Nicht zu unterschätzen: Runtime-Optimierungen. Durch `useMemo` und `useState` an den richtigen Stellen reduzieren wir Re-Renders. Der Content-Indexer wird nur einmal berechnet und liefert dann eine flache Kopie. Die Suche nutzt Fuse.js mit einem Threshold, der unnötige Treffer vermeidet. All diese Kleinigkeiten summieren sich.

Zum Abschluss lohnt sich ein Blick in Lighthouse oder WebPageTest. Analysiere First Contentful Paint (FCP), Largest Contentful Paint (LCP) und den Speed Index. Notiere deine Ergebnisse und vergleiche, bevor du neue Features auslieferst. Performance ist kein einmaliges Projekt, sondern ein kontinuierlicher Prozess.
