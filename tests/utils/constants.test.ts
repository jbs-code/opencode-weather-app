import { describe, expect, test } from "bun:test";
import {
  CITIES_FILE_NAME,
  FORECAST_URL,
  GEOCODING_URL,
  LEGACY_STATE_FILE_NAME,
  SETTINGS_FILE_NAME,
  STATE_DIR_NAME,
} from "../../src/utils/constants.ts";

describe("constants", () => {
  test("expone las URLs de la API", () => {
    expect(GEOCODING_URL).toBe("https://geocoding-api.open-meteo.com/v1/search");
    expect(FORECAST_URL).toBe("https://api.open-meteo.com/v1/forecast");
  });

  test("expone los nombres de archivo de persistencia", () => {
    expect(STATE_DIR_NAME).toBe(".weather-cli");
    expect(CITIES_FILE_NAME).toBe("cities.json");
    expect(SETTINGS_FILE_NAME).toBe("settings.json");
    expect(LEGACY_STATE_FILE_NAME).toBe("state.json");
  });
});
