import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Rendeles.css";

function Rendeles() {
  const [mode, setMode] = useState("guest");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    setIsAuthenticated(true);
    navigate("/etlap");
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
            className={`btn ${mode === "login" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMode("login")}
            type="button"
          >
            Bejelentkezés
          </button>

          <button
            className={`btn ${mode === "register" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMode("register")}
            type="button"
          >
            Regisztráció
          </button>

          <button
            className="btn btn-outline"
            onClick={() => {
              setMode("guest");
              navigate("/etlap");
            }}
            type="button"
          >
            Vendégként rendelek
          </button>
        </div>

        {mode === "login" && (
          <div className="panel">
            <h2 className="panel-title">Bejelentkezés</h2>
            <form onSubmit={handleLogin} className="form">
              <div className="field">
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="pl. teszt@pelda.hu" />
              </div>

              <div className="field">
                <label className="label">Jelszó</label>
                <input className="input" type="password" placeholder="••••••••" />
              </div>

              <button className="btn btn-primary btn-wide" type="submit">
                Belépés
              </button>
            </form>
          </div>
        )}

        {mode === "register" && (
          <div className="panel">
            <h2 className="panel-title">Regisztráció</h2>
            <form onSubmit={handleLogin} className="form">
              <div className="field">
                <label className="label">Felhasználónév</label>
                <input className="input" type="text" placeholder="pl. Pizzafan123" />
              </div>

              <div className="field">
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="pl. teszt@pelda.hu" />
              </div>

              <div className="field">
                <label className="label">Jelszó</label>
                <input className="input" type="password" placeholder="Legalább 8 karakter" />
              </div>

              <button className="btn btn-primary btn-wide" type="submit">
                Regisztráció
              </button>
            </form>
          </div>
        )}

        <div className="auth-row">
          <span className="auth-label">Bejelentkezve:</span>
          <span className={`pill ${isAuthenticated ? "pill-ok" : "pill-no"}`}>
            {isAuthenticated ? "igen" : "nem"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Rendeles;
