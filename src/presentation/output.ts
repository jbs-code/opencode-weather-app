import type { Colors } from "../types/Colors.ts";

export function success(colors: Colors, message: string): void {
  console.log(colors.green(message));
  console.log("");
}

export function error(colors: Colors, message: string): void {
  console.log(colors.red(message));
  console.log("");
}

export function warn(colors: Colors, message: string): void {
  console.log(colors.yellow(message));
  console.log("");
}

export function info(colors: Colors, message: string): void {
  console.log(message);
  console.log("");
}

export function loading(colors: Colors, message: string): void {
  console.log(colors.dim(message));
}
