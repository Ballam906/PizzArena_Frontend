import { Link } from "react-router-dom";
import "../assets/css/Header.css";
import pizzarenaLogo from "../assets/images/pizzarena_logo.png";

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav__logo">
          <img src={pizzarenaLogo} alt="Pizzarena logó" />
          <span className="nav__brand">Pizzarena</span>
        </Link>

        <ul className="nav__links">
          <li>
            <Link to="/etlap" className="nav__link">
              Étlap
            </Link>
          </li>
          <li>
            <Link to="/rolunk" className="nav__link">
              Éttermeink
            </Link>
          </li>
        </ul>

        <Link to="/rendeles" className="nav__order-btn">
          Add le a rendelésed!
        </Link>
      </nav>
    </header>
  );
}

export default Header;
