---
title: "Dark-Mode & Theming: Vom System-Signal zur UI-Strategie"
date: "2025-02-05"
tags: ["darkmode","theming","accessibility"]
topics: ["Designsysteme","Dark-Mode"]
excerpt: "Lerne, wie du Light/Dark/System-Modi orchestrierst, Nutzerpräferenzen speicherst und UI-Details wie meta theme-color synchronisierst."
cover: "/images/cover-darkmode.svg"
---

Der Dark-Mode ist mehr als ein inverses Stylesheet. Teams, die das Thema ernst nehmen, definieren eine Theming-Strategie: Farbsysteme, Interaktionen, Assets und sogar Motion-Richtlinien werden doppelt gedacht. Das klingt nach viel Aufwand, zahlt sich aber durch konsistentere User-Erfahrungen aus.

Ein sinnvoller erster Schritt: Arbeite mit CSS Custom Properties und schalte sie anhand eines `data-theme` Attributes. Das Template nutzt genau diesen Mechanismus. Die React-Komponente beobachtet sowohl die Systempräferenz (`prefers-color-scheme`) als auch Nutzerentscheidungen (localStorage). So bleibt der erste Eindruck systemkonform, während Besucher:innen jederzeit per Toggle wechseln können.

Vergiss nicht auf den Browser-Chrome: Ohne aktualisierte `<meta name="theme-color">` erscheint deine App im Mobilbrowser mit falscher Leiste. Auch das geht automatisiert. Sobald sich das Theme ändert, aktualisieren wir den Meta-Tag. Kleine Details wie dieses machen den Unterschied zwischen „funktioniert irgendwie“ und „fühlt sich nativ an“.

Barrierefreiheit spielt ebenfalls eine Rolle. `prefers-reduced-motion` und `prefers-contrast` liefern Signale, die du respektieren solltest. Auch wenn nicht jeder Browser sie unterstützt, zeigt das Template, wie du die Informationen in `data-motion` bzw. `data-contrast` spiegelst und dort CSS-Verzweigungen anbietest. Bei reduzierter Bewegung verzichten wir auf Fancy-Transitions, bei erhöhtem Kontrast verstärken wir Farben und schalten Schatten ab.

Zum Schluss ein Tipp für die Praxis: Dokumentiere deine Theme-Entscheidungen. Halte fest, welche Farben wofür stehen, welche Kantenradien du nutzt und welche Ausnahmen erlaubt sind. So entsteht nach und nach ein Designsystem, das du mit Kolleg:innen teilen kannst. Und genau diese Art von Dokumentation findest du auch in den `/docs` Dateien dieses Projekts.
