import { afterEach, beforeEach, describe, expect, spyOn, test, type Mock } from "bun:test";
import { getAllCitiesWeather } from "../../src/actions/getAllCitiesWeather.ts";
import * as weatherApi from "../../src/api/weather.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { fakeReadline, makeCity, makeColors, makeState } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture;
let fetchWeatherSpy: Mock<typeof weatherApi.fetchWeather>;

const colors = makeColors();
const ottawa = makeCity({ id: "ottawa", name: "Ottawa" });
const lima = makeCity({ id: "lima", name: "Lima" });

beforeEach(() => {
  consoleCapture = captureConsole();
  fetchWeatherSpy = spyOn(weatherApi, "fetchWeather");
});

afterEach(() => {
  consoleCapture.restore();
  fetchWeatherSpy.mockRestore();
});

describe("getAllCitiesWeather", () => {
  test("muestra el clima de todas las ciudades", async () => {
    fetchWeatherSpy.mockResolvedValue({ temperature: 10, description: "Nublado" });

    await getAllCitiesWeather(makeState({ cities: [ottawa, lima] }), fakeReadline(), colors);

    const output = consoleCapture.text();
    expect(output).toContain("Ottawa");
    expect(output).toContain("Lima");
    expect(output).toContain("Nublado, 10.0°C");
    expect(fetchWeatherSpy).toHaveBeenCalledTimes(2);
  });

  test("marca la ciudad default", async () => {
    fetchWeatherSpy.mockResolvedValue({ temperature: 10, description: "Nublado" });

    await getAllCitiesWeather(
      makeState({ cities: [ottawa, lima], settings: { defaultCityId: "lima", unit: "celsius" } }),
      fakeReadline(),
      colors
    );

    const output = consoleCapture.text();
    expect(output).toContain("Lima (default)");
    expect(output).not.toContain("Ottawa (default)");
  });

  test("informa cuando no hay ciudades registradas", async () => {
    await getAllCitiesWeather(makeState(), fakeReadline(), colors);

    expect(fetchWeatherSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("No hay ciudades registradas.");
  });

  test("continúa con la siguiente ciudad si una falla", async () => {
    fetchWeatherSpy
      .mockRejectedValueOnce(new Error("fallo"))
      .mockResolvedValueOnce({ temperature: 20, description: "Cielo despejado" });

    await getAllCitiesWeather(makeState({ cities: [ottawa, lima] }), fakeReadline(), colors);

    const output = consoleCapture.text();
    expect(output).toContain("Ottawa: error obteniendo clima");
    expect(output).toContain("Lima");
    expect(output).toContain("Cielo despejado");
  });
});
