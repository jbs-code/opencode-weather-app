import { afterEach, beforeEach, describe, expect, spyOn, test, type Mock } from "bun:test";
import { setDefaultCity } from "../../src/actions/setDefaultCity.ts";
import * as settingsStorage from "../../src/storage/settingsStorage.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { fakeReadline, makeCity, makeColors, makeState } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture;
let saveSettingsSpy: Mock<typeof settingsStorage.saveSettings>;

const colors = makeColors();
const ottawa = makeCity({ id: "ottawa", name: "Ottawa" });
const lima = makeCity({ id: "lima", name: "Lima" });

beforeEach(() => {
  consoleCapture = captureConsole();
  saveSettingsSpy = spyOn(settingsStorage, "saveSettings").mockImplementation(() => {});
});

afterEach(() => {
  consoleCapture.restore();
  saveSettingsSpy.mockRestore();
});

describe("setDefaultCity", () => {
  test("establece la ciudad elegida como default y la persiste", async () => {
    const state = await setDefaultCity(makeState({ cities: [ottawa, lima] }), fakeReadline(["2"]), colors);

    expect(state.settings.defaultCityId).toBe("lima");
    expect(saveSettingsSpy).toHaveBeenCalledWith({ defaultCityId: "lima", unit: "celsius" });
    expect(consoleCapture.text()).toContain("Ciudad default establecida: Lima.");
  });

  test("informa cuando no hay ciudades registradas", async () => {
    const state = await setDefaultCity(makeState(), fakeReadline([]), colors);

    expect(state.settings.defaultCityId).toBeNull();
    expect(saveSettingsSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("No hay ciudades registradas.");
  });

  test("informa cuando el número es inválido", async () => {
    const state = await setDefaultCity(makeState({ cities: [ottawa] }), fakeReadline(["9"]), colors);

    expect(state.settings.defaultCityId).toBeNull();
    expect(saveSettingsSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("Número inválido.");
  });

  test("informa cuando la operación se cancela", async () => {
    const state = await setDefaultCity(makeState({ cities: [ottawa] }), fakeReadline([""]), colors);

    expect(state.settings.defaultCityId).toBeNull();
    expect(saveSettingsSpy).not.toHaveBeenCalled();
    expect(consoleCapture.text()).toContain("Operación cancelada.");
  });
});
