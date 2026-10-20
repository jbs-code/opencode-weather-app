import type { Colors } from "./colors";

export interface MenuEntry {
  key: string;
  label: string;
}

export function renderMenu(colors: Colors, entries: MenuEntry[]): void {
  const box = colors.bold(colors.cyan("══════════════════════════════════════════════"));
  const title = colors.bold(colors.cyan("         WEATHER CLI"));
  const lines = [
    box,
    title,
    box,
    ...entries.map((entry) => `  ${colors.cyan(entry.key)}. ${entry.label}`),
    box,
  ];
  console.log(lines.join("\n"));
}
