const STORAGE_KEY = "cafe-radar-favorites";

export function getFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function toggleFavorite(cafeId: string): Set<string> {
  const favorites = getFavorites();
  if (favorites.has(cafeId)) {
    favorites.delete(cafeId);
  } else {
    favorites.add(cafeId);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
  return favorites;
}
