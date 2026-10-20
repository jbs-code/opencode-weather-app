import { afterEach, beforeEach, describe, expect, spyOn, test, type Mock } from "bun:test";
import { getDefaultCityWeather } from "../../src/actions/getWeather.ts";
import * as weatherApi from "../../src/api/weather.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { fakeReadline, makeCity, makeColors, makeState } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture;
let fetchWeatherSpy: Mock<typeof weatherApi.fetchWeather>;

const colors = makeColors();
const ottawa = makeCity({ id: "ottawa", name: "Ottawa" });

beforeEach(() => {
  consoleCapture = captureConsole();
  fetchWeatherSpy = spyOn(weatherApi, "fetchWeather");
});

afterEach(() => {
  consoleCapture.restore();
  fetchWeatherSpy.mockRestore();
});

describe("getDefaultCityWeather", () => {
  test("muestra el clima de la ciudad default", async () => {
    fetchWeatherSpy.mockResolvedValue({ temperature: 12.34, description: "Nublado" });

    await getDefaultCityWeather(
      makeState({ cities: [ottawa], settings: { defaultCityId: "ottawa", unit: "celsius" } }),
      fakeReadline(),
      colors
    );

    expect(fetchWeatherSpy).toHaveBeenCalledWith(ottawa.latitude, ottawa.longitude, "celsius");
    expect(consoleCapture.text()).toContain("Clima en Ottawa: Nublado, 12.3°C");
  });

  test("usa la unidad configurada", async () => {
    fetchWeatherSpy.mockResolvedValue({ temperature: 54, description: "Nublado" });

    await getDefaultCityWeather(
      makeState({ cities: [ottawa], settings: { defaultCityId: "ottawa", unit: "fahrenheit" } }),
      fakeReadline(),
      colors
    );

    expect(fetchWeatherSpy).toHaveBeenCalledWith(ottawa.latitude, ottawa.longitude, "fahrenheit");
    expect(consoleCapture.text()).toContain("54.0°F");
  });

  test("informa cuando no hay ciudad default configurada", async () => {
    await getDefaultCityWeather(makeState({ cities: [ottawa] }), fakeReadline(), colors);

    expect(fetchWeatherSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("No hay una ciudad default configurada.");
  });

  test("informa cuando la API falla", async () => {
    fetchWeatherSpy.mockRejectedValue(new Error("Error 500 al consultar el clima"));

    await getDefaultCityWeather(
      makeState({ cities: [ottawa], settings: { defaultCityId: "ottawa", unit: "celsius" } }),
      fakeReadline(),
      colors
    );

    expect(consoleCapture.text()).toContain("Error obteniendo el clima de Ottawa: Error 500 al consultar el clima");
  });

  test("no lanza el error de la API hacia el llamador", async () => {
    fetchWeatherSpy.mockRejectedValue("fallo en texto");

    const state = await getDefaultCityWeather(
      makeState({ cities: [ottawa], settings: { defaultCityId: "ottawa", unit: "celsius" } }),
      fakeReadline(),
      colors
    );

    expect(state.cities).toEqual([ottawa]);
    expect(consoleCapture.text()).toContain("fallo en texto");
  });
});
