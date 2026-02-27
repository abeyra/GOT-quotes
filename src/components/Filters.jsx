export default function Filters({
  houses,
  characters,
  houseSlug,
  charSlug,
  onHouseChange,
  onCharChange,
}) {
  const charsWithQuotes = characters
    .filter((c) => c.quotes && c.quotes.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="got__filters">
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
  );
}
