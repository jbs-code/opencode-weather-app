import { afterEach, beforeEach, describe, expect, spyOn, test, type Mock } from "bun:test";
import { removeCity } from "../../src/actions/removeCity.ts";
import * as citiesStorage from "../../src/storage/citiesStorage.ts";
import * as settingsStorage from "../../src/storage/settingsStorage.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { fakeReadline, makeCity, makeColors, makeState } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture;
let saveCitiesSpy: Mock<typeof citiesStorage.saveCities>;
let saveSettingsSpy: Mock<typeof settingsStorage.saveSettings>;

const colors = makeColors();
const ottawa = makeCity({ id: "ottawa", name: "Ottawa" });
const lima = makeCity({ id: "lima", name: "Lima" });

beforeEach(() => {
  consoleCapture = captureConsole();
  saveCitiesSpy = spyOn(citiesStorage, "saveCities").mockImplementation(() => {});
  saveSettingsSpy = spyOn(settingsStorage, "saveSettings").mockImplementation(() => {});
});

afterEach(() => {
  consoleCapture.restore();
  saveCitiesSpy.mockRestore();
  saveSettingsSpy.mockRestore();
});

describe("removeCity", () => {
  test("elimina la ciudad seleccionada y la persiste", async () => {
    const state = await removeCity(makeState({ cities: [ottawa, lima] }), fakeReadline(["1"]), colors);

    expect(state.cities).toEqual([lima]);
    expect(saveCitiesSpy).toHaveBeenCalledWith([lima]);
    expect(consoleCapture.text()).toContain('Ciudad "Ottawa" eliminada.');
  });

  test("limpia la ciudad default si era la eliminada", async () => {
    const state = await removeCity(
      makeState({ cities: [ottawa, lima], settings: { defaultCityId: "ottawa", unit: "celsius" } }),
      fakeReadline(["1"]),
      colors
    );

    expect(state.settings.defaultCityId).toBeNull();
    expect(saveSettingsSpy).toHaveBeenCalledWith({ defaultCityId: null, unit: "celsius" });
  });

  test("conserva la ciudad default si era otra", async () => {
    const state = await removeCity(
      makeState({ cities: [ottawa, lima], settings: { defaultCityId: "lima", unit: "celsius" } }),
      fakeReadline(["1"]),
      colors
    );

    expect(state.settings.defaultCityId).toBe("lima");
  });

  test("informa cuando no hay ciudades para eliminar", async () => {
    const state = await removeCity(makeState(), fakeReadline([]), colors);

    expect(state.cities).toEqual([]);
    expect(saveCitiesSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("No hay ciudades para eliminar.");
  });

  test("informa cuando el número es inválido", async () => {
    const state = await removeCity(makeState({ cities: [ottawa] }), fakeReadline(["abc"]), colors);

    expect(state.cities).toEqual([ottawa]);
    expect(saveCitiesSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("Número inválido.");
  });

  test("informa cuando la operación se cancela", async () => {
    const state = await removeCity(makeState({ cities: [ottawa] }), fakeReadline([""]), colors);

    expect(state.cities).toEqual([ottawa]);
    expect(saveCitiesSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("Operación cancelada.");
  });
});
