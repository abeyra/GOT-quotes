import { useEffect, useState } from 'react';
import { getFavoriteKey } from '../constants.js';

const SORT_OPTIONS = [
  { value: 'added', label: 'Date Added' },
  { value: 'character', label: 'Character' },
  { value: 'house', label: 'House' },
];

function sortedFavorites(favorites, sortBy) {
  const copy = [...favorites];
  if (sortBy === 'character') {
    copy.sort((a, b) => a.character.name.localeCompare(b.character.name));
  } else if (sortBy === 'house') {
    copy.sort((a, b) => {
      const ha = a.character.house?.name ?? 'zzz';
      const hb = b.character.house?.name ?? 'zzz';
      return ha.localeCompare(hb);
    });
  } else {
    // 'added': sort by savedAt ascending (oldest first = order added); reverse for newest first
    copy.sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0));
  }
  return copy;
}

export default function FavoritesModal({ isOpen, favorites, onClose, onRemove }) {
  const [sortBy, setSortBy] = useState('added');

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const displayed = sortedFavorites(favorites, sortBy);

  return (
    <div
      className={`got__modal${isOpen ? '' : ' got__modal--hidden'}`}
      id="favorites-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Favorite Quotes"
    >
      <div className="got__modal__backdrop" onClick={onClose} />
      <div className="got__modal__panel">
        <div className="got__modal__header">
          <h2 className="got__modal__title">Favorite Quotes</h2>
          <button className="got__modal__close" aria-label="Close favorites" onClick={onClose}>
            &times;
          </button>
        </div>

        {favorites.length > 0 && (
          <div className="got__modal__sort">
            <span className="got__modal__sort-label">Sort by:</span>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`got__modal__sort-btn${sortBy === opt.value ? ' got__modal__sort-btn--active' : ''}`}
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <ul className="got__modal__list">
          {displayed.map((q) => {
            const key = getFavoriteKey(q);
            return (
              <li key={key} className="got__modal__item">
                <strong className="got__modal__item-char">{q.character.name}</strong>
                {q.character.house && (
                  <span className="got__modal__item-house">{q.character.house.name}</span>
                )}
                <p className="got__modal__item-quote">&quot;{q.sentence}&quot;</p>
                <button
                  className="got__modal__item-remove"
                  aria-label={`Remove quote by ${q.character.name}`}
                  onClick={() => onRemove(key)}
                >
                  &times;
                </button>
              </li>
            );
          })}
        </ul>

        {favorites.length === 0 && (
          <p className="got__modal__empty">No favorites yet.</p>
        )}
      </div>
    </div>
  );
}
