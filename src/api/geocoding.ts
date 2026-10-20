import type { City } from "../types";
import { GEOCODING_URL } from "../constants";

interface GeocodingResult {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country_code: string;
    country?: string;
  }>;
}

export async function geocodeCity(name: string): Promise<City | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = (await res.json()) as GeocodingResult;
  const result = data.results?.[0];
  if (!result) return null;
  return {
    id: crypto.randomUUID(),
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    country: result.country ?? result.country_code,
  };
}
