import { afterEach, describe, expect, test } from "bun:test";
import { buildMenuOptions, EXIT_OPTION, renderMenu } from "../../src/presentation/menu.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { makeCity, makeColors, makeState } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture | undefined;

afterEach(() => {
  consoleCapture?.restore();
  consoleCapture = undefined;
});

describe("buildMenuOptions", () => {
  test("devuelve todas las opciones del menú", () => {
    const options = buildMenuOptions(makeState());

    expect(options.map((option) => option.key)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      EXIT_OPTION,
    ]);
  });

  test("muestra el número de ciudades registradas", () => {
    const state = makeState({ cities: [makeCity()] });

    const options = buildMenuOptions(state);

    expect(options.find((option) => option.key === "2")?.label).toBe("Clima de todas las ciudades (1)");
  });

  test("muestra la unidad actual en ajustes", () => {
    const options = buildMenuOptions(makeState({ settings: { defaultCityId: null, unit: "fahrenheit" } }));

    expect(options.find((option) => option.key === "8")?.label).toBe("Ajustes (°F)");
  });

  test("la última opción es salir", () => {
    const options = buildMenuOptions(makeState());

    expect(options.at(-1)).toEqual({ key: EXIT_OPTION, label: "Salir" });
  });
});

describe("renderMenu", () => {
  test("imprime el título y las opciones", () => {
    consoleCapture = captureConsole();

    renderMenu(makeColors(), buildMenuOptions(makeState()));

    const output = consoleCapture.text();
    expect(output).toContain("WEATHER CLI");
    expect(output).toContain("1. Clima de ciudad default");
    expect(output).toContain("9. Salir");
  });
});
