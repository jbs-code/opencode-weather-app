import type { City, CitySelection } from "../types/City.ts";
import type { Colors } from "../types/Colors.ts";
import type { Readline } from "../types/Readline.ts";
import * as readline from "node:readline/promises";

export function createInput(): Readline {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function closeInput(rl: Readline): void {
  rl.close();
}

export async function ask(rl: Readline, message: string): Promise<string> {
  return rl.question(message);
}

export interface SelectCityOptions {
  title?: string;
  defaultCityId?: string | null;
}

export async function selectCity(
  rl: Readline,
  cities: City[],
  colors: Colors,
  options: SelectCityOptions = {}
): Promise<CitySelection> {
  const title = options.title ?? "\nCiudades registradas:";
  console.log(title);
  cities.forEach((city, index) => {
    const marker = city.id === options.defaultCityId ? " (default)" : "";
    console.log(`  ${index + 1}. ${city.name}${marker}`);
  });

  const hasDefault = cities.some((city) => city.id === options.defaultCityId);
  const hint = hasDefault ? " (Enter para la default)" : "";
  const answer = (await ask(rl, `  Número de ciudad${hint}: `)).trim();

  if (answer === "") {
    const fallback = cities.find((city) => city.id === options.defaultCityId);
    return fallback ? { kind: "selected", city: fallback } : { kind: "cancelled" };
  }

  const index = Number.parseInt(answer, 10) - 1;
  if (Number.isNaN(index) || index < 0 || index >= cities.length) return { kind: "invalid" };

  return { kind: "selected", city: cities[index]! };
}
