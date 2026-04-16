import { test, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import Rendeles from "../src/pages/Rendeles.jsx";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

function renderRendeles() {
  render(
    <MemoryRouter>
      <Rendeles />
    </MemoryRouter>
  );
}

function fillLoginForm(username, password) {
  const inputs = screen.getAllByPlaceholderText(/pl\. Pizzafan123|••••••••/);

  fireEvent.change(inputs[0], { target: { value: username } });
  fireEvent.change(inputs[1], { target: { value: password } });
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  globalThis.fetch = vi.fn();
});

test("alapból a bejelentkezés panel jelenik meg", () => {
  renderRendeles();

  expect(screen.getByText("Rendelés")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Bejelentkezés" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Belépés" })).toBeInTheDocument();
});

test("átvált regisztráció panelre", () => {
  renderRendeles();

  fireEvent.click(screen.getAllByRole("button", { name: /^Regisztráció$/ })[0]);

  expect(screen.getByRole("heading", { name: "Regisztráció" })).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: /^Regisztráció$/ })).toHaveLength(2);
  expect(screen.getByPlaceholderText("valami@gmail.com")).toBeInTheDocument();
});

test("sikeres bejelentkezésnél token mentődik és navigál", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    text: async () =>
      JSON.stringify({
        token: "fake-jwt-token",
        message: "Sikeres bejelentkezés!",
        result: {
          userName: "Teszt Elek",
          email: "teszt@email.com"
        }
      })
  });

  renderRendeles();
  fillLoginForm("TesztElek", "titok123");

  fireEvent.click(screen.getByRole("button", { name: "Belépés" }));

  await waitFor(() => {
    expect(localStorage.getItem("token")).toBe("fake-jwt-token");
  });

  expect(JSON.parse(localStorage.getItem("userData"))).toEqual({
    CustomerName: "Teszt Elek",
    CustomerEmail: "teszt@email.com"
  });

  expect(mockNavigate).toHaveBeenCalledWith("/etlap");
});

test("hibás bejelentkezésnél hibaüzenet jelenik meg", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: false,
    status: 401,
    text: async () =>
      JSON.stringify({
        message: "Hibás felhasználónév vagy jelszó."
      })
  });

  renderRendeles();
  fillLoginForm("rosszuser", "rosszjelszo");

  fireEvent.click(screen.getByRole("button", { name: "Belépés" }));

  await waitFor(() => {
    expect(screen.getByText("Hibás felhasználónév vagy jelszó.")).toBeInTheDocument();
  });
});

test("ha nincs token a válaszban, hibaüzenet jelenik meg", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    text: async () =>
      JSON.stringify({
        message: "Nincs token"
      })
  });

  renderRendeles();
  fillLoginForm("teszt", "teszt123");

  fireEvent.click(screen.getByRole("button", { name: "Belépés" }));

  await waitFor(() => {
    expect(screen.getByText("Nincs token")).toBeInTheDocument();
  });
});

test("hálózati hiba esetén bejelentkezésnél hibaüzenet jelenik meg", async () => {
  globalThis.fetch.mockRejectedValue(new Error("Network error"));

  renderRendeles();
  fillLoginForm("teszt", "teszt123");

  fireEvent.click(screen.getByRole("button", { name: "Belépés" }));

  await waitFor(() => {
    expect(
      screen.getByText("Hálózati hiba. Ellenőrizd a backend futását.")
    ).toBeInTheDocument();
  });
});

test("sikeres regisztráció után visszavált bejelentkezésre", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: true,
    status: 200,
    text: async () =>
      JSON.stringify({
        message: "Sikeres regisztráció. Most jelentkezz be."
      })
  });

  renderRendeles();

  fireEvent.click(screen.getAllByRole("button", { name: /^Regisztráció$/ })[0]);

  fireEvent.change(screen.getByPlaceholderText("pl. Pizzafan123"), {
    target: { value: "ujfelhasznalo" }
  });
  fireEvent.change(screen.getByPlaceholderText("valami@gmail.com"), {
    target: { value: "uj@email.com" }
  });
  fireEvent.change(screen.getByPlaceholderText("••••••••"), {
    target: { value: "jelszo123" }
  });

  fireEvent.click(screen.getAllByRole("button", { name: /^Regisztráció$/ })[1]);

  await waitFor(() => {
    expect(
      screen.getByText("Sikeres regisztráció. Most jelentkezz be.")
    ).toBeInTheDocument();
  });

  expect(screen.getByRole("heading", { name: "Bejelentkezés" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Belépés" })).toBeInTheDocument();
});

test("sikertelen regisztrációnál hibaüzenet jelenik meg", async () => {
  globalThis.fetch.mockResolvedValue({
    ok: false,
    status: 400,
    text: async () =>
      JSON.stringify({
        message: "Sikertelen regisztráció."
      })
  });

  renderRendeles();

  fireEvent.click(screen.getAllByRole("button", { name: /^Regisztráció$/ })[0]);

  fireEvent.change(screen.getByPlaceholderText("pl. Pizzafan123"), {
    target: { value: "ujfelhasznalo" }
  });
  fireEvent.change(screen.getByPlaceholderText("valami@gmail.com"), {
    target: { value: "uj@email.com" }
  });
  fireEvent.change(screen.getByPlaceholderText("••••••••"), {
    target: { value: "jelszo123" }
  });

  fireEvent.click(screen.getAllByRole("button", { name: /^Regisztráció$/ })[1]);

  await waitFor(() => {
    expect(screen.getByText("Sikertelen regisztráció.")).toBeInTheDocument();
  });
});

test("ha van token, megjelenik a kijelentkezés gomb", () => {
  localStorage.setItem("token", "fake-token");

  renderRendeles();

  expect(screen.getByRole("button", { name: "Kijelentkezés" })).toBeInTheDocument();
});

test("kijelentkezés törli a localStorage adatokat", () => {
  localStorage.setItem("token", "fake-token");
  localStorage.setItem("userId", "123");
  localStorage.setItem("userData", JSON.stringify({ name: "Teszt" }));

  renderRendeles();

  fireEvent.click(screen.getByRole("button", { name: "Kijelentkezés" }));

  expect(localStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("userId")).toBeNull();
  expect(localStorage.getItem("userData")).toBeNull();
  expect(screen.getByText("Kijelentkezve.")).toBeInTheDocument();
});