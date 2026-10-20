import { describe, expect, test } from "bun:test";
import { findCityById, isSameCity } from "../../src/utils/cities.ts";
import { makeCity } from "../helpers/fixtures.ts";

describe("findCityById", () => {
  const ottawa = makeCity({ id: "ottawa" });
  const lima = makeCity({ id: "lima", name: "Lima" });

  test("devuelve la ciudad con el id buscado", () => {
    expect(findCityById([ottawa, lima], "lima")).toEqual(lima);
  });

  test("devuelve undefined si el id no existe", () => {
    expect(findCityById([ottawa], "desconocido")).toBeUndefined();
  });

  test("devuelve undefined si el id es null", () => {
    expect(findCityById([ottawa], null)).toBeUndefined();
  });

  test("devuelve undefined si el id es vacío", () => {
    expect(findCityById([ottawa], "")).toBeUndefined();
  });
});

describe("isSameCity", () => {
  test("ignora mayúsculas y minúsculas en el nombre", () => {
    const first = makeCity({ name: "Ottawa" });
    const second = makeCity({ name: "ottawa" });
    expect(isSameCity(first, second)).toBe(true);
  });

  test("distingue coordenadas distintas", () => {
    const first = makeCity({ name: "Ottawa", latitude: 45.4, longitude: -75.6 });
    const second = makeCity({ name: "Ottawa", latitude: 45.5, longitude: -75.6 });
    expect(isSameCity(first, second)).toBe(false);
  });

  test("distingue longitudes distintas", () => {
    const first = makeCity({ name: "Ottawa", latitude: 45.4, longitude: -75.6 });
    const second = makeCity({ name: "Ottawa", latitude: 45.4, longitude: -75.7 });
    expect(isSameCity(first, second)).toBe(false);
  });

  test("ciudades distintas no son la misma", () => {
    expect(isSameCity(makeCity({ name: "Ottawa" }), makeCity({ name: "Lima" }))).toBe(false);
  });
});
