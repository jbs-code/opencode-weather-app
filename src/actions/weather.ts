import type { WeatherState, Readline } from "../types";
import type { Colors } from "../ui/colors";
import { fetchForecast, fetchWeather } from "../api/weather";
import { formatForecast, formatWeather, unitSymbol } from "../ui/format";
import { selectCity } from "../ui/select";

function getCityById(state: WeatherState, id: string) {
  return state.cities.find((c) => c.id === id);
}

export async function showDefaultWeather(
  state: WeatherState,
  _rl: Readline,
  colors: Colors
): Promise<WeatherState> {
  const city = state.defaultCityId ? getCityById(state, state.defaultCityId) : undefined;
  if (!city) {
    console.log(colors.red("No hay una ciudad default configurada. Usa la opción 5 para establecer una.\n"));
    return state;
  }
  try {
    const weather = await fetchWeather(city.latitude, city.longitude, state.unit);
    console.log(`\nClima en ${colors.bold(city.name)}: ${formatWeather(colors, weather, unitSymbol(state.unit))}\n`);
  } catch (err) {
    console.log(
      colors.red(`Error obteniendo el clima de ${city.name}: ${err instanceof Error ? err.message : String(err)}\n`)
    );
  }
  return state;
}

export async function showAllWeather(
  state: WeatherState,
  _rl: Readline,
  colors: Colors
): Promise<WeatherState> {
  if (state.cities.length === 0) {
    console.log("No hay ciudades registradas.\n");
    return state;
  }
  for (const city of state.cities) {
    try {
      const weather = await fetchWeather(city.latitude, city.longitude, state.unit);
      const marker = city.id === state.defaultCityId ? colors.dim(" (default)") : "";
      console.log(`${colors.bold(city.name)}${marker}: ${formatWeather(colors, weather, unitSymbol(state.unit))}`);
    } catch {
      console.log(`${colors.bold(city.name)}: ${colors.red("error obteniendo clima")}`);
    }
  }
  console.log("");
  return state;
}

export async function showForecast(
  state: WeatherState,
  rl: Readline,
  colors: Colors
): Promise<WeatherState> {
  if (state.cities.length === 0) {
    console.log(colors.red("No hay ciudades registradas.\n"));
    return state;
  }

  const selection = await selectCity(rl, state.cities, colors, { defaultCityId: state.defaultCityId });
  if (selection.kind === "invalid") {
    console.log(colors.red("Número inválido.\n"));
    return state;
  }
  if (selection.kind === "cancelled") {
    console.log(colors.yellow("Operación cancelada.\n"));
    return state;
  }

  const city = selection.city;
  console.log("  Obteniendo pronóstico...");
  try {
    const days = await fetchForecast(city.latitude, city.longitude, state.unit);
    console.log(`\nPronóstico para ${colors.bold(city.name)} (${days.length} días)\n`);
    console.log(formatForecast(colors, days, unitSymbol(state.unit)));
    console.log("");
  } catch (err) {
    console.log(
      colors.red(`Error obteniendo el pronóstico de ${city.name}: ${err instanceof Error ? err.message : String(err)}\n`)
    );
  }
  return state;
}
