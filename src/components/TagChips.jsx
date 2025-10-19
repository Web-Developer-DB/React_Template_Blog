/**
 * @fileoverview Filter chips for tags and topics.
 * @description
 *    Visualises both hashtag-style tags and broader topics with distinct
 *    styling so Nutzer:innen die Unterscheidung sehen.
 * @module components/TagChips
 */

// ── Abschnitt: Imports ────────────────────────────────────────────────────────
import React from 'react';

// ── Abschnitt: Komponente ─────────────────────────────────────────────────────
/**
 * @component TagChips
 * @description
 *    Renders clickable chips for tags/topics. The parent component can control
 *    active filters by passing `activeTags` / `activeTopics`.
 *
 * @param {Object} props
 * @param {string[]} [props.tags]
 * @param {string[]} [props.topics]
 * @param {string[]} [props.activeTags]
 * @param {string[]} [props.activeTopics]
 * @param {(value: string, type: 'tag' | 'topic') => void} [props.onToggle]
 * @param {boolean} [props.compact]
 * @returns {JSX.Element}
 */
function TagChips({
  tags = [],
  topics = [],
  activeTags = [],
  activeTopics = [],
  onToggle,
  compact = false,
}) {
  // Helper-Funktion vermeidet doppelte Button-Definition für Tags & Topics.
  const renderChip = (value, type) => {
    const isActive = type === 'tag' ? activeTags.includes(value) : activeTopics.includes(value);

    return (
      <button
        key={`${type}-${value}`}
        type="button"
        className="tag-chip"
        data-type={type}
        data-active={isActive}
        // `?.` schützt vor undefined, falls kein onToggle übergeben wurde.
        onClick={() => onToggle?.(value, type)}
      >
        {/* Unterschiedliche Icons helfen beim visuellen Unterscheiden. */}
        <span aria-hidden="true">{type === 'tag' ? '#' : '⬖'}</span>
        <span>{value}</span>
      </button>
    );
  };

  return (
    <div className={compact ? 'tag-chips tag-chips--compact' : 'tag-chips'}>
      {/* Tags erscheinen zuerst, Topics danach – UI bleibt konsistent. */}
      {tags.map((tag) => renderChip(tag, 'tag'))}
      {topics.map((topic) => renderChip(topic, 'topic'))}
      {tags.length === 0 && topics.length === 0 ? (
        // Fallback-Text erklärt, dass keine Metadaten existieren – besser als eine leere Box.
        <span className="tag-chips__empty">Keine Metadaten hinterlegt.</span>
      ) : null}
    </div>
  );
}

export default TagChips;
