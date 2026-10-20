import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { loadCities, saveCities } from "../../src/storage/citiesStorage.ts";
import { makeCity } from "../helpers/fixtures.ts";
import { createSandbox, type Sandbox } from "../helpers/sandbox.ts";

let sandbox: Sandbox;

beforeEach(() => {
  sandbox = createSandbox();
});

afterEach(() => {
  sandbox.cleanup();
});

describe("loadCities", () => {
  test("devuelve lista vacía si el archivo no existe", () => {
    expect(loadCities()).toEqual([]);
  });

  test("devuelve lista vacía si el JSON es inválido", () => {
    sandbox.write("cities.json", "{ no es json");

    expect(loadCities()).toEqual([]);
  });

  test("devuelve lista vacía si el contenido no es un array", () => {
    sandbox.write("cities.json", JSON.stringify({ cities: [] }));

    expect(loadCities()).toEqual([]);
  });

  test("carga las ciudades guardadas", () => {
    const city = makeCity();
    sandbox.write("cities.json", JSON.stringify([city]));

    expect(loadCities()).toEqual([city]);
  });

  test("descarta las entradas que no son ciudades válidas", () => {
    const city = makeCity();
    sandbox.write(
      "cities.json",
      JSON.stringify([city, { id: "x" }, { id: 1, name: "Lima" }, null, "texto"])
    );

    expect(loadCities()).toEqual([city]);
  });
});

describe("saveCities", () => {
  test("crea el directorio de estado si no existe", () => {
    saveCities([makeCity()]);

    expect(existsSync(sandbox.path("cities.json"))).toBe(true);
  });

  test("guarda las ciudades en formato JSON legible", () => {
    const city = makeCity();
    saveCities([city]);

    const content = readFileSync(sandbox.path("cities.json"), "utf-8");
    expect(JSON.parse(content)).toEqual([city]);
    expect(content).toContain("\n");
  });

  test("sobrescribe el contenido anterior", () => {
    saveCities([makeCity({ id: "a" })]);
    saveCities([makeCity({ id: "b" })]);

    expect(loadCities().map((city) => city.id)).toEqual(["b"]);
  });
});
