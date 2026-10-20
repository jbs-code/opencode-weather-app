import type { AppState } from "../../src/types/AppState.ts";
import type { City } from "../../src/types/City.ts";
import type { Colors } from "../../src/types/Colors.ts";
import type { Readline } from "../../src/types/Readline.ts";
import type { Settings } from "../../src/types/Settings.ts";
import { createColors } from "../../src/utils/colors.ts";

export function makeCity(overrides: Partial<City> = {}): City {
  return {
    id: "city-1",
    name: "Ottawa",
    latitude: 45.41117,
    longitude: -75.69812,
    country: "CA",
    ...overrides,
  };
}

export function makeSettings(overrides: Partial<Settings> = {}): Settings {
  return { defaultCityId: null, unit: "celsius", ...overrides };
}

export function makeState(overrides: Partial<AppState> = {}): AppState {
  return { cities: [], settings: makeSettings(), ...overrides };
}

export function makeColors(): Colors {
  return createColors(false);
}

export function fakeReadline(answers: string[] = []): Readline {
  const queue = [...answers];
  const rl = {
    question: async (_query: string) => queue.shift() ?? "",
    close: () => {},
  };
  return rl as unknown as Readline;
}
