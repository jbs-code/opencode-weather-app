import { afterEach, describe, expect, mock, test } from "bun:test";
import type { Readline } from "../../src/types/Readline.ts";
import { ask, closeInput, createInput, selectCity } from "../../src/presentation/input.ts";
import { captureConsole, type ConsoleCapture } from "../helpers/console.ts";
import { fakeReadline, makeCity, makeColors } from "../helpers/fixtures.ts";

let consoleCapture: ConsoleCapture | undefined;

afterEach(() => {
  consoleCapture?.restore();
  consoleCapture = undefined;
});

describe("createInput / closeInput", () => {
  test("createInput devuelve una interfaz de readline", () => {
    const rl = createInput();

    expect(typeof rl.question).toBe("function");

    closeInput(rl);
  });

  test("closeInput cierra la interfaz", () => {
    const close = mock(() => {});
    const rl = { close } as unknown as Readline;

    closeInput(rl);

    expect(close).toHaveBeenCalled();
  });
});

describe("ask", () => {
  test("devuelve la respuesta del usuario", async () => {
    const rl = fakeReadline(["Ottawa"]);

    expect(await ask(rl, "  Ciudad: ")).toBe("Ottawa");
  });

  test("devuelve cadena vacía si no hay respuesta", async () => {
    const rl = fakeReadline([]);

    expect(await ask(rl, "  Ciudad: ")).toBe("");
  });
});

describe("selectCity", () => {
  const ottawa = makeCity({ id: "ottawa", name: "Ottawa" });
  const lima = makeCity({ id: "lima", name: "Lima" });

  test("lista las ciudades disponibles", async () => {
    consoleCapture = captureConsole();

    await selectCity(fakeReadline(["1"]), [ottawa, lima], makeColors());

    const output = consoleCapture.text();
    expect(output).toContain("1. Ottawa");
    expect(output).toContain("2. Lima");
  });

  test("selecciona la ciudad elegida por número", async () => {
    consoleCapture = captureConsole();

    const selection = await selectCity(fakeReadline(["2"]), [ottawa, lima], makeColors());

    expect(selection).toEqual({ kind: "selected", city: lima });
  });

  test("selecciona la ciudad default al presionar Enter", async () => {
    consoleCapture = captureConsole();

    const selection = await selectCity(fakeReadline([""]), [ottawa, lima], makeColors(), {
      defaultCityId: "lima",
    });

    expect(selection).toEqual({ kind: "selected", city: lima });
  });

  test("cancela al presionar Enter sin ciudad default", async () => {
    consoleCapture = captureConsole();

    const selection = await selectCity(fakeReadline([""]), [ottawa, lima], makeColors());

    expect(selection).toEqual({ kind: "cancelled" });
  });

  test("devuelve invalid con un número no numérico", async () => {
    consoleCapture = captureConsole();

    const selection = await selectCity(fakeReadline(["abc"]), [ottawa, lima], makeColors());

    expect(selection).toEqual({ kind: "invalid" });
  });

  test("devuelve invalid con un número fuera de rango", async () => {
    consoleCapture = captureConsole();

    const selection = await selectCity(fakeReadline(["5"]), [ottawa, lima], makeColors());

    expect(selection).toEqual({ kind: "invalid" });
  });

  test("devuelve invalid con el número cero", async () => {
    consoleCapture = captureConsole();

    const selection = await selectCity(fakeReadline(["0"]), [ottawa, lima], makeColors());

    expect(selection).toEqual({ kind: "invalid" });
  });

  test("marca la ciudad default en el listado", async () => {
    consoleCapture = captureConsole();

    await selectCity(fakeReadline(["1"]), [ottawa, lima], makeColors(), { defaultCityId: "ottawa" });

    expect(consoleCapture.text()).toContain("1. Ottawa (default)");
  });
});
