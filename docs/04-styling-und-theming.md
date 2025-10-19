# 04 · Styling & Theming

Dieses Projekt zeigt, wie du moderne CSS-Techniken mit React kombinierst.

## 1. Theme-Strategie

- `Layout.jsx` verwaltet die Präferenz (Light/Dark/System) via Context.
- `data-theme` landet auf `<html>` und schaltet CSS-Variablen um.
- `localStorage` merkt sich die Nutzerwahl (`react-template-blog:theme-preference`).
- `prefers-reduced-motion` und `prefers-contrast` werden überwacht und in `data-motion` bzw. `data-contrast` gespiegelt.

## 2. CSS-Struktur

- `globals.css` → Reset, Theme-Variablen, Basislayout.
- `layout.css` → Raster, Container-Queries, Navigation.
- `typography.css` → `clamp()` Typo-Skala und Text-Elemente.
- `components.css` → Buttons, Cards, Chips, Suche.

## 3. Mobile-First & Container Queries

- Alle Komponenten starten ohne Breakpoint.
- `@media (min-width: …)` erweitert Layouts (z. B. Desktop Sidebar).
- Container Queries (`container-type: inline-size`) erlauben komponentenlokale Magie: Card-Grids richten sich nach ihrer Containerbreite.

## 4. Motion & Kontrast

- Standardmäßig gelten sanfte Transitions (`transform`, `box-shadow`).
- Wenn `data-motion="reduced"`, deaktivierst du diese in CSS (siehe TODO für eigene Erweiterungen).
- Bei `data-contrast="more"` löschen wir Schatten und verstärken Farben.

## 5. Tipps für eigene Projekte

- Lege Farbleisten (`--color-*`) zentral fest.
- Nutze `clamp()` für Margins und Padding, wenn du noch flexiblere Layouts brauchst.
- Dokumentiere die Entscheidungen (z. B. in einem Design-Tokens-Dokument).

Theming in React ist kein Hexenwerk – solange du Zustände, CSS-Variablen und Media Queries kombinierst.
