export default function SoundPlayer() {
  return (
    <div className="got__song-container">
      <iframe
        className="got__soundtrack"
        height="300"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/144848972&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=false"
      />
      <div
        style={{
          fontSize: '10px',
          color: '#cccccc',
          lineBreak: 'anywhere',
          wordBreak: 'normal',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          fontFamily: 'Interstate, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Garuda, Verdana, Tahoma, sans-serif',
          fontWeight: '100',
        }}
      >
        <a
          href="https://soundcloud.com/game-of-thrones-songs"
          title="Game of Thrones Songs"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#cccccc', textDecoration: 'none' }}
        />
        {' · '}
        <a
          href="https://soundcloud.com/game-of-thrones-songs/opening-theme-game-of-thrones"
          title="Opening Theme - Game of Thrones"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#cccccc', textDecoration: 'none' }}
        />
      </div>
    </div>
  );
}
