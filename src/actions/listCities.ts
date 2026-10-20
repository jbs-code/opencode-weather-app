import type { AppState } from "../types/AppState.ts";
import type { Colors } from "../types/Colors.ts";
import type { Readline } from "../types/Readline.ts";
import { info } from "../presentation/output.ts";

export async function listCities(
  state: AppState,
  _rl: Readline,
  colors: Colors
): Promise<AppState> {
  if (state.cities.length === 0) {
    info(colors, "No hay ciudades registradas.");
    return state;
  }

  console.log("\nCiudades guardadas:");
  state.cities.forEach((city, index) => {
    const marker = city.id === state.settings.defaultCityId ? colors.dim(" (default)") : "";
    console.log(`  ${index + 1}. ${colors.bold(city.name)} - ${city.country}${marker}`);
  });
  console.log("");
  return state;
}
