/**
 * @fileoverview Hashtag extraction helper.
 * @description
 *    Converts arbitrary text into a ranked list of keyword-like tokens that we
 *    can display as auto-generated hashtags. The logic is intentionally verbose
 *    with inline comments so Lernende die Schritte nachvollziehen können.
 * @module lib/content/hashtag
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import stopwordsRaw from './stopwords.de.txt?raw';

// ── Abschnitt: Konstanten ─────────────────────────────────────────────────────
const STOPWORDS = new Set(
  stopwordsRaw
    .split(/\r?\n/)
    .map((word) => word.trim())
    .filter(Boolean),
);

const MIN_TOKEN_LENGTH = 3;

// ── Abschnitt: Hilfsfunktionen ────────────────────────────────────────────────
/**
 * Entfernt Diakritika (z. B. ä → a) und vereinheitlicht ß zu ss.
 *
 * @param {string} value
 * @returns {string}
 */
function normalizeToken(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ß/g, 'ss');
}

/**
 * Prüft, ob ein Token sinnvoll für Hashtags ist.
 *
 * @param {string} token
 * @returns {boolean}
 */
function isMeaningfulToken(token) {
  if (!token || token.length < MIN_TOKEN_LENGTH) return false;
  if (STOPWORDS.has(token)) return false;
  if (/^\d+$/.test(token)) return false; // reine Zahlen ignorieren
  return true;
}

// ── Abschnitt: Public API ─────────────────────────────────────────────────────
/**
 * Extrahiert Auto-Hashtags aus Text.
 * - Lowercase, Tokenize, Stopwörter filtern (stopwords.de.txt)
 * - Umlaute/Diakritika normalisieren
 * - Häufigkeiten zählen, Top-N (Default 5)
 *
 * @param {string} text - Inhalt, typischerweise der Markdown-Body.
 * @param {{ max?: number }} [opts] - Optionsobjekt, erlaubt anderes Limit.
 * @returns {string[]} Array von Keyword-Strings (ohne # Prefix).
 *
 * @example
 * extractHashtags('React ist toll für UI Komponenten', { max: 3 });
 * // → ['react', 'komponenten', 'user']
 */
export function extractHashtags(text, opts = {}) {
  const { max = 5 } = opts;
  if (!text || typeof text !== 'string') return [];

  const tokens = text
    .split(/[\s,.;:!?()[\]{}"«»„”“›‹]+/)
    .map((token) => normalizeToken(token.replace(/[#*`]/g, '')))
    .filter(isMeaningfulToken);

  const frequency = new Map();
  for (const token of tokens) {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([token]) => token);
}
