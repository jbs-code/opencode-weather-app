import * as fs from "node:fs";
import type { City } from "../types/City.ts";
import { getCitiesPath, getLegacyStatePath, getSettingsPath } from "./paths.ts";
import { saveCities } from "./citiesStorage.ts";
import { parseUnit, saveSettings } from "./settingsStorage.ts";

interface LegacyState {
  cities?: City[];
  defaultCityId?: string | null;
  unit?: string;
}

// Migra el antiguo state.json único a cities.json + settings.json.
export function migrateLegacyState(): void {
  const legacyPath = getLegacyStatePath();
  if (!fs.existsSync(legacyPath)) return;
  if (fs.existsSync(getCitiesPath()) || fs.existsSync(getSettingsPath())) return;

  try {
    const legacy = JSON.parse(fs.readFileSync(legacyPath, "utf-8")) as LegacyState;
    saveCities(Array.isArray(legacy.cities) ? legacy.cities : []);
    saveSettings({
      defaultCityId: legacy.defaultCityId ?? null,
      unit: parseUnit(legacy.unit),
    });
    fs.renameSync(legacyPath, `${legacyPath}.bak`);
  } catch {
    // Si la migración falla se conserva el archivo original intacto
  }
}
