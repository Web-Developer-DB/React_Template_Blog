/**
 * @fileoverview Vite configuration for the educational blog template.
 * @description
 *    Combines the React plugin with the MDX Rollup plugin so that markdown
 *    content can be rendered as JSX at build time. The configuration keeps the
 *    defaults intentionally simple to highlight the pieces junior developers
 *    should understand first (plugins and aliases).
 * @module vite.config
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';

// ── Abschnitt: Export ─────────────────────────────────────────────────────────
/**
 * Creates the Vite configuration with MDX + React support.
 *
 * We explicitly register the MDX plugin before the React plugin. This ensures
 * `.md` and `.mdx` files are transformed into JSX before React tries to compile
 * them. The include pattern lets us author both markdown and MDX posts inside
 * `/content`.
 */
export default defineConfig({
  plugins: [
    mdx({
      include: ['**/*.md', '**/*.mdx'],
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
