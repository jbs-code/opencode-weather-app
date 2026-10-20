import type { CurrentWeather } from "../types";
import { FORECAST_URL, WEATHER_CODES } from "../constants";

interface WeatherResponse {
  current?: {
    temperature_2m: number;
    weather_code?: number;
  };
}

export async function fetchWeather(
  lat: number,
  lon: number,
  unit: "celsius" | "fahrenheit"
): Promise<CurrentWeather> {
  const tempUnit = unit === "celsius" ? "celsius" : "fahrenheit";
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&temperature_unit=${tempUnit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al consultar el clima`);
  const data = (await res.json()) as WeatherResponse;
  const current = data.current;
  if (!current) throw new Error("No hay datos de clima disponibles");

  const desc = WEATHER_CODES[current.weather_code ?? 0] ?? "Desconocido";
  return { temperature: current.temperature_2m, description: desc };
}
