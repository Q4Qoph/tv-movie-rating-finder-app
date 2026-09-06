import { WatchlistItem } from "@/interfaces/interfaces";

// Reactive in-memory state with listener callbacks
type Listener = () => void;

let savedWatchlist: WatchlistItem[] = [];
let savedFavorites: WatchlistItem[] = [];
const listeners: Set<Listener> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("Listener error", e);
    }
  });
};

export const subscribeToStorage = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getSavedItems = (): WatchlistItem[] => {
  return [...savedWatchlist];
};

export const isItemSaved = (id: number): boolean => {
  return savedWatchlist.some((item) => item.id === id);
};

export const toggleSavedItem = (
  item: Omit<WatchlistItem, "addedAt">
): boolean => {
  const index = savedWatchlist.findIndex((i) => i.id === item.id);
  let isAdded = false;

  if (index >= 0) {
    savedWatchlist = savedWatchlist.filter((i) => i.id !== item.id);
    isAdded = false;
  } else {
    savedWatchlist = [{ ...item, addedAt: Date.now() }, ...savedWatchlist];
    isAdded = true;
  }

  notifyListeners();
  return isAdded;
};

export const getFavoriteItems = (): WatchlistItem[] => {
  return [...savedFavorites];
};

export const isItemFavorited = (id: number): boolean => {
  return savedFavorites.some((item) => item.id === id);
};

export const toggleFavoriteItem = (
  item: Omit<WatchlistItem, "addedAt">
): boolean => {
  const index = savedFavorites.findIndex((i) => i.id === item.id);
  let isAdded = false;

  if (index >= 0) {
    savedFavorites = savedFavorites.filter((i) => i.id !== item.id);
    isAdded = false;
  } else {
    savedFavorites = [{ ...item, addedAt: Date.now() }, ...savedFavorites];
    isAdded = true;
  }

  notifyListeners();
  return isAdded;
};

export const clearAllSaved = () => {
  savedWatchlist = [];
  notifyListeners();
};

export const clearAllFavorites = () => {
  savedFavorites = [];
  notifyListeners();
};
