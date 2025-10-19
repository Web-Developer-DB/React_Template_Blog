/**
 * @fileoverview Top-level route map for the educational blog template.
 * @description
 *    Declares the routing table and wires feature routes into the application
 *    shell implemented by `Layout`. Each view stays in `/src/routes` so junior
 *    developers can clearly see how React Router organises code.
 * @module src/App
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './routes/_layout/Layout.jsx';
import HomeRoute from './routes/index.jsx';
import BlogIndexRoute from './routes/blog/index.jsx';
import BlogDetailRoute from './routes/blog/[slug].jsx';
import TagsRoute from './routes/tags/index.jsx';
import SearchRoute from './routes/search/index.jsx';

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component App
 * @description
 *    Provides the central routing table. Using nested routes keeps layout
 *    concerns (header/footer/nav) isolated from page-specific logic.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomeRoute />} />
        <Route path="blog" element={<BlogIndexRoute />} />
        <Route path="blog/:slug" element={<BlogDetailRoute />} />
        <Route path="tags" element={<TagsRoute />} />
        <Route path="search" element={<SearchRoute />} />
      </Route>
    </Routes>
  );
}

export default App;
