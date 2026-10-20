import type { AppState } from "../types/AppState.ts";
import type { Colors } from "../types/Colors.ts";
import type { Readline } from "../types/Readline.ts";
import { fetchWeather } from "../api/weather.ts";
import { error } from "../presentation/output.ts";
import { findCityById } from "../utils/cities.ts";
import { formatWeather, unitSymbol } from "../utils/format.ts";

export async function getDefaultCityWeather(
  state: AppState,
  _rl: Readline,
  colors: Colors
): Promise<AppState> {
  const city = findCityById(state.cities, state.settings.defaultCityId);
  if (!city) {
    error(colors, "No hay una ciudad default configurada. Usa la opción 5 para establecer una.");
    return state;
  }

  try {
    const weather = await fetchWeather(city.latitude, city.longitude, state.settings.unit);
    const symbol = unitSymbol(state.settings.unit);
    console.log(`\nClima en ${colors.bold(city.name)}: ${formatWeather(colors, weather, symbol)}\n`);
  } catch (err) {
    error(colors, `Error obteniendo el clima de ${city.name}: ${err instanceof Error ? err.message : String(err)}`);
  }
  return state;
}
