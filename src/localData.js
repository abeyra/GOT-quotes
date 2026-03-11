import rawData from './data/quotes.json';

// --- Private helpers ---

function buildQuote(q) {
  const char = rawData.characters[q.character];
  const houseSlug = char.house;
  const house = houseSlug ? rawData.houses[houseSlug] : null;
  return {
    sentence: q.sentence,
    character: {
      name: char.name,
      slug: q.character,
      house: house ? { name: house.name, slug: houseSlug } : null,
    },
  };
}

// Returns all quotes from characters belonging to the given house.
function getHousePool(houseSlug) {
  const memberSlugs = new Set(
    Object.entries(rawData.characters)
      .filter(([, c]) => c.house === houseSlug)
      .map(([slug]) => slug)
  );
  return rawData.quotes.filter((q) => memberSlugs.has(q.character));
}

// Returns all quotes whose text or character name matches the search term.
function getSearchPool(term) {
  const lower = term.toLowerCase().trim();
  if (!lower) return rawData.quotes;
  return rawData.quotes.filter((q) => {
    const char = rawData.characters[q.character];
    return (
      q.sentence.toLowerCase().includes(lower) ||
      char.name.toLowerCase().includes(lower)
    );
  });
}

// Picks a random quote from pool, preferring unseen ones.
// Falls back to the full pool once all quotes have been shown.
function pickFrom(pool, exclude) {
  if (!pool.length) return null;
  const unseen = exclude.size ? pool.filter((q) => !exclude.has(q.sentence)) : pool;
  const source = unseen.length ? unseen : pool;
  return buildQuote(source[Math.floor(Math.random() * source.length)]);
}

// --- Exported data accessors ---

export function getHouses() {
  return Object.entries(rawData.houses)
    .map(([slug, house]) => ({ slug, name: house.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCharacters() {
  return Object.entries(rawData.characters).map(([slug, char]) => ({
    slug,
    name: char.name,
    quotes: rawData.quotes.filter((q) => q.character === slug).map((q) => q.sentence),
  }));
}

// --- Quote fetchers ---

export function getRandomQuote(exclude = new Set()) {
  return pickFrom(rawData.quotes, exclude);
}

export function getRandomQuoteByChar(charSlug, exclude = new Set()) {
  return pickFrom(rawData.quotes.filter((q) => q.character === charSlug), exclude);
}

export function getRandomQuoteByHouse(houseSlug, exclude = new Set()) {
  return pickFrom(getHousePool(houseSlug), exclude);
}

export function searchQuotes(term, exclude = new Set()) {
  return pickFrom(getSearchPool(term), exclude);
}

// --- Pool size ---

// Returns the total number of quotes available for the active filter.
// Used to determine whether the Next button should be enabled.
export function getAvailableCount(houseSlug, charSlug, term) {
  if (term) return getSearchPool(term).length;
  if (charSlug) return rawData.quotes.filter((q) => q.character === charSlug).length;
  if (houseSlug) return getHousePool(houseSlug).length;
  return rawData.quotes.length;
}
