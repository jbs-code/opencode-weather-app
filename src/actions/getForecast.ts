import type { AppState } from "../types/AppState.ts";
import type { Colors } from "../types/Colors.ts";
import type { Readline } from "../types/Readline.ts";
import { fetchForecast } from "../api/weather.ts";
import { selectCity } from "../presentation/input.ts";
import { error, loading, warn } from "../presentation/output.ts";
import { formatForecast, unitSymbol } from "../utils/format.ts";

export async function getForecast(
  state: AppState,
  rl: Readline,
  colors: Colors
): Promise<AppState> {
  if (state.cities.length === 0) {
    error(colors, "No hay ciudades registradas.");
    return state;
  }

  const selection = await selectCity(rl, state.cities, colors, {
    defaultCityId: state.settings.defaultCityId,
  });
  if (selection.kind === "invalid") {
    error(colors, "Número inválido.");
    return state;
  }
  if (selection.kind === "cancelled") {
    warn(colors, "Operación cancelada.");
    return state;
  }

  const city = selection.city;
  loading(colors, "  Obteniendo pronóstico...");
  try {
    const days = await fetchForecast(city.latitude, city.longitude, state.settings.unit);
    console.log(`\nPronóstico para ${colors.bold(city.name)} (${days.length} días)\n`);
    console.log(formatForecast(colors, days, unitSymbol(state.settings.unit)));
    console.log("");
  } catch (err) {
    error(colors, `Error obteniendo el pronóstico de ${city.name}: ${err instanceof Error ? err.message : String(err)}`);
  }
  return state;
}
