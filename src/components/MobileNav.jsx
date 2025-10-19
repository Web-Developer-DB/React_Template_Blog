/**
 * @fileoverview Bottom navigation for small screens.
 * @description
 *    Mirrors the desktop navigation but condensed into icons for mobile usage.
 *    CSS hides this component on large viewports.
 * @module components/MobileNav
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React from 'react';
import { NavLink } from 'react-router-dom';

// ── Abschnitt: Daten ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/', label: 'Start', icon: '🏠' },
  { to: '/blog', label: 'Blog', icon: '📝' },
  { to: '/tags', label: 'Tags', icon: '🏷️' },
  { to: '/search', label: 'Suche', icon: '🔍' },
];

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component MobileNav
 * @description
 *    Fixed navigation bar for touch devices. We expose labels through
 *    `<span className="sr-only">` for screen readers while keeping the visual UI
 *    minimal.
 *
 * @returns {JSX.Element}
 */
function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile Navigation">
      <ul className="mobile-nav__list">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="mobile-nav__item">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="sr-only">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MobileNav;
