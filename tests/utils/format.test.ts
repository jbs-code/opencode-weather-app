import { describe, expect, test } from "bun:test";
import type { DailyForecast } from "../../src/types/Weather.ts";
import { formatForecast, formatWeather, unitSymbol } from "../../src/utils/format.ts";
import { createColors } from "../../src/utils/colors.ts";
import { makeColors } from "../helpers/fixtures.ts";

const colors = makeColors();

const DAYS: DailyForecast[] = [
  {
    date: "2026-10-19",
    description: "Cielo despejado",
    temperatureMax: 17.7,
    temperatureMin: 2.7,
    precipitationProbability: 0,
  },
  {
    date: "2026-10-20",
    description: "Nublado",
    temperatureMax: null,
    temperatureMin: 3.8,
    precipitationProbability: null,
  },
];

describe("unitSymbol", () => {
  test("devuelve el símbolo de celsius", () => {
    expect(unitSymbol("celsius")).toBe("°C");
  });

  test("devuelve el símbolo de fahrenheit", () => {
    expect(unitSymbol("fahrenheit")).toBe("°F");
  });
});

describe("formatWeather", () => {
  test("concatena descripción y temperatura con un decimal", () => {
    expect(formatWeather(colors, { temperature: 12.34, description: "Nublado" }, "°C")).toBe(
      "Nublado, 12.3°C"
    );
  });

  test("usa el símbolo recibido", () => {
    expect(formatWeather(colors, { temperature: 5, description: "Niebla" }, "°F")).toBe("Niebla, 5.0°F");
  });

  test("aplica el color amarillo a la temperatura", () => {
    const colored = createColors(true);
    expect(formatWeather(colored, { temperature: 1, description: "Lluvia" }, "°C")).toBe(
      "Lluvia, \x1b[33m1.0°C\x1b[0m"
    );
  });
});

describe("formatForecast", () => {
  test("genera encabezado y una línea por día", () => {
    const table = formatForecast(colors, DAYS, "°C");
    const lines = table.split("\n");

    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain("Fecha");
    expect(lines[0]).toContain("Clima");
    expect(lines[0]).toContain("Máx");
    expect(lines[0]).toContain("Mín");
    expect(lines[0]).toContain("Lluvia");
    expect(lines[1]).toContain("Cielo despejado");
    expect(lines[2]).toContain("Nublado");
  });

  test("muestra las temperaturas con un decimal y el símbolo", () => {
    const lines = formatForecast(colors, DAYS, "°C").split("\n");
    expect(lines[1]).toContain("17.7°C");
    expect(lines[1]).toContain("2.7°C");
  });

  test("usa guiones cuando faltan datos", () => {
    const lines = formatForecast(colors, DAYS, "°C").split("\n");
    expect(lines[2]).toContain("-");
    expect(lines[2]).not.toContain("null");
    expect(lines[2]).not.toContain("undefined");
  });

  test("muestra el porcentaje de lluvia", () => {
    const lines = formatForecast(colors, DAYS, "°C").split("\n");
    expect(lines[1]).toContain("0%");
  });

  test("respeta el símbolo de unidad en todas las columnas", () => {
    const lines = formatForecast(colors, DAYS, "°F").split("\n");
    expect(lines[1]).toContain("17.7°F");
    expect(lines[1]).toContain("2.7°F");
  });

  test("devuelve solo el encabezado cuando no hay días", () => {
    expect(formatForecast(colors, [], "°C")).toBe("Fecha  Clima  Máx  Mín  Lluvia");
  });
});
