import type { WeatherState, Readline } from "../types";
import type { Colors } from "../ui/colors";
import { saveState } from "../storage";
import { unitSymbol } from "../ui/format";

export async function toggleUnit(state: WeatherState, _rl: Readline, colors: Colors): Promise<WeatherState> {
  const newState: WeatherState = { ...state, unit: state.unit === "celsius" ? "fahrenheit" : "celsius" };
  saveState(newState);
  console.log(colors.green(`Unidad cambiada a ${unitSymbol(newState.unit)}.\n`));
  return newState;
}
