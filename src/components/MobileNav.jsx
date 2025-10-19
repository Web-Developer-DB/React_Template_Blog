/**
 * @fileoverview Hamburger-Menü für kleine Bildschirme.
 * @description
 *    Ersetzt die vorherige Bottom-Bar durch ein Overlay-Menü. Ein
 *    Hamburger-Button öffnet eine „Schublade“, die Links vertikal listet.
 * @module components/MobileNav
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
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
 * @component MobileNav
 * @description
 *    Steuert ein Hamburger-Menü inkl. Overlay. Das Menü ist nur auf mobilen
 *    Viewports sichtbar (siehe CSS). Beim Öffnen deaktivieren wir Scrollen im
 *    Body, damit das Overlay ruhig bleibt.
 *
 * @returns {JSX.Element}
 */
function MobileNav() {
  const [open, setOpen] = useState(false);

  // Wenn das Menü offen ist, sperren wir den Body-Scroll, damit die Overlay-Ebene nicht mit scrollt.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const { body } = document;
    if (open) {
      body.style.setProperty('overflow', 'hidden');
    } else {
      body.style.removeProperty('overflow');
    }

    return () => {
      body.style.removeProperty('overflow');
    };
  }, [open]);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-nav__toggle"
        aria-label={open ? 'Navigation schließen' : 'Navigation öffnen'}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        onClick={toggleMenu}
      >
        <span aria-hidden="true" className="mobile-nav__toggle-icon" data-open={open}>
          <span />
          <span />
          <span />
        </span>
      </button>

      <div
        className="mobile-nav__overlay"
        data-open={open}
        onClick={closeMenu}
        role="presentation"
      />

      <nav
        id="mobile-nav-drawer"
        className="mobile-nav__drawer"
        data-open={open}
        aria-label="Mobile Navigation"
      >
        <ul className="mobile-nav__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to} className="mobile-nav__item">
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                onClick={closeMenu}
              >
                <span aria-hidden="true" className="mobile-nav__item-icon">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default MobileNav;
