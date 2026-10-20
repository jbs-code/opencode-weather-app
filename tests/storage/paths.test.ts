import { afterEach, describe, expect, test } from "bun:test";
import * as os from "node:os";
import * as path from "node:path";
import {
  getCitiesPath,
  getLegacyStatePath,
  getSettingsPath,
  getStateDir,
} from "../../src/storage/paths.ts";
import { createSandbox, type Sandbox } from "../helpers/sandbox.ts";

let sandbox: Sandbox | undefined;

afterEach(() => {
  sandbox?.cleanup();
  sandbox = undefined;
});

describe("getStateDir", () => {
  test("usa WEATHER_HOME cuando está definido", () => {
    sandbox = createSandbox();

    expect(getStateDir()).toBe(sandbox.dir);
  });

  test("usa el home del usuario cuando no hay override", () => {
    const previous = process.env["WEATHER_HOME"];
    delete process.env["WEATHER_HOME"];

    expect(getStateDir()).toBe(path.join(os.homedir(), ".weather-cli"));

    if (previous === undefined) delete process.env["WEATHER_HOME"];
    else process.env["WEATHER_HOME"] = previous;
  });
});

describe("paths de archivos", () => {
  test("los archivos viven dentro del directorio de estado", () => {
    sandbox = createSandbox();

    expect(getCitiesPath()).toBe(path.join(sandbox.dir, "cities.json"));
    expect(getSettingsPath()).toBe(path.join(sandbox.dir, "settings.json"));
    expect(getLegacyStatePath()).toBe(path.join(sandbox.dir, "state.json"));
  });
});
