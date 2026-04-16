import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Rendeles.css";

function Rendeles() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [notice, setNotice] = useState(null);

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token && token !== "undefined" && token !== "null";

  function showNotice(type, text) {
    setNotice({ type, text });
  }

  function clearNotice() {
    setNotice(null);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
    showNotice("info", "Kijelentkezve.");
  }

  async function readJsonSafe(response) {
    const text = await response.text();

    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return { raw: text };
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    clearNotice();

    const userName = loginUsername.trim();

    if (!userName || !loginPassword) {
      showNotice("error", "A felhasználónév és a jelszó megadása kötelező.");
      return;
    }

    const payload = {
      userName: userName,
      password: loginPassword
    };

    let response;

    try {
      response = await fetch("/api/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      showNotice("error", "Hálózati hiba. Ellenőrizd a backend futását.");
      return;
    }

    const data = await readJsonSafe(response);

    if (!response.ok) {
      showNotice("error", data?.message || data?.raw || "Sikertelen bejelentkezés.");
      return;
    }

    if (!data?.token) {
      showNotice("error", data?.message || data?.raw || "Nem sikerült bejelentkezni.");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        CustomerName: data?.result?.userName || userName,
        CustomerEmail: data?.result?.email || ""
      })
    );

    showNotice("success", data?.message || "Sikeres bejelentkezés.");
    navigate("/etlap");
  }

  async function handleRegister(e) {
    e.preventDefault();
    clearNotice();

    const userName = registerUsername.trim();
    const email = registerEmail.trim();

    if (!userName || !email || !registerPassword) {
      showNotice("error", "Minden mező kitöltése kötelező.");
      return;
    }

    const payload = {
      userName: userName,
      email: email,
      password: registerPassword
    };

    let response;

    try {
      response = await fetch("/api/User/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      showNotice("error", "Hálózati hiba. Ellenőrizd a backend futását.");
      return;
    }

    const data = await readJsonSafe(response);

    if (!response.ok) {
      showNotice("error", data?.message || data?.raw || "Sikertelen regisztráció.");
      return;
    }

    showNotice("success", data?.message || "Sikeres regisztráció. Most jelentkezz be.");
    setMode("login");
    setLoginUsername(userName);
    setLoginPassword("");
    setRegisterPassword("");
  }

  return (
    <div className="rendeles-page">
      <div className="rendeles-card">
        <h1 className="rendeles-title">Rendelés</h1>
        <p className="rendeles-subtitle">
          Válaszd ki, hogyan szeretnél továbblépni.
        </p>

        <div className="rendeles-actions">
          <button
            type="button"
            className={`btn ${mode === "login" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => {
              setMode("login");
              clearNotice();
            }}
          >
            Bejelentkezés
          </button>

          <button
            type="button"
            className={`btn ${mode === "register" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => {
              setMode("register");
              clearNotice();
            }}
          >
            Regisztráció
          </button>
        </div>

        {notice && (
          <div className={`notice notice-${notice.type}`}>
            {notice.text}
          </div>
        )}

        {mode === "login" && (
          <div className="panel">
            <h2 className="panel-title">Bejelentkezés</h2>

            <form onSubmit={handleLogin} className="form">
              <input
                className="input"
                type="text"
                placeholder="pl. Pizzafan123"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />

              <input
                className="input"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <button className="btn btn-primary btn-wide" type="submit">
                Belépés
              </button>

              {isAuthenticated && (
                <button
                  className="btn btn-ghost btn-wide"
                  type="button"
                  onClick={logout}
                >
                  Kijelentkezés
                </button>
              )}
            </form>
          </div>
        )}

        {mode === "register" && (
          <div className="panel">
            <h2 className="panel-title">Regisztráció</h2>

            <form onSubmit={handleRegister} className="form" id="register-form">
              <input
                className="input"
                type="text"
                placeholder="pl. Pizzafan123"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />

              <input
                className="input"
                type="email"
                placeholder="valami@gmail.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />

              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />

              <button className="btn btn-primary btn-wide" type="submit">
                Regisztráció
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rendeles;