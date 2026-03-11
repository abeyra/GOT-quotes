# GOT Quotes

A single-page React app for Game of Thrones fans to browse, filter, and save iconic quotes from their favorite characters.

Live site: [got-quotes.com](https://www.got-quotes.com)

## Features

- **Random quote generator** — pull a random quote from 35+ characters across 14 houses
- **Filter by house or character** — narrow quotes to a specific house (Stark, Lannister, Targaryen, etc.) or individual character
- **Quote history navigation** — step back and forward through previously shown quotes
- **Dynamic house themes** — background and accent colors shift to match the active house
- **Favorites** — save quotes to a personal list, persisted in localStorage
- **Share panel** — share quotes to Twitter or copy to clipboard
- **Sound player** — audio playback component

## Tech Stack

- **React 19** with Vite
- **Local JSON data** — quotes stored in `src/data/quotes.json` (no external API dependency)
- **Deployed on Netlify** (Node 20, `npm run build` → `dist/`)

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```
src/
  App.jsx              # Root component, all state + logic
  constants.js         # House themes, Twitter URL builder, localStorage key helper
  localData.js         # Query helpers over quotes.json
  data/
    quotes.json        # All quotes, characters, and houses
  components/
    Header.jsx
    Hero.jsx
    Filters.jsx        # House / character dropdowns
    QuoteCard.jsx      # Quote display + action buttons
    Actions.jsx
    SharePanel.jsx
    SoundPlayer.jsx
    FavoritesModal.jsx
    Footer.jsx
```
