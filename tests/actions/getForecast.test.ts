import { afterEach, beforeEach, describe, expect, spyOn, test, type Mock } from "bun:test";
import { getForecast } from "../../src/actions/getForecast.ts";
import * as weatherApi from "../../src/api/weather.ts";
import type { DailyForecast } from "../../src/types/Weather.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { fakeReadline, makeCity, makeColors, makeState } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture;
let fetchForecastSpy: Mock<typeof weatherApi.fetchForecast>;

const colors = makeColors();
const ottawa = makeCity({ id: "ottawa", name: "Ottawa" });
const lima = makeCity({ id: "lima", name: "Lima" });

const DAYS: DailyForecast[] = [
  {
    date: "2026-10-19",
    description: "Cielo despejado",
    temperatureMax: 17.7,
    temperatureMin: 2.7,
    precipitationProbability: 0,
  },
];

beforeEach(() => {
  consoleCapture = captureConsole();
  fetchForecastSpy = spyOn(weatherApi, "fetchForecast");
});

afterEach(() => {
  consoleCapture.restore();
  fetchForecastSpy.mockRestore();
});

describe("getForecast", () => {
  test("muestra el pronóstico de la ciudad seleccionada", async () => {
    fetchForecastSpy.mockResolvedValue(DAYS);

    await getForecast(makeState({ cities: [ottawa, lima] }), fakeReadline(["2"]), colors);

    expect(fetchForecastSpy).toHaveBeenCalledWith(lima.latitude, lima.longitude, "celsius");
    expect(consoleCapture.text()).toContain("Pronóstico para Lima (1 días)");
    expect(consoleCapture.text()).toContain("Cielo despejado");
  });

  test("informa cuando no hay ciudades registradas", async () => {
    await getForecast(makeState(), fakeReadline(), colors);

    expect(fetchForecastSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("No hay ciudades registradas.");
  });

  test("informa cuando el número es inválido", async () => {
    await getForecast(makeState({ cities: [ottawa] }), fakeReadline(["abc"]), colors);

    expect(fetchForecastSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("Número inválido.");
  });

  test("informa cuando la operación se cancela", async () => {
    await getForecast(makeState({ cities: [ottawa] }), fakeReadline([""]), colors);

    expect(fetchForecastSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("Operación cancelada.");
  });

  test("informa cuando la API falla", async () => {
    fetchForecastSpy.mockRejectedValue(new Error("Error 500 al consultar el pronóstico"));

    await getForecast(makeState({ cities: [ottawa] }), fakeReadline(["1"]), colors);

    expect(consoleCapture.text()).toContain("Error obteniendo el pronóstico de Ottawa");
  });
});
