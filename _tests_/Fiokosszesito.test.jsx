import { test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import Fiokosszesito from "../src/pages/Fiokosszesito.jsx";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  global.fetch = vi.fn();
});

test("megjelenik a cím és user adatok", async () => {
  localStorage.setItem("token", "fake-token");
  localStorage.setItem(
    "userData",
    JSON.stringify({
      CustomerName: "Teszt Elek",
      CustomerEmail: "teszt@email.com"
    })
  );

  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () => JSON.stringify([])
  });

  render(
    <MemoryRouter>
      <Fiokosszesito />
    </MemoryRouter>
  );

  expect(screen.getByText("Felhasználói fiók")).toBeInTheDocument();
  expect(screen.getByText(/Teszt Elek/)).toBeInTheDocument();
  expect(screen.getByText(/teszt@email.com/)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("Nincs rendelésed még.")).toBeInTheDocument();
  });
});

test("rendelés megjelenik és státusz szöveggé alakul", async () => {
  localStorage.setItem("token", "fake-token");
  localStorage.setItem(
    "userData",
    JSON.stringify({
      CustomerName: "Teszt Elek",
      CustomerEmail: "teszt@email.com"
    })
  );

  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () =>
      JSON.stringify([
        {
          id: 1,
          customerName: "Teszt Elek",
          status: 0,
          orderTime: "2026-04-10T10:00:00",
          orderItems: [{ itemPrice: 1000, piece: 2 }]
        }
      ])
  });

  render(
    <MemoryRouter>
      <Fiokosszesito />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Feldolgozás alatt")).toBeInTheDocument();
  });

  expect(screen.getByText("2000 Ft")).toBeInTheDocument();
});

test("ha nincs userData, átirányít a rendelés oldalra", () => {
  localStorage.setItem("token", "fake-token");

  render(
    <MemoryRouter>
      <Fiokosszesito />
    </MemoryRouter>
  );

  expect(mockNavigate).toHaveBeenCalledWith("/rendeles");
});

test("ha nincs token, átirányít a rendelés oldalra", () => {
  localStorage.setItem(
    "userData",
    JSON.stringify({
      CustomerName: "Teszt Elek",
      CustomerEmail: "teszt@email.com"
    })
  );

  render(
    <MemoryRouter>
      <Fiokosszesito />
    </MemoryRouter>
  );

  expect(mockNavigate).toHaveBeenCalledWith("/rendeles");
});

test("401 esetén hibaüzenet jelenik meg", async () => {
  localStorage.setItem("token", "fake-token");
  localStorage.setItem(
    "userData",
    JSON.stringify({
      CustomerName: "Teszt Elek",
      CustomerEmail: "teszt@email.com"
    })
  );

  global.fetch.mockResolvedValue({
    ok: false,
    status: 401,
    statusText: "Unauthorized",
    text: async () => ""
  });

  render(
    <MemoryRouter>
      <Fiokosszesito />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(
      screen.getByText("Nincs jogosultság vagy lejárt token.")
    ).toBeInTheDocument();
  });
});

test("kijelentkezés törli a localStorage adatokat és átirányít", async () => {
  localStorage.setItem("token", "fake-token");
  localStorage.setItem("userId", "123");
  localStorage.setItem(
    "userData",
    JSON.stringify({
      CustomerName: "Teszt Elek",
      CustomerEmail: "teszt@email.com"
    })
  );

  global.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () => JSON.stringify([])
  });

  render(
    <MemoryRouter>
      <Fiokosszesito />
    </MemoryRouter>
  );

  const logoutButton = await screen.findByText("Kijelentkezés");
  fireEvent.click(logoutButton);

  expect(localStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("userId")).toBeNull();
  expect(localStorage.getItem("userData")).toBeNull();
  expect(mockNavigate).toHaveBeenCalledWith("/rendeles");
});