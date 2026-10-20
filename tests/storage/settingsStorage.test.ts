import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { loadSettings, parseUnit, saveSettings } from "../../src/storage/settingsStorage.ts";
import { createSandbox, type Sandbox } from "../helpers/sandbox.ts";

let sandbox: Sandbox;

beforeEach(() => {
  sandbox = createSandbox();
});

afterEach(() => {
  sandbox.cleanup();
});

describe("loadSettings", () => {
  test("devuelve los valores por defecto si el archivo no existe", () => {
    expect(loadSettings()).toEqual({ defaultCityId: null, unit: "celsius" });
  });

  test("devuelve los valores por defecto si el JSON es inválido", () => {
    sandbox.write("settings.json", "{ no es json");

    expect(loadSettings()).toEqual({ defaultCityId: null, unit: "celsius" });
  });

  test("carga la configuración guardada", () => {
    sandbox.write("settings.json", JSON.stringify({ defaultCityId: "city-1", unit: "fahrenheit" }));

    expect(loadSettings()).toEqual({ defaultCityId: "city-1", unit: "fahrenheit" });
  });

  test("descarta un defaultCityId que no es texto", () => {
    sandbox.write("settings.json", JSON.stringify({ defaultCityId: 42, unit: "celsius" }));

    expect(loadSettings().defaultCityId).toBeNull();
  });

  test("descarta una unidad desconocida", () => {
    sandbox.write("settings.json", JSON.stringify({ defaultCityId: null, unit: "kelvin" }));

    expect(loadSettings().unit).toBe("celsius");
  });
});

describe("saveSettings", () => {
  test("crea el directorio de estado si no existe", () => {
    saveSettings({ defaultCityId: null, unit: "celsius" });

    expect(existsSync(sandbox.path("settings.json"))).toBe(true);
  });

  test("guarda la configuración en formato JSON legible", () => {
    saveSettings({ defaultCityId: "city-1", unit: "fahrenheit" });

    const content = readFileSync(sandbox.path("settings.json"), "utf-8");
    expect(JSON.parse(content)).toEqual({ defaultCityId: "city-1", unit: "fahrenheit" });
    expect(content).toContain("\n");
  });

  test("sobrescribe el contenido anterior", () => {
    saveSettings({ defaultCityId: "a", unit: "celsius" });
    saveSettings({ defaultCityId: "b", unit: "fahrenheit" });

    expect(loadSettings()).toEqual({ defaultCityId: "b", unit: "fahrenheit" });
  });
});

describe("parseUnit", () => {
  test("reconoce fahrenheit", () => {
    expect(parseUnit("fahrenheit")).toBe("fahrenheit");
  });

  test("reconoce celsius", () => {
    expect(parseUnit("celsius")).toBe("celsius");
  });

  test("cualquier otro valor cae en celsius", () => {
    expect(parseUnit("kelvin")).toBe("celsius");
    expect(parseUnit(undefined)).toBe("celsius");
    expect(parseUnit(null)).toBe("celsius");
    expect(parseUnit(7)).toBe("celsius");
  });
});
