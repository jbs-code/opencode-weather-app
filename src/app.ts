import * as readline from "node:readline/promises";
import type { WeatherState, Readline } from "./types";
import type { Colors } from "./ui/colors";
import { loadState } from "./storage";
import { renderMenu } from "./ui/menu";
import { createColors } from "./ui/colors";
import { ask } from "./ui/prompt";
import { showDefaultWeather, showAllWeather, showForecast } from "./actions/weather";
import { addCity, removeCity, setDefaultCity } from "./actions/cities";
import { toggleUnit } from "./actions/settings";

interface Action {
  label: (state: WeatherState, colors: Colors) => string;
  run: (state: WeatherState, rl: Readline, colors: Colors) => Promise<WeatherState>;
}

const ACTIONS: Record<string, Action> = {
  "1": {
    label: () => "Clima de ciudad default",
    run: showDefaultWeather,
  },
  "2": {
    label: (state) => `Clima de todas las ciudades (${state.cities.length})`,
    run: showAllWeather,
  },
  "3": {
    label: () => "Buscar y agregar ciudad",
    run: addCity,
  },
  "4": {
    label: () => "Eliminar ciudad",
    run: removeCity,
  },
  "5": {
    label: () => "Establecer ciudad default",
    run: setDefaultCity,
  },
  "6": {
    label: () => "Pronóstico 7 días",
    run: showForecast,
  },
  "8": {
    label: (state) => `Ajustes (${state.unit === "celsius" ? "°C" : "°F"})`,
    run: toggleUnit,
  },
};

export async function run(): Promise<void> {
  const colors = createColors();
  let state = loadState();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    while (true) {
      const entries = Object.entries(ACTIONS).map(([key, action]) => ({
        key,
        label: action.label(state, colors),
      }));
      renderMenu(colors, entries);
      const option = (await ask(rl, "  Selecciona una opción: ")).trim();

      if (option === "9") {
        console.log(colors.green("¡Hasta luego!\n"));
        return;
      }

      const action = ACTIONS[option];
      if (!action) {
        console.log(colors.red("Opción no válida. Intenta de nuevo.\n"));
        continue;
      }

      state = await action.run(state, rl, colors);
    }
  } finally {
    rl.close();
  }
}
