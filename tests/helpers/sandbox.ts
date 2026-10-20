import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface Sandbox {
  dir: string;
  path(name: string): string;
  write(name: string, content: string): string;
  cleanup(): void;
}

// Redirige WEATHER_HOME a un directorio temporal para aislar la persistencia.
export function createSandbox(): Sandbox {
  const dir = mkdtempSync(join(tmpdir(), "weather-cli-"));
  const previous = process.env["WEATHER_HOME"];
  process.env["WEATHER_HOME"] = dir;

  return {
    dir,
    path: (name: string) => join(dir, name),
    write: (name: string, content: string) => {
      const target = join(dir, name);
      writeFileSync(target, content, "utf-8");
      return target;
    },
    cleanup: () => {
      if (previous === undefined) delete process.env["WEATHER_HOME"];
      else process.env["WEATHER_HOME"] = previous;
      rmSync(dir, { recursive: true, force: true });
    },
  };
}
