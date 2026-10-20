import type { AppState } from "../types/AppState.ts";
import type { Colors } from "../types/Colors.ts";
import type { Readline } from "../types/Readline.ts";
import { selectCity } from "../presentation/input.ts";
import { error, info, success, warn } from "../presentation/output.ts";
import { saveSettings } from "../storage/settingsStorage.ts";

export async function setDefaultCity(
  state: AppState,
  rl: Readline,
  colors: Colors
): Promise<AppState> {
  if (state.cities.length === 0) {
    info(colors, "No hay ciudades registradas.");
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
  const settings = { ...state.settings, defaultCityId: city.id };
  saveSettings(settings);
  success(colors, `Ciudad default establecida: ${city.name}.`);
  return { ...state, settings };
}
