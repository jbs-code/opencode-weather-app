import * as fs from "node:fs";
import type { Settings, TemperatureUnit } from "../types/Settings.ts";
import { getSettingsPath, getStateDir } from "./paths.ts";

export function loadSettings(): Settings {
  try {
    const parsed = JSON.parse(fs.readFileSync(getSettingsPath(), "utf-8")) as Partial<Settings>;
    return {
      defaultCityId: typeof parsed.defaultCityId === "string" ? parsed.defaultCityId : null,
      unit: parseUnit(parsed.unit),
    };
  } catch {
    return { defaultCityId: null, unit: "celsius" };
  }
}

export function saveSettings(settings: Settings): void {
  fs.mkdirSync(getStateDir(), { recursive: true });
  fs.writeFileSync(getSettingsPath(), JSON.stringify(settings, null, 2));
}

export function parseUnit(value: unknown): TemperatureUnit {
  return value === "fahrenheit" ? "fahrenheit" : "celsius";
}
