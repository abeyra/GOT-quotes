import rawData from './data/quotes.json';

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

export function getRandomQuote() {
  return buildQuote(rawData.quotes[Math.floor(Math.random() * rawData.quotes.length)]);
}

export function getRandomQuoteByChar(charSlug) {
  const pool = rawData.quotes.filter((q) => q.character === charSlug);
  if (!pool.length) return null;
  return buildQuote(pool[Math.floor(Math.random() * pool.length)]);
}

export function getRandomQuoteByHouse(houseSlug) {
  const houseCharSlugs = new Set(
    Object.entries(rawData.characters)
      .filter(([, c]) => c.house === houseSlug)
      .map(([slug]) => slug)
  );
  const pool = rawData.quotes.filter((q) => houseCharSlugs.has(q.character));
  if (!pool.length) return null;
  return buildQuote(pool[Math.floor(Math.random() * pool.length)]);
}
