import { afterEach, beforeEach, describe, expect, spyOn, test, type Mock } from "bun:test";
import { addCity } from "../../src/actions/addCity.ts";
import * as geocoding from "../../src/api/geocoding.ts";
import * as citiesStorage from "../../src/storage/citiesStorage.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { fakeReadline, makeCity, makeColors, makeState } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture;
let geocodeSpy: Mock<typeof geocoding.geocodeCity>;
let saveCitiesSpy: Mock<typeof citiesStorage.saveCities>;

const colors = makeColors();

beforeEach(() => {
  consoleCapture = captureConsole();
  geocodeSpy = spyOn(geocoding, "geocodeCity");
  saveCitiesSpy = spyOn(citiesStorage, "saveCities").mockImplementation(() => {});
});

afterEach(() => {
  consoleCapture.restore();
  geocodeSpy.mockRestore();
  saveCitiesSpy.mockRestore();
});

describe("addCity", () => {
  test("agrega la ciudad buscada y la persiste", async () => {
    const city = makeCity({ id: "nueva", name: "Lima" });
    geocodeSpy.mockResolvedValue(city);

    const state = await addCity(makeState(), fakeReadline(["Lima"]), colors);

    expect(state.cities).toEqual([city]);
    expect(saveCitiesSpy).toHaveBeenCalledWith([city]);
    expect(consoleCapture.text()).toContain('Ciudad "Lima" agregada.');
  });

  test("rechaza un nombre vacío", async () => {
    const state = await addCity(makeState(), fakeReadline(["   "]), colors);

    expect(state.cities).toEqual([]);
    expect(geocodeSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("Nombre inválido.");
  });

  test("informa cuando la ciudad no se encuentra", async () => {
    geocodeSpy.mockResolvedValue(null);

    const state = await addCity(makeState(), fakeReadline(["Narnia"]), colors);

    expect(state.cities).toEqual([]);
    expect(saveCitiesSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain('No se encontró la ciudad "Narnia".');
  });

  test("no duplica una ciudad ya registrada", async () => {
    geocodeSpy.mockResolvedValue(makeCity({ id: "otra", name: "Ottawa" }));

    const state = await addCity(makeState({ cities: [makeCity()] }), fakeReadline(["ottawa"]), colors);

    expect(state.cities).toHaveLength(1);
    expect(saveCitiesSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("La ciudad ya está registrada.");
  });

  test("no modifica el resto del estado", async () => {
    geocodeSpy.mockResolvedValue(makeCity({ id: "nueva" }));
    const state = makeState({ settings: { defaultCityId: "city-1", unit: "fahrenheit" } });

    const result = await addCity(state, fakeReadline(["Lima"]), colors);

    expect(result.settings).toEqual(state.settings);
  });
});
