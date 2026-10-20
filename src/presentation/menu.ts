import type { AppState } from "../types/AppState.ts";
import type { Colors } from "../types/Colors.ts";
import type { MenuOption } from "../types/MenuOption.ts";
import { unitSymbol } from "../utils/format.ts";

export const EXIT_OPTION = "9";

export function buildMenuOptions(state: AppState): MenuOption[] {
  return [
    { key: "1", label: "Clima de ciudad default" },
    { key: "2", label: `Clima de todas las ciudades (${state.cities.length})` },
    { key: "3", label: "Buscar y agregar ciudad" },
    { key: "4", label: "Eliminar ciudad" },
    { key: "5", label: "Establecer ciudad default" },
    { key: "6", label: "Pronóstico 7 días" },
    { key: "7", label: "Listar ciudades guardadas" },
    { key: "8", label: `Ajustes (${unitSymbol(state.settings.unit)})` },
    { key: EXIT_OPTION, label: "Salir" },
  ];
}

export function renderMenu(colors: Colors, options: MenuOption[]): void {
  const box = colors.bold(colors.cyan("══════════════════════════════════════════════"));
  const title = colors.bold(colors.cyan("         WEATHER CLI"));
  const lines = [
    box,
    title,
    box,
    ...options.map((option) => `  ${colors.cyan(option.key)}. ${option.label}`),
    box,
  ];
  console.log(lines.join("\n"));
}
