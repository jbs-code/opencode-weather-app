import { afterEach, describe, expect, test } from "bun:test";
import { fetchForecast, fetchWeather } from "../../src/api/weather.ts";
import { jsonResponse, mockFetch, type FetchMock } from "../helpers/fetch.ts";

let fetchMock: FetchMock | undefined;

afterEach(() => {
  fetchMock?.mockRestore();
  fetchMock = undefined;
});

describe("fetchWeather", () => {
  test("consulta las coordenadas y la unidad de temperatura", async () => {
    fetchMock = mockFetch(() => jsonResponse({ current: { temperature_2m: 12, weather_code: 0 } }));

    await fetchWeather(45.41117, -75.69812, "celsius");

    const url = fetchMock.mock.calls[0]![0] as string;
    expect(url).toContain("latitude=45.41117");
    expect(url).toContain("longitude=-75.69812");
    expect(url).toContain("temperature_unit=celsius");
    expect(url).toContain("current=");
  });

  test("traduce la unidad fahrenheit en la petición", async () => {
    fetchMock = mockFetch(() => jsonResponse({ current: { temperature_2m: 12, weather_code: 0 } }));

    await fetchWeather(45.41117, -75.69812, "fahrenheit");

    expect(fetchMock.mock.calls[0]![0] as string).toContain("temperature_unit=fahrenheit");
  });

  test("mapea la respuesta a temperatura y descripción", async () => {
    fetchMock = mockFetch(() =>
      jsonResponse({ current: { temperature_2m: 12.4, weather_code: 61 } })
    );

    const weather = await fetchWeather(45.41117, -75.69812, "celsius");

    expect(weather.temperature).toBe(12.4);
    expect(weather.description).toBe("Lluvia ligera");
  });

  test("lanza un error cuando la API falla", async () => {
    fetchMock = mockFetch(() => jsonResponse({}, 500));

    expect(fetchWeather(1, 2, "celsius")).rejects.toThrow("Error 500 al consultar el clima");
  });

  test("lanza un error cuando no hay datos de clima", async () => {
    fetchMock = mockFetch(() => jsonResponse({}));

    expect(fetchWeather(1, 2, "celsius")).rejects.toThrow("No hay datos de clima disponibles");
  });
});

describe("fetchForecast", () => {
  const DAILY_PAYLOAD = {
    daily: {
      time: ["2026-10-19", "2026-10-20"],
      weather_code: [0, 61],
      temperature_2m_max: [17.7, 12.8],
      temperature_2m_min: [2.7, 3.8],
      precipitation_probability_max: [0, 20],
    },
  };

  test("consulta el pronóstico diario con 7 días y zona horaria automática", async () => {
    fetchMock = mockFetch(() => jsonResponse(DAILY_PAYLOAD));

    await fetchForecast(45.41117, -75.69812, "celsius");

    const url = fetchMock.mock.calls[0]![0] as string;
    expect(url).toContain("latitude=45.41117");
    expect(url).toContain("longitude=-75.69812");
    expect(url).toContain("forecast_days=7");
    expect(url).toContain("timezone=auto");
    expect(url).toContain("temperature_unit=celsius");
  });

  test("traduce la unidad fahrenheit en la petición", async () => {
    fetchMock = mockFetch(() => jsonResponse(DAILY_PAYLOAD));

    await fetchForecast(45.41117, -75.69812, "fahrenheit");

    expect(fetchMock.mock.calls[0]![0] as string).toContain("temperature_unit=fahrenheit");
  });

  test("mapea cada día del pronóstico", async () => {
    fetchMock = mockFetch(() => jsonResponse(DAILY_PAYLOAD));

    const days = await fetchForecast(45.41117, -75.69812, "celsius");

    expect(days).toHaveLength(2);
    expect(days[0]).toEqual({
      date: "2026-10-19",
      description: "Cielo despejado",
      temperatureMax: 17.7,
      temperatureMin: 2.7,
      precipitationProbability: 0,
    });
    expect(days[1]!.description).toBe("Lluvia ligera");
  });

  test("convierte valores ausentes en null", async () => {
    fetchMock = mockFetch(() =>
      jsonResponse({
        daily: {
          time: ["2026-10-19"],
          weather_code: [0],
          temperature_2m_max: [null],
          temperature_2m_min: [null],
          precipitation_probability_max: [null],
        },
      })
    );

    const days = await fetchForecast(45.41117, -75.69812, "celsius");

    expect(days[0]!.temperatureMax).toBeNull();
    expect(days[0]!.temperatureMin).toBeNull();
    expect(days[0]!.precipitationProbability).toBeNull();
  });

  test("lanza un error cuando la API falla", async () => {
    fetchMock = mockFetch(() => jsonResponse({}, 503));

    expect(fetchForecast(1, 2, "celsius")).rejects.toThrow("Error 503 al consultar el pronóstico");
  });

  test("lanza un error cuando no hay días de pronóstico", async () => {
    fetchMock = mockFetch(() => jsonResponse({ daily: { time: [] } }));

    expect(fetchForecast(1, 2, "celsius")).rejects.toThrow("No hay datos de pronóstico disponibles");
  });

  test("lanza un error cuando la respuesta no trae daily", async () => {
    fetchMock = mockFetch(() => jsonResponse({}));

    expect(fetchForecast(1, 2, "celsius")).rejects.toThrow("No hay datos de pronóstico disponibles");
  });
});
