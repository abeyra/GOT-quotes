export default function Actions({
  historyIndex,
  isFavorite,
  onPrev,
  onNext,
  onToggleFavorite,
  onToggleShare,
}) {
  return (
    <div className="got__actions">
      <button
        className="got__nav-btn got__nav-btn--prev"
        aria-label="Previous quote"
        disabled={historyIndex <= 0}
        onClick={onPrev}
      >
        &#8592;
      </button>
      <button
        className={`got__favorite-btn${isFavorite ? ' got__favorite-btn--active' : ''}`}
        aria-label="Add to favorites"
        onClick={onToggleFavorite}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
      <button
        className="got__share-btn"
        aria-label="Share quote"
        onClick={onToggleShare}
      >
        &#8679;
      </button>
      <button
        className="got__nav-btn got__nav-btn--next"
        aria-label="Next quote"
        onClick={onNext}
      >
        &#8594;
      </button>
    </div>
  );
}
