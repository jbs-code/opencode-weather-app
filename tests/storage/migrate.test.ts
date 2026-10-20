import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { loadCities } from "../../src/storage/citiesStorage.ts";
import { migrateLegacyState } from "../../src/storage/migrate.ts";
import { loadSettings } from "../../src/storage/settingsStorage.ts";
import { makeCity } from "../helpers/fixtures.ts";
import { createSandbox, type Sandbox } from "../helpers/sandbox.ts";

let sandbox: Sandbox;

beforeEach(() => {
  sandbox = createSandbox();
});

afterEach(() => {
  sandbox.cleanup();
});

describe("migrateLegacyState", () => {
  test("no hace nada si no existe el archivo legado", () => {
    migrateLegacyState();

    expect(existsSync(sandbox.path("cities.json"))).toBe(false);
    expect(existsSync(sandbox.path("settings.json"))).toBe(false);
  });

  test("migra el state.json a cities.json y settings.json", () => {
    const city = makeCity();
    sandbox.write("state.json", JSON.stringify({ cities: [city], defaultCityId: city.id, unit: "fahrenheit" }));

    migrateLegacyState();

    expect(loadCities()).toEqual([city]);
    expect(loadSettings()).toEqual({ defaultCityId: city.id, unit: "fahrenheit" });
  });

  test("renombra el archivo legado a .bak", () => {
    sandbox.write("state.json", JSON.stringify({ cities: [] }));

    migrateLegacyState();

    expect(existsSync(sandbox.path("state.json"))).toBe(false);
    expect(existsSync(sandbox.path("state.json.bak"))).toBe(true);
  });

  test("no migra si ya existe cities.json", () => {
    sandbox.write("state.json", JSON.stringify({ cities: [makeCity({ id: "legacy" })] }));
    sandbox.write("cities.json", JSON.stringify([makeCity({ id: "actual" })]));

    migrateLegacyState();

    expect(loadCities().map((city) => city.id)).toEqual(["actual"]);
    expect(existsSync(sandbox.path("state.json"))).toBe(true);
  });

  test("no migra si ya existe settings.json", () => {
    sandbox.write("state.json", JSON.stringify({ cities: [] }));
    sandbox.write("settings.json", JSON.stringify({ defaultCityId: null, unit: "celsius" }));

    migrateLegacyState();

    expect(existsSync(sandbox.path("cities.json"))).toBe(false);
    expect(existsSync(sandbox.path("state.json"))).toBe(true);
  });

  test("usa valores por defecto si el legado no trae ciudades", () => {
    sandbox.write("state.json", JSON.stringify({}));

    migrateLegacyState();

    expect(loadCities()).toEqual([]);
    expect(loadSettings()).toEqual({ defaultCityId: null, unit: "celsius" });
  });

  test("mantiene intacto el archivo legado si la migración falla", () => {
    sandbox.write("state.json", "{ no es json");

    migrateLegacyState();

    expect(existsSync(sandbox.path("state.json"))).toBe(true);
    expect(existsSync(sandbox.path("state.json.bak"))).toBe(false);
    expect(readFileSync(sandbox.path("state.json"), "utf-8")).toBe("{ no es json");
  });
});
