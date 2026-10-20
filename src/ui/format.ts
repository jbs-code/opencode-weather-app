import type { CurrentWeather } from "../types";
import type { Colors } from "./colors";

export function formatWeather(colors: Colors, weather: CurrentWeather, symbol: string): string {
  return `${weather.description}, ${colors.yellow(weather.temperature.toFixed(1) + symbol)}`;
}
