import * as fs from "node:fs";
import type { City } from "../types/City.ts";
import { getCitiesPath, getStateDir } from "./paths.ts";

export function loadCities(): City[] {
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(getCitiesPath(), "utf-8"));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCity);
  } catch {
    return [];
  }
}

export function saveCities(cities: City[]): void {
  fs.mkdirSync(getStateDir(), { recursive: true });
  fs.writeFileSync(getCitiesPath(), JSON.stringify(cities, null, 2));
}

function isCity(value: unknown): value is City {
  if (typeof value !== "object" || value === null) return false;
  const city = value as Partial<City>;
  return (
    typeof city.id === "string" &&
    typeof city.name === "string" &&
    typeof city.latitude === "number" &&
    typeof city.longitude === "number"
  );
}
