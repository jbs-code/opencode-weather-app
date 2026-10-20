import type { Colors } from "../types/Colors.ts";

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
} as const;

export function shouldUseColor(): boolean {
  const mode = process.env["WEATHER_COLOR"];
  if (mode === "always") return true;
  if (mode === "never") return false;
  if (process.env["NO_COLOR"] !== undefined) return false;
  return process.stdout.isTTY === true;
}

export function createColors(enabled = shouldUseColor()): Colors {
  const wrap = (code: string) => (text: string) =>
    enabled ? `${code}${text}${ANSI.reset}` : text;

  return {
    cyan: wrap(ANSI.cyan),
    yellow: wrap(ANSI.yellow),
    green: wrap(ANSI.green),
    red: wrap(ANSI.red),
    bold: wrap(ANSI.bold),
    dim: wrap(ANSI.dim),
  };
}
