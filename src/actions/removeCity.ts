import type { AppState } from "../types/AppState.ts";
import type { Colors } from "../types/Colors.ts";
import type { Readline } from "../types/Readline.ts";
import { selectCity } from "../presentation/input.ts";
import { error, info, success, warn } from "../presentation/output.ts";
import { saveCities } from "../storage/citiesStorage.ts";
import { saveSettings } from "../storage/settingsStorage.ts";

export async function removeCity(
  state: AppState,
  rl: Readline,
  colors: Colors
): Promise<AppState> {
  if (state.cities.length === 0) {
    info(colors, "No hay ciudades para eliminar.");
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

  const removed = selection.city;
  const cities = state.cities.filter((city) => city.id !== removed.id);
  const settings = {
    ...state.settings,
    defaultCityId: state.settings.defaultCityId === removed.id ? null : state.settings.defaultCityId,
  };

  saveCities(cities);
  saveSettings(settings);
  success(colors, `Ciudad "${removed.name}" eliminada.`);
  return { ...state, cities, settings };
}
