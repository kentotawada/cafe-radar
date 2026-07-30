const STORAGE_KEY = "cafe-radar-map-provider";

export type MapProvider = "google" | "apple";

export function getMapProvider(): MapProvider | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "google" || raw === "apple" ? raw : null;
  } catch {
    return null;
  }
}

export function setMapProvider(provider: MapProvider) {
  try {
    localStorage.setItem(STORAGE_KEY, provider);
  } catch {
    // ignore write failures (private browsing, storage full, etc.)
  }
}
