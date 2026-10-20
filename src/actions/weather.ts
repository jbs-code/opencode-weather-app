import type { WeatherState, Readline } from "../types";
import type { Colors } from "../ui/colors";
import { fetchWeather } from "../api/weather";
import { formatWeather } from "../ui/format";

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
    const symbol = state.unit === "celsius" ? "°C" : "°F";
    console.log(`\nClima en ${colors.bold(city.name)}: ${formatWeather(colors, weather, symbol)}\n`);
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
      const symbol = state.unit === "celsius" ? "°C" : "°F";
      const marker = city.id === state.defaultCityId ? colors.dim(" (default)") : "";
      console.log(`${colors.bold(city.name)}${marker}: ${formatWeather(colors, weather, symbol)}`);
    } catch {
      console.log(`${colors.bold(city.name)}: ${colors.red("error obteniendo clima")}`);
    }
  }
  console.log("");
  return state;
}
