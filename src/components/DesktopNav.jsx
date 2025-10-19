/**
 * @fileoverview Desktop sidebar navigation.
 * @description
 *    Visible on screens ≥ lg breakpoint. Hosts persistent navigation links.
 * @module components/DesktopNav
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React from 'react';
import { NavLink } from 'react-router-dom';

// ── Abschnitt: Daten ──────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/', label: 'Start', icon: '🏠' },
  { to: '/blog', label: 'Blog', icon: '📝' },
  { to: '/tags', label: 'Tags & Topics', icon: '🏷️' },
  { to: '/search', label: 'Suche', icon: '🔍' },
];

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component DesktopNav
 * @description
 *    Renders a sidebar with navigation links. React Router automatically adds
 *    the `active` class to `<NavLink>` when the route matches, which our CSS
 *    uses for highlighting.
 *
 * @returns {JSX.Element}
 */
function DesktopNav() {
  return (
    <nav className="desktop-nav" aria-label="Hauptnavigation">
      <ul className="desktop-nav__list">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="desktop-nav__item">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              <span aria-hidden="true" className="desktop-nav__icon">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default DesktopNav;
