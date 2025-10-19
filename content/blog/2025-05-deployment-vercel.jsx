/*
---
title: "Deployment auf Vercel: Von `npm run build` bis zur Preview"
date: "2025-05-28"
tags: ["deployment","vercel","ci"]
topics: ["Deployment"]
excerpt: "Schritt-für-Schritt-Anleitung, wie du den React-Blog mit Vercel veröffentlichst und Preview-Umgebungen nutzt."
cover: "/images/cover-vercel.svg"
---
*/

import React from 'react';

/**
 * React-Komponente, die als Blogartikel fungiert.
 * JSX ist hier sinnvoll, weil wir gezielt UI-Elemente (z. B. Listen mit Icons)
 * rendern möchten. Das Frontmatter oben wird vom Parser gelesen.
 */
export default function DeploymentVercelPost() {
  return (
    <div className="article">
      <p>
        Vercel ist für React- und Next.js-Teams längst zum De-facto-Standard geworden. Aber auch
        klassische Vite-Apps lassen sich in wenigen Minuten deployen. Der Workflow ist denkbar
        einfach: Repository forken, mit Vercel verbinden, Branch auswählen – fertig. Vercel baut das
        Projekt automatisch mit `npm install && npm run build` und hostet das Ergebnis serverlos.
      </p>
      <ol>
        <li>Erstelle ein Vercel-Projekt und verknüpfe dein GitHub/GitLab/Bitbucket-Repo.</li>
        <li>Setze die Umgebungsvariable `NODE_VERSION` auf mindestens 20, damit Vite korrekt baut.</li>
        <li>Hinterlege `npm run build` als Build Command und `dist` als Output Directory.</li>
        <li>
          Optional: Aktiviere Preview Deployments für jeden Pull Request. So kann dein Team Features
          live testen, bevor sie gemergt werden.
        </li>
      </ol>
      <p>
        Für ein didaktisches Projekt wie dieses lohnt es sich, zusätzlich die `update:check` und
        `update:apply` Skripte zu dokumentieren. So bleibt dein Tech-Stack aktuell. Vercel
        unterstützt zudem Cron-Jobs („Scheduled Functions“), mit denen du zum Beispiel den RSS-Feed
        regelmäßig aktualisieren könntest. In unserem Fall genügt das `postbuild`-Script, das beim
        Deploy automatisch eine neue Sitemap und ein neues RSS-Feed generiert.
      </p>
      <p>
        Tipp: Nutze die Vercel-Analytics, um zu beobachten, welche Seiten besonders häufig
        aufgerufen werden. Kombiniere das mit der Fuse.js Suche und prüfe, welche Begriffe Nutzer:innen
        eingeben. Daraus ergeben sich neue Content-Ideen – oder Hinweise darauf, dass bestehende
        Artikel ergänzt werden sollten.
      </p>
    </div>
  );
}
