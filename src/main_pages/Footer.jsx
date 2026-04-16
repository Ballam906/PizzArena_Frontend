import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/css/Footer.css";
import pizzarenaLogo from "../assets/images/uj_pizzarena_logo.png";

function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchGlobalSettings() {
      try {
        const res = await fetch("/api/GlobalSettings", {
          method: "GET"
        });

        if (!res.ok) {
          setSettings(null);
          return;
        }

        const text = await res.text();

        if (!text) {
          setSettings(null);
          return;
        }

        try {
          const data = JSON.parse(text);
          setSettings(data);
        } catch {
          setSettings(null);
        }
      } catch {
        setSettings(null);
      }
    }

    fetchGlobalSettings();
  }, []);

  function formatUrl(url) {
    if (!url) {
      return "#";
    }

    if (!url.startsWith("http")) {
      return "https://" + url;
    }

    return url;
  }

  const contactEmail = settings?.contactEmail || "Betöltés...";
  const facebookUrl = settings?.facebookUrl || "";
  const instagramUrl = settings?.instagramUrl || "";

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section footer-brand">
          <img
            src={pizzarenaLogo}
            alt="PizzArena logó"
            title="PizzArena logó"
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
            <li>{contactEmail}</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Kövess minket</h3>
          <ul>
            <li>
              <a
                href={formatUrl(facebookUrl)}
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={formatUrl(instagramUrl)}
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
        </div>
      </div>
    </footer>
  );
}

export default Footer;