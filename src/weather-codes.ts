import { WEATHER_CODES } from "./constants";

export function describeWeatherCode(code: number | null | undefined): string {
  return WEATHER_CODES[code ?? 0] ?? "Desconocido";
}
