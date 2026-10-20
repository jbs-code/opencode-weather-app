import type { AppState } from "../types/AppState.ts";
import type { Colors } from "../types/Colors.ts";
import type { Readline } from "../types/Readline.ts";
import { geocodeCity } from "../api/geocoding.ts";
import { ask } from "../presentation/input.ts";
import { error, loading, success, warn } from "../presentation/output.ts";
import { saveCities } from "../storage/citiesStorage.ts";
import { isSameCity } from "../utils/cities.ts";

export async function addCity(
  state: AppState,
  rl: Readline,
  colors: Colors
): Promise<AppState> {
  const name = (await ask(rl, "  Nombre de la ciudad: ")).trim();
  if (!name) {
    error(colors, "Nombre inválido.");
    return state;
  }

  loading(colors, "  Buscando coordenadas...");
  const city = await geocodeCity(name);
  if (!city) {
    error(colors, `No se encontró la ciudad "${name}".`);
    return state;
  }
  if (state.cities.some((saved) => isSameCity(saved, city))) {
    warn(colors, "La ciudad ya está registrada.");
    return state;
  }

  const cities = [...state.cities, city];
  saveCities(cities);
  success(colors, `Ciudad "${city.name}" agregada.`);
  return { ...state, cities };
}
