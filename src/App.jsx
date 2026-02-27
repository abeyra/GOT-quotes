import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  API_BASE,
  getFavoriteKey,
  buildTwitterUrl,
  buildFetchUrl,
  pickRandomQuoteFromHouse,
  applyHouseTheme,
} from './constants.js';

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

  // --- Effects ---

  // Mount: load dropdowns + first quote
  useEffect(() => {
    async function init() {
      try {
        const [housesRes, charsRes] = await Promise.all([
          axios.get(`${API_BASE}/houses`),
          axios.get(`${API_BASE}/characters`),
        ]);
        setHouses(housesRes.data);
        setCharacters(charsRes.data);
      } catch (err) {
        console.error('Error loading dropdowns:', err);
      }
      await fetchQuote(`${API_BASE}/random`, null);
      initializedRef.current = true;
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter change: reset history, fetch new quote
  useEffect(() => {
    if (!initializedRef.current) return;
    historyRef.current = [];
    setHistoryIndex(-1);
    fetchQuote(buildFetchUrl(houseSlug, charSlug), houseSlug);
  }, [houseSlug, charSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('got-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Apply house theme whenever currentQuote changes
  useEffect(() => {
    const slug = currentQuote?.character?.house?.slug ?? null;
    applyHouseTheme(slug);
  }, [currentQuote]);

  // --- Core fetch function ---
  // Handles three API response shapes:
  //   /v1/random              → single quote object  { sentence, character }
  //   /v1/author/[slug]/1     → array of quote objects [{ sentence, character }]  — take [0]
  //   house filter            → fetched separately via /v1/house/[slug], picked client-side
  async function fetchQuote(url, houseSlugOverride = null) {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    setIsFading(true);

    try {
      let quote;

      if (houseSlugOverride) {
        // House filter: GET /v1/house/[slug] returns house object; pick random quote client-side
        const res = await axios.get(`${API_BASE}/house/${houseSlugOverride}`);
        quote = pickRandomQuoteFromHouse(res.data);
        if (!quote) throw new Error(`No quotes found for house: ${houseSlugOverride}`);
      } else {
        const res = await axios.get(url);
        // /v1/author/[slug]/1 returns an array; /v1/random returns a single object
        quote = Array.isArray(res.data) ? res.data[0] : res.data;
      }

      setTimeout(() => {
        historyRef.current.push(quote);
        setHistoryIndex(historyRef.current.length - 1);
        setCurrentQuote(quote);
        setIsFading(false);
      }, 300);
    } catch (err) {
      console.error('Error fetching the data:', err);
      setIsFading(false);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }

  // --- Callbacks ---

  const handleGetNewQuote = useCallback(() => {
    fetchQuote(buildFetchUrl(houseSlug, charSlug), houseSlug);
  }, [houseSlug, charSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigatePrev = useCallback(() => {
    const newIndex = historyIndex - 1;
    if (newIndex < 0) return;
    const quote = historyRef.current[newIndex];
    setIsFading(true);
    setTimeout(() => {
      setCurrentQuote(quote);
      setHistoryIndex(newIndex);
      setIsFading(false);
    }, 300);
  }, [historyIndex]);

  const navigateNext = useCallback(() => {
    const newIndex = historyIndex + 1;
    if (newIndex < historyRef.current.length) {
      const quote = historyRef.current[newIndex];
      setIsFading(true);
      setTimeout(() => {
        setCurrentQuote(quote);
        setHistoryIndex(newIndex);
        setIsFading(false);
      }, 300);
    } else {
      fetchQuote(buildFetchUrl(houseSlug, charSlug), houseSlug);
    }
  }, [historyIndex, houseSlug, charSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const onHouseChange = useCallback((slug) => {
    setHouseSlug(slug);
    setCharSlug(null);
  }, []);

  const onCharChange = useCallback((slug) => {
    setCharSlug(slug);
    setHouseSlug(null);
  }, []);

  const toggleFavorite = useCallback(() => {
    if (!currentQuote) return;
    const key = getFavoriteKey(currentQuote);
    setFavorites((prev) => {
      const idx = prev.findIndex((f) => getFavoriteKey(f) === key);
      if (idx === -1) return [...prev, currentQuote];
      return prev.filter((_, i) => i !== idx);
    });
  }, [currentQuote]);

  const toggleShare = useCallback(() => {
    setShareOpen((prev) => !prev);
  }, []);

  const copyToClipboard = useCallback(() => {
    if (!currentQuote) return;
    const housePart = currentQuote.character.house
      ? `, House ${currentQuote.character.house.name}`
      : '';
    const text = `"${currentQuote.sentence}" — ${currentQuote.character.name}${housePart}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy to Clipboard'), 2000);
    });
  }, [currentQuote]);

  const removeFavorite = useCallback((index) => {
    setFavorites((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const closeModal = useCallback(() => setModalOpen(false), []);
  const openModal = useCallback(() => setModalOpen(true), []);

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
          onHouseChange={onHouseChange}
          onCharChange={onCharChange}
        />
        <QuoteCard
          quote={currentQuote}
          isFading={isFading}
          isFavorite={isFavorite}
          shareOpen={shareOpen}
          historyIndex={historyIndex}
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
