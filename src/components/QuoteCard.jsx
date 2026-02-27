import Actions from './Actions.jsx';
import SharePanel from './SharePanel.jsx';

export default function QuoteCard({
  quote,
  isFading,
  isFavorite,
  shareOpen,
  historyIndex,
  twitterUrl,
  copyLabel,
  onGetNewQuote,
  onPrev,
  onNext,
  onToggleFavorite,
  onToggleShare,
  onCopyToClipboard,
}) {
  const houseName = quote?.character?.house?.name
    ? `House ${quote.character.house.name}`
    : '';

  return (
    <div className={`got__container${isFading ? ' got__container--fading' : ''}`}>
      <div className="got__house-badge">
        <span className="got__house-name">{houseName}</span>
      </div>

      <h1 className="got__character">{quote?.character?.name ?? ''}</h1>
      <p className="got__quote">{quote?.sentence ?? ''}</p>

      <Actions
        historyIndex={historyIndex}
        isFavorite={isFavorite}
        onPrev={onPrev}
        onNext={onNext}
        onToggleFavorite={onToggleFavorite}
        onToggleShare={onToggleShare}
      />

      <SharePanel
        shareOpen={shareOpen}
        twitterUrl={twitterUrl}
        copyLabel={copyLabel}
        onCopy={onCopyToClipboard}
      />

      <button className="got__button" onClick={onGetNewQuote}>
        Get New Quote
      </button>
    </div>
  );
}
