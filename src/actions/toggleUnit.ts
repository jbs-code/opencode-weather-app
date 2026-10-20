import type { AppState } from "../types/AppState.ts";
import type { Colors } from "../types/Colors.ts";
import type { Readline } from "../types/Readline.ts";
import type { TemperatureUnit } from "../types/Settings.ts";
import { success } from "../presentation/output.ts";
import { saveSettings } from "../storage/settingsStorage.ts";
import { unitSymbol } from "../utils/format.ts";

export async function toggleUnit(
  state: AppState,
  _rl: Readline,
  colors: Colors
): Promise<AppState> {
  const unit: TemperatureUnit = state.settings.unit === "celsius" ? "fahrenheit" : "celsius";
  const settings = { ...state.settings, unit };

  saveSettings(settings);
  success(colors, `Unidad cambiada a ${unitSymbol(unit)}.`);
  return { ...state, settings };
}
