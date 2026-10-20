import { afterEach, beforeEach, describe, expect, spyOn, test, type Mock } from "bun:test";
import { toggleUnit } from "../../src/actions/toggleUnit.ts";
import * as settingsStorage from "../../src/storage/settingsStorage.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { fakeReadline, makeColors, makeState } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture;
let saveSettingsSpy: Mock<typeof settingsStorage.saveSettings>;

const colors = makeColors();

beforeEach(() => {
  consoleCapture = captureConsole();
  saveSettingsSpy = spyOn(settingsStorage, "saveSettings").mockImplementation(() => {});
});

afterEach(() => {
  consoleCapture.restore();
  saveSettingsSpy.mockRestore();
});

describe("toggleUnit", () => {
  test("cambia de celsius a fahrenheit", async () => {
    const state = await toggleUnit(makeState(), fakeReadline(), colors);

    expect(state.settings.unit).toBe("fahrenheit");
    expect(saveSettingsSpy).toHaveBeenCalledWith({ defaultCityId: null, unit: "fahrenheit" });
    expect(consoleCapture.text()).toContain("Unidad cambiada a °F.");
  });

  test("cambia de fahrenheit a celsius", async () => {
    const state = await toggleUnit(
      makeState({ settings: { defaultCityId: null, unit: "fahrenheit" } }),
      fakeReadline(),
      colors
    );

    expect(state.settings.unit).toBe("celsius");
    expect(saveSettingsSpy).toHaveBeenCalledWith({ defaultCityId: null, unit: "celsius" });
    expect(consoleCapture.text()).toContain("Unidad cambiada a °C.");
  });

  test("conserva la ciudad default", async () => {
    const state = await toggleUnit(
      makeState({ settings: { defaultCityId: "city-1", unit: "celsius" } }),
      fakeReadline(),
      colors
    );

    expect(state.settings.defaultCityId).toBe("city-1");
  });
});
