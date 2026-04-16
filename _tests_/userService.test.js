import { describe, test, expect, afterEach, vi } from "vitest";
import * as userService from "../src/api/userService.js";

describe("userService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function mockFetch({ status, ok, text }) {
    globalThis.fetch = vi.fn(async () => ({
      status,
      ok,
      text: async () => text
    }));
  }

  test("getPublicUser visszaadja az eredményt helyes válasz esetén", async () => {
    mockFetch({
      status: 200,
      ok: true,
      text: JSON.stringify({
        message: "",
        result: { id: 1, name: "Alice" }
      })
    });

    const result = await userService.getPublicUser(1);

    expect(result).toEqual({ id: 1, name: "Alice" });
  });

  test("getAllPublicUsers tömböt ad vissza", async () => {
    mockFetch({
      status: 200,
      ok: true,
      text: JSON.stringify({
        message: "",
        result: [{ id: 1 }, { id: 2 }]
      })
    });

    const result = await userService.getAllPublicUsers();

    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test("401 válasz esetén hibát dob", async () => {
    mockFetch({
      status: 401,
      ok: false,
      text: ""
    });

    await expect(userService.getPublicUser(2)).rejects.toThrow("Nincs jogosultság.");
  });

  test("érvénytelen JSON esetén hibát dob", async () => {
    mockFetch({
      status: 200,
      ok: true,
      text: "not-json"
    });

    await expect(userService.getPublicUser(3)).rejects.toThrow(
      "Érvénytelen JSON válasz érkezett a szervertől."
    );
  });

  test("nem sikeres válasz esetén hibát dob", async () => {
    mockFetch({
      status: 500,
      ok: false,
      text: ""
    });

    await expect(userService.getPublicUser(1)).rejects.toThrow("Sikertelen lekérés.");
  });

  test("getAllPublicUsers esetén is hibát dob érvénytelen JSON-nál", async () => {
    mockFetch({
      status: 200,
      ok: true,
      text: "not-json"
    });

    await expect(userService.getAllPublicUsers()).rejects.toThrow(
      "Érvénytelen JSON válasz érkezett a szervertől."
    );
  });
});