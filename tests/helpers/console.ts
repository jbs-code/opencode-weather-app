import { spyOn } from "bun:test";

export interface ConsoleCapture {
  logs: string[];
  text(): string;
  restore(): void;
}

export function captureConsole(): ConsoleCapture {
  const logs: string[] = [];
  const spy = spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    logs.push(args.map((arg) => String(arg)).join(" "));
  });

  return {
    logs,
    text: () => logs.join("\n"),
    restore: () => spy.mockRestore(),
  };
}
