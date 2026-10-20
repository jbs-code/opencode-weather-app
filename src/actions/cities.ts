import type { WeatherState, Readline } from "../types";
import type { Colors } from "../ui/colors";
import { ask } from "../ui/prompt";
import { geocodeCity } from "../api/geocoding";
import { saveState } from "../storage";

export async function addCity(state: WeatherState, rl: Readline, colors: Colors): Promise<WeatherState> {
  const name = await ask(rl, "  Nombre de la ciudad: ");
  if (!name.trim()) {
    console.log(colors.red("Nombre inválido.\n"));
    return state;
  }
  console.log("  Buscando coordenadas...");
  const city = await geocodeCity(name.trim());
  if (!city) {
    console.log(colors.red(`No se encontró la ciudad "${name.trim()}".\n`));
    return state;
  }
  const exists = state.cities.some(
    (c) => c.name.toLowerCase() === city.name.toLowerCase() && c.latitude === city.latitude && c.longitude === city.longitude
  );
  if (exists) {
    console.log(colors.yellow("La ciudad ya está registrada.\n"));
    return state;
  }
  const newState = { ...state, cities: [...state.cities, city] };
  saveState(newState);
  console.log(colors.green(`Ciudad "${city.name}" agregada.\n`));
  return newState;
}

export async function removeCity(state: WeatherState, rl: Readline, colors: Colors): Promise<WeatherState> {
  if (state.cities.length === 0) {
    console.log("No hay ciudades para eliminar.\n");
    return state;
  }
  console.log("\nCiudades registradas:");
  state.cities.forEach((c, i) => {
    const marker = c.id === state.defaultCityId ? " (default)" : "";
    console.log(`  ${i + 1}. ${c.name}${marker}`);
  });
  const answer = await ask(rl, "  Número de ciudad a eliminar: ");
  const index = parseInt(answer, 10) - 1;
  if (Number.isNaN(index) || index < 0 || index >= state.cities.length) {
    console.log(colors.red("Número inválido.\n"));
    return state;
  }
  const removed = state.cities[index]!;
  const newDefault = state.defaultCityId === removed.id ? null : state.defaultCityId;
  const newState = { ...state, cities: state.cities.filter((_, i) => i !== index), defaultCityId: newDefault };
  saveState(newState);
  console.log(colors.green(`Ciudad "${removed.name}" eliminada.\n`));
  return newState;
}

export async function setDefaultCity(state: WeatherState, rl: Readline, colors: Colors): Promise<WeatherState> {
  if (state.cities.length === 0) {
    console.log("No hay ciudades registradas.\n");
    return state;
  }
  console.log("\nCiudades registradas:");
  state.cities.forEach((c, i) => {
    const marker = c.id === state.defaultCityId ? " (actual)" : "";
    console.log(`  ${i + 1}. ${c.name}${marker}`);
  });
  const answer = await ask(rl, "  Número de ciudad para default: ");
  const index = parseInt(answer, 10) - 1;
  if (Number.isNaN(index) || index < 0 || index >= state.cities.length) {
    console.log(colors.red("Número inválido.\n"));
    return state;
  }
  const city = state.cities[index]!;
  const cityName = city.name;
  const newState: WeatherState = { ...state, defaultCityId: city.id };
  saveState(newState);
  console.log(colors.green(`Ciudad default establecida: ${cityName}.\n`));
  return newState;
}
