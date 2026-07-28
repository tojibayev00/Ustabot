/**
 * O'zbekiston hududining taxminiy geografik chegaralari.
 * Worker ro'yxatdan o'tishda latitude/longitude shu chegaradan tashqarida bo'lsa rad etiladi.
 */
export const UZBEKISTAN_BOUNDS = {
  minLatitude: 37.0,
  maxLatitude: 45.6,
  minLongitude: 55.9,
  maxLongitude: 73.2
} as const;

/** Toshkent shahri — default xarita markazi */
export const DEFAULT_MAP_CENTER = {
  latitude: 41.311081,
  longitude: 69.240562
} as const;

export function isWithinUzbekistan(latitude: number, longitude: number): boolean {
  return (
    latitude >= UZBEKISTAN_BOUNDS.minLatitude &&
    latitude <= UZBEKISTAN_BOUNDS.maxLatitude &&
    longitude >= UZBEKISTAN_BOUNDS.minLongitude &&
    longitude <= UZBEKISTAN_BOUNDS.maxLongitude
  );
}
