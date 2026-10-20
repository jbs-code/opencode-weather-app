import type { WeatherState, Readline } from "../types";
import type { Colors } from "../ui/colors";
import { ask } from "../ui/prompt";
import { selectCity } from "../ui/select";
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
  const selection = await selectCity(rl, state.cities, colors, { defaultCityId: state.defaultCityId });
  if (selection.kind === "invalid") {
    console.log(colors.red("Número inválido.\n"));
    return state;
  }
  if (selection.kind === "cancelled") {
    console.log(colors.yellow("Operación cancelada.\n"));
    return state;
  }

  const removed = selection.city;
  const newDefault = state.defaultCityId === removed.id ? null : state.defaultCityId;
  const newState = { ...state, cities: state.cities.filter((c) => c.id !== removed.id), defaultCityId: newDefault };
  saveState(newState);
  console.log(colors.green(`Ciudad "${removed.name}" eliminada.\n`));
  return newState;
}

export async function setDefaultCity(state: WeatherState, rl: Readline, colors: Colors): Promise<WeatherState> {
  if (state.cities.length === 0) {
    console.log("No hay ciudades registradas.\n");
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
  const newState: WeatherState = { ...state, defaultCityId: city.id };
  saveState(newState);
  console.log(colors.green(`Ciudad default establecida: ${city.name}.\n`));
  return newState;
}
