import { describe, expect, test } from "bun:test";
import { describeWeatherCode } from "../../src/utils/weatherCodes.ts";

describe("describeWeatherCode", () => {
  test("describe un código conocido", () => {
    expect(describeWeatherCode(0)).toBe("Cielo despejado");
    expect(describeWeatherCode(61)).toBe("Lluvia ligera");
    expect(describeWeatherCode(95)).toBe("Tormenta eléctrica");
  });

  test("devuelve Desconocido para códigos no soportados", () => {
    expect(describeWeatherCode(1234)).toBe("Desconocido");
  });

  test("trata null como cielo despejado", () => {
    expect(describeWeatherCode(null)).toBe("Cielo despejado");
  });

  test("trata undefined como cielo despejado", () => {
    expect(describeWeatherCode(undefined)).toBe("Cielo despejado");
  });
});
