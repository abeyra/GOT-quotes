import { useState, useEffect } from 'react';

export default function Filters({
  houses,
  characters,
  houseSlug,
  charSlug,
  searchTerm,
  onHouseChange,
  onCharChange,
  onSearch,
}) {
  const [inputValue, setInputValue] = useState(searchTerm);

  // Sync input when parent resets searchTerm (e.g. when user picks a filter)
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const charsWithQuotes = characters
    .filter((c) => c.quotes && c.quotes.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  function handleKeyDown(e) {
    if (e.key === 'Enter') onSearch(inputValue.trim());
  }

  function handleClear() {
    setInputValue('');
    onSearch('');
  }

  return (
    <div className="got__filters">
      <div className="got__filters__row">
        <select
          className="got__select got__select--house"
          id="house-select"
          value={houseSlug || ''}
          onChange={(e) => onHouseChange(e.target.value || null)}
        >
          <option value="">All Houses</option>
          {houses.map((house) => (
            <option key={house.slug} value={house.slug}>
              {house.name}
            </option>
          ))}
        </select>

        <select
          className="got__select got__select--char"
          id="char-select"
          value={charSlug || ''}
          onChange={(e) => onCharChange(e.target.value || null)}
        >
          <option value="">All Characters</option>
          {charsWithQuotes.map((char) => (
            <option key={char.slug} value={char.slug}>
              {char.name}
            </option>
          ))}
        </select>
      </div>

      <div className="got__search">
        <input
          className="got__search__input"
          type="text"
          placeholder="Search quotes or characters…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search quotes"
        />
        {inputValue && (
          <button
            className="got__search__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        <button
          className="got__search__btn"
          onClick={() => onSearch(inputValue.trim())}
          aria-label="Submit search"
        >
          Search
        </button>
      </div>
    </div>
  );
}
