export type TemperatureUnit = "celsius" | "fahrenheit";

export interface Settings {
  defaultCityId: string | null;
  unit: TemperatureUnit;
}
