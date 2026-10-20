import type { WeatherState, Readline } from "../types";
import type { Colors } from "../ui/colors";
import { saveState } from "../storage";

export async function toggleUnit(state: WeatherState, _rl: Readline, colors: Colors): Promise<WeatherState> {
  const newState: WeatherState = { ...state, unit: state.unit === "celsius" ? "fahrenheit" : "celsius" };
  saveState(newState);
  const label = newState.unit === "celsius" ? "°C" : "°F";
  console.log(colors.green(`Unidad cambiada a ${label}.\n`));
  return newState;
}
