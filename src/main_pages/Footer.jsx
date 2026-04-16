import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/css/Footer.css";
import pizzarenaLogo from "../assets/images/uj_pizzarena_logo.png";

function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  async function fetchGlobalSettings() {
    try {
      const res = await fetch("/api/GlobalSettings", {
        method: "GET"
      });

      if (!res.ok) {
        throw new Error("Nem sikerült lekérni a GlobalSettings adatokat.");
      }

      const text = await res.text();
      const data = JSON.parse(text);
      setSettings(data);
    } catch (error) {
      console.error("Hiba a GlobalSettings lekérésekor:", error);
    }
  }

  function formatUrl(url) {
    if (!url) return "#";
    if (!url.startsWith("http")) {
      return "https://" + url;
    }
    return url;
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <img
            src={pizzarenaLogo}
            alt="PizzArena Logo"
            title="PizzArena Logo"
            className="footer-logo"
          />
          <p>
            Friss alapanyagok, olasz hangulat, igazi pizzák. A PizzArena célja,
            hogy minden rendelés élmény legyen.
          </p>
        </div>

        <div className="footer-section">
          <h3>Navigáció</h3>
          <ul>
            <li><Link to="/">Főoldal</Link></li>
            <li><Link to="/etlap">Étlap</Link></li>
            <li><Link to="/rolunk">Éttermünk</Link></li>
            <li><Link to="/rendeles">Rendelés</Link></li>
            <li><Link to="/fiok">Fiók</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Kapcsolat</h3>
          <ul>
            <li>Magyarország</li>
            <li>{settings?.contactEmail || "Betöltés..."}</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Kövess minket</h3>
          <ul>
            <li>
              <a
                href={formatUrl(settings?.facebookUrl)}
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={formatUrl(settings?.instagramUrl)}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 PizzArena. Minden jog fenntartva.</p>
        <div className="footer-bottom-links">
          <Link to="/adatvedelem">Adatvédelem</Link>
          <Link to="/aszf">ÁSZF</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;