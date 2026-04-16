import { Link } from "react-router-dom";
import { useState } from "react";
import "../assets/css/Header.css";
import pizzarenaLogo from "../assets/images/uj_pizzarena_logo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav__logo" onClick={closeMenu}>
          <img src={pizzarenaLogo} alt="Pizzarena logó" />
        </Link>

        <button
          type="button"
          className={`nav__toggle ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Menü bezárása" : "Menü megnyitása"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav__menu ${menuOpen ? "active" : ""}`}>
          <ul className="nav__links">
            <li>
              <Link to="/etlap" className="nav__link" onClick={closeMenu}>
                Étlap
              </Link>
            </li>
            <li>
              <Link to="/rolunk" className="nav__link" onClick={closeMenu}>
                Éttermeink
              </Link>
            </li>
            <li>
              <Link to="/fiok" className="nav__link" onClick={closeMenu}>
                Fiók
              </Link>
            </li>
          </ul>

          <Link
            to="/rendeles"
            className="nav__order-btn"
            onClick={closeMenu}
          >
            Add le a rendelésed!
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;