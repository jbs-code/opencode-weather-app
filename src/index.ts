import type { AppState } from "./types/AppState.ts";
import type { MenuAction } from "./types/MenuOption.ts";
import { getDefaultCityWeather } from "./actions/getWeather.ts";
import { getAllCitiesWeather } from "./actions/getAllCitiesWeather.ts";
import { getForecast } from "./actions/getForecast.ts";
import { addCity } from "./actions/addCity.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { listCities } from "./actions/listCities.ts";
import { toggleUnit } from "./actions/toggleUnit.ts";
import { buildMenuOptions, EXIT_OPTION, renderMenu } from "./presentation/menu.ts";
import { ask, closeInput, createInput } from "./presentation/input.ts";
import { error, success } from "./presentation/output.ts";
import { loadCities } from "./storage/citiesStorage.ts";
import { loadSettings } from "./storage/settingsStorage.ts";
import { migrateLegacyState } from "./storage/migrate.ts";
import { createColors } from "./utils/colors.ts";

const ACTIONS: Record<string, MenuAction> = {
  "1": getDefaultCityWeather,
  "2": getAllCitiesWeather,
  "3": addCity,
  "4": removeCity,
  "5": setDefaultCity,
  "6": getForecast,
  "7": listCities,
  "8": toggleUnit,
};

function loadState(): AppState {
  return { cities: loadCities(), settings: loadSettings() };
}

async function main(): Promise<void> {
  migrateLegacyState();

  const colors = createColors();
  const rl = createInput();
  let state = loadState();

  try {
    while (true) {
      renderMenu(colors, buildMenuOptions(state));
      const option = (await ask(rl, "  Selecciona una opción: ")).trim();

      if (option === EXIT_OPTION) {
        success(colors, "¡Hasta luego!");
        return;
      }

      const action = ACTIONS[option];
      if (!action) {
        error(colors, "Opción no válida. Intenta de nuevo.");
        continue;
      }

      state = await action(state, rl, colors);
    }
  } finally {
    closeInput(rl);
  }
}

main().catch((err) => {
  console.error("Error inesperado:", err);
  process.exit(1);
});
