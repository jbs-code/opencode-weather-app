import { afterEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const PROMPT = "Selecciona una opción: ";

const CITIES = [
  { id: "ottawa", name: "Ottawa", latitude: 45.41117, longitude: -75.69812, country: "CA" },
  { id: "lima", name: "Lima", latitude: -12.0464, longitude: -77.0428, country: "PE" },
];

interface AppRun {
  stdout: string;
  stderr: string;
  code: number | null;
}

const homes: string[] = [];

afterEach(() => {
  while (homes.length > 0) rmSync(homes.pop()!, { recursive: true, force: true });
});

function createHome(): string {
  const home = mkdtempSync(join(tmpdir(), "weather-cli-e2e-"));
  homes.push(home);
  writeFileSync(join(home, "cities.json"), JSON.stringify(CITIES, null, 2), "utf-8");
  writeFileSync(
    join(home, "settings.json"),
    JSON.stringify({ defaultCityId: "ottawa", unit: "celsius" }, null, 2),
    "utf-8"
  );
  return home;
}

// La app lee de readline: se responde cada vez que aparece el prompt.
async function runApp(inputs: string[], home = createHome()): Promise<AppRun> {
  const proc = Bun.spawn([process.execPath, join(PROJECT_ROOT, "src/index.ts")], {
    cwd: PROJECT_ROOT,
    env: { ...process.env, WEATHER_HOME: home, WEATHER_COLOR: "never" },
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  });

  const pending = [...inputs];
  let answered = 0;

  const stdoutPromise = (async () => {
    const decoder = new TextDecoder();
    let output = "";

    for await (const chunk of proc.stdout) {
      output += decoder.decode(chunk, { stream: true });
      const prompts = output.split(PROMPT).length - 1;
      while (answered < prompts && pending.length > 0) {
        await proc.stdin.write(`${pending.shift()}\n`);
        answered++;
      }
    }

    return output + decoder.decode();
  })();

  const stderrPromise = new Response(proc.stderr).text();
  const stdout = await stdoutPromise;
  proc.stdin.end();
  const stderr = await stderrPromise;
  const code = await proc.exited;

  return { stdout, stderr, code };
}

describe("aplicación completa", () => {
  test("muestra el menú y las ciudades guardadas antes de salir", async () => {
    const run = await runApp(["7", "9"]);

    expect(run.code).toBe(0);
    expect(run.stdout).toContain("WEATHER CLI");
    expect(run.stdout).toContain("1. Clima de ciudad default");
    expect(run.stdout).toContain("9. Salir");
    expect(run.stdout).toContain("Ciudades guardadas:");
    expect(run.stdout).toContain("Ottawa");
    expect(run.stdout).toContain("Lima");
    expect(run.stdout).toContain("¡Hasta luego!");
  });

  test("informa cuando la opción no es válida y sigue en el menú", async () => {
    const run = await runApp(["0", "9"]);

    expect(run.stdout).toContain("Opción no válida. Intenta de nuevo.");
    expect(run.stdout).toContain("¡Hasta luego!");
  });

  test("cambia la unidad de temperatura desde el menú", async () => {
    const run = await runApp(["8", "9"]);

    expect(run.stdout).toContain("Unidad cambiada a °F.");
  });

  test("persiste la unidad cambiada en el archivo de configuración", async () => {
    const home = createHome();

    const run = await runApp(["8", "9"], home);
    expect(run.code).toBe(0);

    const settings = await Bun.file(join(home, "settings.json")).json();
    expect(settings.unit).toBe("fahrenheit");
  });

  test("no escribe nada en stderr durante un flujo normal", async () => {
    const run = await runApp(["9"]);

    expect(run.stderr).toBe("");
  });
});
