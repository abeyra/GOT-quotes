export const API_BASE = 'https://api.gameofthronesquotes.xyz/v1';

export const HOUSE_THEMES = {
  stark:     { bg: 'radial-gradient(50% 176%, #4a5568 80%, #2d3748 100%)', accent: '#ecf0f1', badge: '#7b8994' },
  lannister: { bg: 'radial-gradient(50% 176%, #7a6020 80%, #4a3810 100%)', accent: '#c0a060', badge: '#8b0000' },
  targaryen: { bg: 'radial-gradient(50% 176%, #3a0000 80%, #1a0000 100%)', accent: '#cc3333', badge: '#8b0000' },
  baratheon: { bg: 'radial-gradient(50% 176%, #3a3010 80%, #1a1a1a 100%)', accent: '#d4af37', badge: '#d4af37' },
  tyrell:    { bg: 'radial-gradient(50% 176%, #1a3a0a 80%, #0a1a04 100%)', accent: '#8bc34a', badge: '#2d5a1b' },
  martell:   { bg: 'radial-gradient(50% 176%, #5a2a00 80%, #3a1a00 100%)', accent: '#ff8c00', badge: '#c45e1a' },
  tully:     { bg: 'radial-gradient(50% 176%, #1a3a5a 80%, #0a1a3a 100%)', accent: '#4fc3f7', badge: '#1a6b8a' },
  greyjoy:   { bg: 'radial-gradient(50% 176%, #2a2a3a 80%, #0a0a1a 100%)', accent: '#b0bec5', badge: '#455a64' },
  arryn:     { bg: 'radial-gradient(50% 176%, #1a3a5a 80%, #0a2a4a 100%)', accent: '#90caf9', badge: '#1565c0' },
  default:   { bg: 'radial-gradient(50% 176%, #253854 80%, #061922 100%)', accent: '#ffffff', badge: '#424952' },
};

export function getFavoriteKey(quote) {
  return `${quote.character.name}::${quote.sentence}`;
}

export function buildTwitterUrl(quote) {
  const housePart = quote.character.house ? ` (House ${quote.character.house.name})` : '';
  const text = encodeURIComponent(`"${quote.sentence}" — ${quote.character.name}${housePart} #GameOfThrones`);
  return `https://twitter.com/intent/tweet?text=${text}`;
}

// Character filter: GET /v1/author/[slug]/1  → returns array of 1 quote, take [0]
// House filter: GET /v1/house/[slug]          → returns house object with members + their quotes;
//               pick a random quote from all member quotes client-side
// Random: GET /v1/random                      → returns a single quote object
export function buildFetchUrl(houseSlug, charSlug) {
  if (charSlug) return `${API_BASE}/author/${charSlug}/1`;
  return `${API_BASE}/random`;
}

// Extract a single random quote from a house API response.
// /v1/house/[slug] returns: { name, slug, members: [{ name, slug, quotes: [{ sentence }] }] }
// We flatten all quotes from all members, then pick one at random.
export function pickRandomQuoteFromHouse(houseData) {
  const allQuotes = [];
  for (const member of houseData.members) {
    for (const sentence of member.quotes) {
      allQuotes.push({
        sentence,
        character: {
          name: member.name,
          slug: member.slug,
          house: { name: houseData.name, slug: houseData.slug },
        },
      });
    }
  }
  if (allQuotes.length === 0) return null;
  return allQuotes[Math.floor(Math.random() * allQuotes.length)];
}

export function applyHouseTheme(slug) {
  const theme = (slug && HOUSE_THEMES[slug]) ? HOUSE_THEMES[slug] : HOUSE_THEMES.default;
  document.documentElement.style.setProperty('--house-bg', theme.bg);
  document.documentElement.style.setProperty('--house-accent', theme.accent);
  document.documentElement.style.setProperty('--house-badge-bg', theme.badge);
}
