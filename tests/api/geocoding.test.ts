import { afterEach, describe, expect, test } from "bun:test";
import { geocodeCity } from "../../src/api/geocoding.ts";
import { jsonResponse, mockFetch, type FetchMock } from "../helpers/fetch.ts";

let fetchMock: FetchMock | undefined;

afterEach(() => {
  fetchMock?.mockRestore();
  fetchMock = undefined;
});

describe("geocodeCity", () => {
  test("consulta la API con el nombre codificado y los parámetros esperados", async () => {
    fetchMock = mockFetch(() => jsonResponse({ results: [] }));

    await geocodeCity("Ciudad de México");

    const url = fetchMock.mock.calls[0]![0] as string;
    expect(url).toContain("name=Ciudad%20de%20M%C3%A9xico");
    expect(url).toContain("count=1");
    expect(url).toContain("language=es");
    expect(url).toContain("format=json");
  });

  test("mapea el primer resultado a una ciudad", async () => {
    fetchMock = mockFetch(() =>
      jsonResponse({
        results: [
          { name: "Ottawa", latitude: 45.41117, longitude: -75.69812, country: "Canadá", country_code: "CA" },
        ],
      })
    );

    const city = await geocodeCity("Ottawa");

    expect(city).not.toBeNull();
    expect(city!.name).toBe("Ottawa");
    expect(city!.latitude).toBe(45.41117);
    expect(city!.longitude).toBe(-75.69812);
    expect(city!.country).toBe("Canadá");
    expect(city!.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  test("usa country_code cuando no viene country", async () => {
    fetchMock = mockFetch(() =>
      jsonResponse({
        results: [{ name: "Lima", latitude: -12.04, longitude: -77.03, country_code: "PE" }],
      })
    );

    const city = await geocodeCity("Lima");

    expect(city!.country).toBe("PE");
  });

  test("devuelve null cuando la API no responde correctamente", async () => {
    fetchMock = mockFetch(() => jsonResponse({}, 500));

    expect(await geocodeCity("Ottawa")).toBeNull();
  });

  test("devuelve null cuando no hay resultados", async () => {
    fetchMock = mockFetch(() => jsonResponse({ results: [] }));

    expect(await geocodeCity("Ciudad inexistente")).toBeNull();
  });

  test("devuelve null cuando la respuesta no trae results", async () => {
    fetchMock = mockFetch(() => jsonResponse({}));

    expect(await geocodeCity("Ottawa")).toBeNull();
  });
});
