import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  getFavoriteKey,
  buildTwitterUrl,
  applyHouseTheme,
} from './constants.js';
import {
  getHouses,
  getCharacters,
  getRandomQuote,
  getRandomQuoteByChar,
  getRandomQuoteByHouse,
  searchQuotes,
  getAvailableCount,
} from './localData.js';

import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Filters from './components/Filters.jsx';
import QuoteCard from './components/QuoteCard.jsx';
import SoundPlayer from './components/SoundPlayer.jsx';
import FavoritesModal from './components/FavoritesModal.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  // --- State ---
  const [currentQuote, setCurrentQuote] = useState(null);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('got-favorites');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [houseSlug, setHouseSlug] = useState(null);
  const [charSlug, setCharSlug] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFading, setIsFading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [houses, setHouses] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [copyLabel, setCopyLabel] = useState('Copy to Clipboard');

  // --- Refs ---
  const historyRef = useRef([]);
  const isLoadingRef = useRef(false);
  const initializedRef = useRef(false); // prevents filter effect from running on mount

  // --- Derived values ---
  const isFavorite = currentQuote
    ? favorites.some((f) => getFavoriteKey(f) === getFavoriteKey(currentQuote))
    : false;
  const twitterUrl = currentQuote ? buildTwitterUrl(currentQuote) : '#';
  const availableCount = useMemo(
    () => getAvailableCount(houseSlug, charSlug, searchTerm),
    [houseSlug, charSlug, searchTerm]
  );
  // Can go next if there's forward history, or if the pool has more than one quote
  const canGoNext = historyIndex < historyRef.current.length - 1 || availableCount > 1;

  // --- Effects ---

  // Mount: load dropdowns + first quote
  useEffect(() => {
    setHouses(getHouses());
    setCharacters(getCharacters());
    fetchQuote(null, null, '');
    initializedRef.current = true;
  }, []); // fetchQuote is a plain function in component scope; no stale closure risk

  // Filter/search change: reset history and fetch a new quote
  useEffect(() => {
    if (!initializedRef.current) return;
    historyRef.current = [];
    setHistoryIndex(-1);
    fetchQuote(houseSlug, charSlug, searchTerm);
  }, [houseSlug, charSlug, searchTerm]); // fetchQuote reads only its own params; no stale closure risk

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem('got-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Apply house theme whenever the displayed quote changes
  useEffect(() => {
    applyHouseTheme(currentQuote?.character?.house?.slug ?? null);
  }, [currentQuote]);

  // --- Private helpers (plain functions — no stale closure risk, no useCallback needed) ---

  // Fetches a new quote for the active filter, skipping already-seen sentences where possible.
  function fetchQuote(house, char, term, exclude = new Set()) {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    setIsFading(true);

    try {
      let quote;
      if (term)  quote = searchQuotes(term, exclude);
      else if (house) quote = getRandomQuoteByHouse(house, exclude);
      else if (char)  quote = getRandomQuoteByChar(char, exclude);
      else            quote = getRandomQuote(exclude);

      if (!quote) throw new Error('No quotes found for the active filter.');

      setTimeout(() => {
        historyRef.current.push(quote);
        setHistoryIndex(historyRef.current.length - 1);
        setCurrentQuote(quote);
        setIsFading(false);
      }, 300);
    } catch (err) {
      console.error('Error fetching quote:', err);
      setIsFading(false);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }

  // Transitions to a quote already in history with a fade animation.
  function showWithFade(quote, index) {
    setIsFading(true);
    setTimeout(() => {
      setCurrentQuote(quote);
      setHistoryIndex(index);
      setIsFading(false);
    }, 300);
  }

  // Returns a Set of all sentences already shown in history, used to avoid repeats.
  function getSeenSentences() {
    return new Set(historyRef.current.map((q) => q.sentence));
  }

  // --- Callbacks ---

  const handleGetNewQuote = useCallback(() => {
    fetchQuote(houseSlug, charSlug, searchTerm, getSeenSentences());
  }, [houseSlug, charSlug, searchTerm]); // fetchQuote reads only its own params; no stale closure risk

  const navigatePrev = useCallback(() => {
    const newIndex = historyIndex - 1;
    if (newIndex >= 0) showWithFade(historyRef.current[newIndex], newIndex);
  }, [historyIndex]);

  const navigateNext = useCallback(() => {
    const newIndex = historyIndex + 1;
    if (newIndex < historyRef.current.length) {
      showWithFade(historyRef.current[newIndex], newIndex);
    } else {
      fetchQuote(houseSlug, charSlug, searchTerm, getSeenSentences());
    }
  }, [historyIndex, houseSlug, charSlug, searchTerm]); // fetchQuote reads only its own params; no stale closure risk

  const onHouseChange = useCallback((slug) => {
    setHouseSlug(slug);
    setCharSlug(null);
    setSearchTerm('');
  }, []);

  const onCharChange = useCallback((slug) => {
    setCharSlug(slug);
    setHouseSlug(null);
    setSearchTerm('');
  }, []);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setHouseSlug(null);
    setCharSlug(null);
  }, []);

  const toggleFavorite = useCallback(() => {
    if (!currentQuote) return;
    const key = getFavoriteKey(currentQuote);
    setFavorites((prev) => {
      const exists = prev.findIndex((f) => getFavoriteKey(f) === key) !== -1;
      if (!exists) return [...prev, { ...currentQuote, savedAt: Date.now() }];
      return prev.filter((f) => getFavoriteKey(f) !== key);
    });
  }, [currentQuote]);

  const toggleShare = useCallback(() => setShareOpen((prev) => !prev), []);

  // Keyboard navigation — placed after callbacks to avoid temporal dead zone errors
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (modalOpen || isLoadingRef.current) return;
      switch (e.key) {
        case 'ArrowLeft':  navigatePrev();    break;
        case 'ArrowRight': navigateNext();    break;
        case 'f': case 'F': toggleFavorite(); break;
        case 's': case 'S': toggleShare();    break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, navigatePrev, navigateNext, toggleFavorite, toggleShare]);

  const copyToClipboard = useCallback(() => {
    if (!currentQuote) return;
    // House names in data already include "House" prefix (e.g. "House Stark of Winterfell")
    const housePart = currentQuote.character.house
      ? `, ${currentQuote.character.house.name}`
      : '';
    const text = `"${currentQuote.sentence}" — ${currentQuote.character.name}${housePart}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy to Clipboard'), 2000);
    });
  }, [currentQuote]);

  const removeFavorite = useCallback((key) => {
    setFavorites((prev) => prev.filter((f) => getFavoriteKey(f) !== key));
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);
  const openModal  = useCallback(() => setModalOpen(true),  []);

  // --- Render ---
  return (
    <>
      <Header onOpenModal={openModal} />

      <Hero isLoading={isLoading}>
        <Filters
          houses={houses}
          characters={characters}
          houseSlug={houseSlug}
          charSlug={charSlug}
          searchTerm={searchTerm}
          onHouseChange={onHouseChange}
          onCharChange={onCharChange}
          onSearch={handleSearch}
        />
        <QuoteCard
          quote={currentQuote}
          isFading={isFading}
          isFavorite={isFavorite}
          shareOpen={shareOpen}
          historyIndex={historyIndex}
          canGoNext={canGoNext}
          twitterUrl={twitterUrl}
          copyLabel={copyLabel}
          onGetNewQuote={handleGetNewQuote}
          onPrev={navigatePrev}
          onNext={navigateNext}
          onToggleFavorite={toggleFavorite}
          onToggleShare={toggleShare}
          onCopyToClipboard={copyToClipboard}
        />
        <SoundPlayer />
      </Hero>

      <Footer />

      <FavoritesModal
        isOpen={modalOpen}
        favorites={favorites}
        onClose={closeModal}
        onRemove={removeFavorite}
      />
    </>
  );
}
