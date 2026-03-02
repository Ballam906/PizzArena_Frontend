// src/pages/Rendeles.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Rendeles.css";

function Rendeles() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("guest");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [notice, setNotice] = useState(null); // { type: "success" | "error" | "info", text: string }

  const isAuthenticated = useMemo(() => {
    const t = localStorage.getItem("token");
    return !!t && t !== "undefined" && t !== "null";
  }, [notice]);

  function show(type, text) {
    setNotice({ type, text });
  }

  function clearNotice() {
    setNotice(null);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
    show("info", "Kijelentkezve.");
  }

  async function readJsonSafe(res) {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : {};
    } catch {
      return {};
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    clearNotice();

    const payload = {
      userName: loginUsername.trim(),
      password: loginPassword
    };

    let res;
    try {
      res = await fetch("/api/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      show("error", "Hálózati hiba. Ellenőrizd a backend futását.");
      return;
    }

    const data = await readJsonSafe(res);

    if (!res.ok) {
      show("error", data?.message || "Sikertelen bejelentkezés.");
      return;
    }

    if (!data.token) {
      show("error", data?.message || "Nem sikerült bejelentkezni (nincs token).");
      return;
    }

    // ✅ Mentés localStorage-be
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.result.id);
    localStorage.setItem("userData", JSON.stringify({
      CustomerName: data.result.userName,
      CustomerEmail: data.result.email
    }));

    show("success", data?.message || "Sikeres bejelentkezés!");
    navigate("/fiok"); // átirányítás fiók oldalra
  }

  async function handleRegister(e) {
    e.preventDefault();
    clearNotice();

    const payload = {
      userName: registerUsername.trim(),
      email: registerEmail.trim(),
      password: registerPassword
    };

    let res;
    try {
      res = await fetch("/api/User/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      show("error", "Hálózati hiba. Ellenőrizd a backend futását.");
      return;
    }

    const data = await readJsonSafe(res);

    if (!res.ok) {
      const msg = data?.message || "Sikertelen regisztráció.";
      show("error", msg);
      return;
    }

    show("success", "Sikeres regisztráció. Most jelentkezz be.");
    setMode("login");

    setLoginUsername(registerUsername.trim());
    setLoginPassword("");
  }

  return (
    <div className="rendeles-page">
      <div className="rendeles-card">
        <h1 className="rendeles-title">Rendelés</h1>
        <p className="rendeles-subtitle">Válaszd ki, hogyan szeretnél továbblépni.</p>

        <div className="rendeles-actions">
          <button
            className={`btn ${mode === "login" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => { setMode("login"); clearNotice(); }}
            type="button"
          >
            Bejelentkezés
          </button>

          <button
            className={`btn ${mode === "register" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => { setMode("register"); clearNotice(); }}
            type="button"
          >
            Regisztráció
          </button>

          <button
            className="btn btn-outline"
            onClick={() => navigate("/etlap")}
            type="button"
          >
            Vendégként rendelek
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
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button className="btn btn-primary btn-wide" type="submit">
                Belépés
              </button>
              {isAuthenticated && (
                <button className="btn btn-ghost btn-wide" type="button" onClick={logout}>
                  Kijelentkezés
                </button>
              )}
            </form>
          </div>
        )}

        {mode === "register" && (
          <div className="panel">
            <h2 className="panel-title">Regisztráció</h2>
            <form onSubmit={handleRegister} className="form">
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