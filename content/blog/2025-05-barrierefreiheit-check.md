---
title: "Barrierefreiheit im Schnellcheck: Was Frontend-Teams prüfen sollten"
date: "2025-05-12"
tags: ["a11y","checkliste","wcag"]
topics: ["Barrierefreiheit"]
excerpt: "Eine praxisnahe Checkliste für Barrierefreiheit – ideal für Code-Reviews und QA-Runden."
cover: "/images/cover-a11y.svg"
---

Barrierefreiheit (Accessibility) darf kein nachträglicher Gedanke sein. Wer zu spät testet, muss mühsam refactoren. Deshalb lohnt sich eine wiederkehrende Checkliste. Diese Kurzliste orientiert sich an WCAG-Kriterien und passt perfekt in Sprint-Reviews.

1. **Tastatur-Navigation**: Kannst du jede Funktion ohne Maus erreichen? Nutze `Tab`, `Shift+Tab`, `Enter` und `Space`, um Buttons und Links zu testen. Achte auf sichtbare Fokus-Ringe.
2. **Semantik**: Verwende native Elemente (`button`, `nav`, `main`). Falls du eine Custom-Komponente brauchst, versieh sie mit den nötigen ARIA-Attributen.
3. **Kontrast**: Prüfe Text-zu-Hintergrund-Kontraste. Tools wie der WebAIM Contrast Checker helfen. Für Dark-Mode solltest du die gleichen Kontrollen durchführen.
4. **Lesereihenfolge**: Screenreader lesen die DOM-Struktur, nicht die optische Position. Platziere Überschriften logisch, vermeide Sprünge in der Hierarchie.
5. **Alternativtexte**: Jedes informative Bild braucht ein `alt`-Attribut. Dekorative Bilder können `alt=""` haben.

Das Template berücksichtigt diese Prinzipien bereits: Skip-Link, Landmark-Rollen und klare Texte. Doch nimm die Liste ruhig als Reminder für deine eigenen Projekte. Accessibility ist kein Zustand, sondern ein Prozess. Jede neue Funktion sollte gegen diese Kriterien geprüft werden.
