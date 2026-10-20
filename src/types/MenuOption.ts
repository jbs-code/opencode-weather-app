import type { AppState } from "./AppState.ts";
import type { Colors } from "./Colors.ts";
import type { Readline } from "./Readline.ts";

export interface MenuOption {
  key: string;
  label: string;
}

export type MenuAction = (
  state: AppState,
  rl: Readline,
  colors: Colors
) => Promise<AppState>;
