import type { AppState } from "../types/AppState.ts";
import type { Colors } from "../types/Colors.ts";
import type { Readline } from "../types/Readline.ts";
import { fetchWeather } from "../api/weather.ts";
import { info } from "../presentation/output.ts";
import { formatWeather, unitSymbol } from "../utils/format.ts";

export async function getAllCitiesWeather(
  state: AppState,
  _rl: Readline,
  colors: Colors
): Promise<AppState> {
  if (state.cities.length === 0) {
    info(colors, "No hay ciudades registradas.");
    return state;
  }

  const symbol = unitSymbol(state.settings.unit);
  for (const city of state.cities) {
    try {
      const weather = await fetchWeather(city.latitude, city.longitude, state.settings.unit);
      const marker = city.id === state.settings.defaultCityId ? colors.dim(" (default)") : "";
      console.log(`${colors.bold(city.name)}${marker}: ${formatWeather(colors, weather, symbol)}`);
    } catch {
      console.log(`${colors.bold(city.name)}: ${colors.red("error obteniendo clima")}`);
    }
  }
  console.log("");
  return state;
}
