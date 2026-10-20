import { spyOn, type Mock } from "bun:test";

export type FetchMock = Mock<typeof fetch>;

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function mockFetch(handler: (url: string) => Response | Promise<Response>): FetchMock {
  const implementation = ((input: Parameters<typeof fetch>[0]) =>
    handler(String(input))) as typeof fetch;
  return spyOn(globalThis, "fetch").mockImplementation(implementation);
}
