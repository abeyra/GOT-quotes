export default function Header({ onOpenModal }) {
  return (
    <header>
      <img
        className="header__logo"
        src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Game_of_Thrones_2011_logo.svg"
        alt="Game of Thrones"
      />
      <h2 className="header__title">Random Quote Generator</h2>
      <button
        className="header__favorites-btn"
        id="open-favorites"
        aria-label="View favorites"
        onClick={onOpenModal}
      >
        &#9825; Favorites
      </button>
    </header>
  );
}
