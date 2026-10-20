import { afterEach, describe, expect, test } from "bun:test";
import { error, info, loading, success, warn } from "../../src/presentation/output.ts";
import { createColors } from "../../src/utils/colors.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { makeColors } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture | undefined;

afterEach(() => {
  consoleCapture?.restore();
  consoleCapture = undefined;
});

describe("output", () => {
  test("success imprime el mensaje y una línea en blanco", () => {
    consoleCapture = captureConsole();

    success(makeColors(), "Todo bien");

    expect(consoleCapture.logs).toEqual(["Todo bien", ""]);
  });

  test("error imprime el mensaje y una línea en blanco", () => {
    consoleCapture = captureConsole();

    error(makeColors(), "Algo falló");

    expect(consoleCapture.logs).toEqual(["Algo falló", ""]);
  });

  test("warn imprime el mensaje y una línea en blanco", () => {
    consoleCapture = captureConsole();

    warn(makeColors(), "Cuidado");

    expect(consoleCapture.logs).toEqual(["Cuidado", ""]);
  });

  test("info imprime el mensaje y una línea en blanco", () => {
    consoleCapture = captureConsole();

    info(makeColors(), "Información");

    expect(consoleCapture.logs).toEqual(["Información", ""]);
  });

  test("loading imprime solo el mensaje", () => {
    consoleCapture = captureConsole();

    loading(makeColors(), "Cargando...");

    expect(consoleCapture.logs).toEqual(["Cargando..."]);
  });

  test("aplica el color correspondiente a cada mensaje", () => {
    consoleCapture = captureConsole();
    const colors = createColors(true);

    success(colors, "ok");
    error(colors, "mal");
    warn(colors, "aviso");
    loading(colors, "cargando");

    expect(consoleCapture.logs[0]).toBe("\x1b[32mok\x1b[0m");
    expect(consoleCapture.logs[2]).toBe("\x1b[31mmal\x1b[0m");
    expect(consoleCapture.logs[4]).toBe("\x1b[33maviso\x1b[0m");
    expect(consoleCapture.logs[6]).toBe("\x1b[2mcargando\x1b[0m");
  });
});
