import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { listCities } from "../../src/actions/listCities.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { fakeReadline, makeCity, makeColors, makeState } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture;

const colors = makeColors();
const ottawa = makeCity({ id: "ottawa", name: "Ottawa", country: "CA" });
const lima = makeCity({ id: "lima", name: "Lima", country: "PE" });

beforeEach(() => {
  consoleCapture = captureConsole();
});

afterEach(() => {
  consoleCapture.restore();
});

describe("listCities", () => {
  test("lista las ciudades guardadas con su país", async () => {
    await listCities(makeState({ cities: [ottawa, lima] }), fakeReadline(), colors);

    const output = consoleCapture.text();
    expect(output).toContain("Ciudades guardadas:");
    expect(output).toContain("1. Ottawa - CA");
    expect(output).toContain("2. Lima - PE");
  });

  test("marca la ciudad default", async () => {
    await listCities(
      makeState({ cities: [ottawa, lima], settings: { defaultCityId: "ottawa", unit: "celsius" } }),
      fakeReadline(),
      colors
    );

    const output = consoleCapture.text();
    expect(output).toContain("1. Ottawa - CA (default)");
    expect(output).not.toContain("2. Lima - PE (default)");
  });

  test("informa cuando no hay ciudades registradas", async () => {
    await listCities(makeState(), fakeReadline(), colors);

    expect(consoleCapture.text()).toContain("No hay ciudades registradas.");
  });

  test("no modifica el estado", async () => {
    const state = makeState({ cities: [ottawa] });

    const result = await listCities(state, fakeReadline(), colors);

    expect(result).toEqual(state);
  });
});
