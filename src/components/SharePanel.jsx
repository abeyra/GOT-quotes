export default function SharePanel({ shareOpen, twitterUrl, copyLabel, onCopy }) {
  return (
    <div className={`got__share-panel${shareOpen ? '' : ' got__share-panel--hidden'}`}>
      <button className="got__share-copy" onClick={onCopy}>
        {copyLabel}
      </button>
      <a
        className="got__share-twitter"
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on X
      </a>
    </div>
  );
}
