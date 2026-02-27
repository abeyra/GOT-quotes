import { useEffect } from 'react';

export default function FavoritesModal({ isOpen, favorites, onClose, onRemove }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

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

        <ul className="got__modal__list">
          {favorites.map((q, i) => (
            <li key={`${q.character.name}::${q.sentence}`} className="got__modal__item">
              <strong className="got__modal__item-char">{q.character.name}</strong>
              <p className="got__modal__item-quote">&quot;{q.sentence}&quot;</p>
              <button
                className="got__modal__item-remove"
                aria-label="Remove"
                onClick={() => onRemove(i)}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>

        {favorites.length === 0 && (
          <p className="got__modal__empty">No favorites yet.</p>
        )}
      </div>
    </div>
  );
}
