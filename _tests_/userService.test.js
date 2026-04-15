import { describe, test, expect, afterEach, vi } from "vitest";
import * as userService from "../src/api/userService.js";

describe("userService", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  test("getPublicUser visszaadja az eredményt helyes válasz esetén", async () => {
    globalThis.fetch = vi.fn(async () => ({
      status: 200,
      ok: true,
      text: async () =>
        JSON.stringify({
          message: "",
          result: { id: 1, name: "Alice" }
        })
    }));

    const res = await userService.getPublicUser(1);

    expect(res).toEqual({ id: 1, name: "Alice" });
  });

  test("getAllPublicUsers tömböt ad vissza", async () => {
    globalThis.fetch = vi.fn(async () => ({
      status: 200,
      ok: true,
      text: async () =>
        JSON.stringify({
          message: "",
          result: [{ id: 1 }, { id: 2 }]
        })
    }));

    const res = await userService.getAllPublicUsers();

    expect(res).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test("401 válasz esetén hibát dob", async () => {
    globalThis.fetch = vi.fn(async () => ({
      status: 401,
      ok: false,
      text: async () => ""
    }));

    await expect(userService.getPublicUser(2)).rejects.toThrow("Nincs jogosultság.");
  });

  test("érvénytelen JSON esetén hibát dob", async () => {
    globalThis.fetch = vi.fn(async () => ({
      status: 200,
      ok: true,
      text: async () => "not-json"
    }));

    await expect(userService.getPublicUser(3)).rejects.toThrow(
      "Érvénytelen JSON válasz érkezett a szervertől."
    );
  });
});