/**
 * @fileoverview Application bootstrap for the React Vite blog template.
 * @description
 *    This module mounts the React app, wires up the router, and injects the
 *    global providers that the rest of the UI depends on.
 * @module src/main
 * @depends react, react-dom, react-router-dom, react-helmet-async
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.jsx';
import './styles/globals.css';
import './styles/layout.css';
import './styles/typography.css';
import './styles/components.css';

// ── Abschnitt: Bootstrap ──────────────────────────────────────────────────────
/**
 * Mounts the React application.
 *
 * The HelmetProvider wraps the entire tree so that the `Seo` component can push
 * meta tags into the document head from any route. `StrictMode` helps catch
 * accidental side effects during development.
 */
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <HelmetProvider>
      {/* Aktiviert die neue (bald standardmäßige) Behandlung relativer Splat-Routen */}
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
