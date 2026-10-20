import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { WeatherState } from "./types";

export function getStateDir(): string {
  const override = process.env["WEATHER_HOME"];
  return override ?? path.join(os.homedir(), ".weather-cli");
}

export function getStatePath(): string {
  return path.join(getStateDir(), "state.json");
}

export function loadState(): WeatherState {
  try {
    const text = fs.readFileSync(getStatePath(), "utf-8");
    const parsed = JSON.parse(text);
    return {
      cities: Array.isArray(parsed.cities) ? parsed.cities : [],
      defaultCityId: parsed.defaultCityId ?? null,
      unit: parsed.unit === "fahrenheit" ? "fahrenheit" : "celsius",
    };
  } catch {
    return { cities: [], defaultCityId: null, unit: "celsius" };
  }
}

export function saveState(state: WeatherState): void {
  const dir = getStateDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(getStatePath(), JSON.stringify(state, null, 2));
}
