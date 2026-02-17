import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Rendeles.css";

function Rendeles() {
  const [mode, setMode] = useState("guest");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");


  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    const payload = {
      userName: loginUsername,   // vagy username, amit a backend vár
      password: loginPassword
    };
    
    const res = await fetch(`/api/User/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // próbálj JSON hibát, ha nincs, fallback
      let msg = "Sikertelen bejelentkezés";
      try { msg = (await res.json()).message ?? msg; } catch {}
      setError(msg);
      return;
    }

    const data = await res.json();
    console.log("LOGIN DATA:", data);
    // ha kapsz tokent:
    localStorage.setItem("token", data.token);
    setIsAuthenticated(true);
    navigate("/etlap");

  }

    async function handleRegister(event){
      event.preventDefault()
      const payregister = {
          userName: registerUsername,
          email: registerEmail,
          password: registerPassword
      };

      const res = await fetch("/api/User/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payregister)
      });

      if (!res.ok) {
        // próbálj JSON hibát, ha nincs, fallback
        let msg = "Sikertelen regisztráció!";
        try { msg = (await res.json()).message ?? msg; } catch {}
        setError(msg);
        return;
      }
      const data = await res.json();
      let msg = "Sikeres regisztráció!";
      console.log("REGISTER DATA:", data);
      setError(msg);
      setMode("login");
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

              <input className="input" 
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
