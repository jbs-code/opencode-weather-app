import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createColors, shouldUseColor } from "../../src/utils/colors.ts";

const ENV_KEYS = ["WEATHER_COLOR", "NO_COLOR"] as const;

let savedEnv: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

beforeEach(() => {
  savedEnv = {};
  for (const key of ENV_KEYS) savedEnv[key] = process.env[key];
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    const value = savedEnv[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

describe("shouldUseColor", () => {
  test("WEATHER_COLOR=always fuerza color", () => {
    process.env["WEATHER_COLOR"] = "always";
    expect(shouldUseColor()).toBe(true);
  });

  test("WEATHER_COLOR=never desactiva color", () => {
    process.env["WEATHER_COLOR"] = "never";
    expect(shouldUseColor()).toBe(false);
  });

  test("WEATHER_COLOR=always tiene prioridad sobre NO_COLOR", () => {
    process.env["WEATHER_COLOR"] = "always";
    process.env["NO_COLOR"] = "1";
    expect(shouldUseColor()).toBe(true);
  });

  test("NO_COLOR desactiva color", () => {
    delete process.env["WEATHER_COLOR"];
    process.env["NO_COLOR"] = "1";
    expect(shouldUseColor()).toBe(false);
  });

  test("sin variables depende de si stdout es TTY", () => {
    delete process.env["WEATHER_COLOR"];
    delete process.env["NO_COLOR"];
    expect(shouldUseColor()).toBe(process.stdout.isTTY === true);
  });
});

describe("createColors", () => {
  test("sin color devuelve el texto sin modificar", () => {
    const colors = createColors(false);
    expect(colors.cyan("texto")).toBe("texto");
    expect(colors.yellow("texto")).toBe("texto");
    expect(colors.green("texto")).toBe("texto");
    expect(colors.red("texto")).toBe("texto");
    expect(colors.bold("texto")).toBe("texto");
    expect(colors.dim("texto")).toBe("texto");
  });

  test("con color envuelve el texto con códigos ANSI", () => {
    const colors = createColors(true);
    expect(colors.cyan("texto")).toBe("\x1b[36mtexto\x1b[0m");
    expect(colors.yellow("texto")).toBe("\x1b[33mtexto\x1b[0m");
    expect(colors.green("texto")).toBe("\x1b[32mtexto\x1b[0m");
    expect(colors.red("texto")).toBe("\x1b[31mtexto\x1b[0m");
    expect(colors.bold("texto")).toBe("\x1b[1mtexto\x1b[0m");
    expect(colors.dim("texto")).toBe("\x1b[2mtexto\x1b[0m");
  });
});
