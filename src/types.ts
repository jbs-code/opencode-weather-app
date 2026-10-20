import type * as readline from "node:readline/promises";

export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface WeatherState {
  cities: City[];
  defaultCityId: string | null;
  unit: "celsius" | "fahrenheit";
}

export interface CurrentWeather {
  temperature: number;
  description: string;
}

export type Readline = ReturnType<typeof readline.createInterface>;
