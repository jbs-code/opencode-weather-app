import type {
  CurrentWeather,
  DailyForecast,
  ForecastApiResponse,
  WeatherApiResponse,
} from "../types/Weather.ts";
import type { TemperatureUnit } from "../types/Settings.ts";
import { FORECAST_URL } from "../utils/constants.ts";
import { describeWeatherCode } from "../utils/weatherCodes.ts";

const DAILY_FIELDS = "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max";
const FORECAST_DAYS = 7;

export async function fetchWeather(
  lat: number,
  lon: number,
  unit: TemperatureUnit
): Promise<CurrentWeather> {
  const tempUnit = unit === "celsius" ? "celsius" : "fahrenheit";
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&temperature_unit=${tempUnit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al consultar el clima`);
  const data = (await res.json()) as WeatherApiResponse;
  const current = data.current;
  if (!current) throw new Error("No hay datos de clima disponibles");

  return {
    temperature: current.temperature_2m,
    description: describeWeatherCode(current.weather_code),
  };
}

export async function fetchForecast(
  lat: number,
  lon: number,
  unit: TemperatureUnit
): Promise<DailyForecast[]> {
  const tempUnit = unit === "celsius" ? "celsius" : "fahrenheit";
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&daily=${DAILY_FIELDS}&forecast_days=${FORECAST_DAYS}&temperature_unit=${tempUnit}&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al consultar el pronóstico`);
  const data = (await res.json()) as ForecastApiResponse;
  const daily = data.daily;
  if (!daily?.time?.length) throw new Error("No hay datos de pronóstico disponibles");

  return daily.time.map((date, index) => ({
    date,
    description: describeWeatherCode(daily.weather_code?.[index]),
    temperatureMax: daily.temperature_2m_max?.[index] ?? null,
    temperatureMin: daily.temperature_2m_min?.[index] ?? null,
    precipitationProbability: daily.precipitation_probability_max?.[index] ?? null,
  }));
}
