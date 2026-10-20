import type { City } from "../types/City.ts";

export function findCityById(cities: City[], id: string | null): City | undefined {
  if (!id) return undefined;
  return cities.find((city) => city.id === id);
}

export function isSameCity(first: City, second: City): boolean {
  return (
    first.name.toLowerCase() === second.name.toLowerCase() &&
    first.latitude === second.latitude &&
    first.longitude === second.longitude
  );
}
