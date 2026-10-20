import { describe, expectTypeOf, test } from "bun:test";
import type { AppState } from "../../src/types/AppState.ts";
import type { City, CitySelection } from "../../src/types/City.ts";
import type { Colors } from "../../src/types/Colors.ts";
import type { MenuOption } from "../../src/types/MenuOption.ts";
import type { Settings, TemperatureUnit } from "../../src/types/Settings.ts";
import type { CurrentWeather, DailyForecast } from "../../src/types/Weather.ts";

describe("contratos de tipos", () => {
  test("City exige id, nombre, coordenadas y país", () => {
    expectTypeOf<City["id"]>().toBeString();
    expectTypeOf<City["name"]>().toBeString();
    expectTypeOf<City["latitude"]>().toBeNumber();
    expectTypeOf<City["longitude"]>().toBeNumber();
    expectTypeOf<City["country"]>().toBeString();
  });

  test("Settings solo admite celsius y fahrenheit", () => {
    expectTypeOf<TemperatureUnit>().toEqualTypeOf<"celsius" | "fahrenheit">();
    expectTypeOf<Settings["defaultCityId"]>().toEqualTypeOf<string | null>();
  });

  test("CitySelection es una unión de tres casos", () => {
    expectTypeOf<CitySelection["kind"]>().toEqualTypeOf<"selected" | "invalid" | "cancelled">();
  });

  test("AppState agrupa ciudades y configuración", () => {
    expectTypeOf<AppState["cities"]>().toEqualTypeOf<City[]>();
    expectTypeOf<AppState["settings"]>().toEqualTypeOf<Settings>();
  });

  test("Colors expone las funciones de pintado", () => {
    expectTypeOf<Colors["red"]>().toBeFunction();
    expectTypeOf<Colors["green"]>().toBeFunction();
    expectTypeOf<Colors["yellow"]>().toBeFunction();
    expectTypeOf<Colors["cyan"]>().toBeFunction();
    expectTypeOf<Colors["bold"]>().toBeFunction();
    expectTypeOf<Colors["dim"]>().toBeFunction();
  });

  test("MenuOption tiene key y label", () => {
    expectTypeOf<MenuOption["key"]>().toBeString();
    expectTypeOf<MenuOption["label"]>().toBeString();
  });

  test("Los datos de clima exponen los valores esperados", () => {
    expectTypeOf<CurrentWeather["temperature"]>().toBeNumber();
    expectTypeOf<CurrentWeather["description"]>().toBeString();
    expectTypeOf<DailyForecast["temperatureMax"]>().toEqualTypeOf<number | null>();
    expectTypeOf<DailyForecast["precipitationProbability"]>().toEqualTypeOf<number | null>();
  });
});
