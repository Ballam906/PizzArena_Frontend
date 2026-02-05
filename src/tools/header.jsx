import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <nav>
      <ul class="menu-settings">
        <li><Link to="/fooldal">Kezdőlap</Link></li>
        <li><Link to="/etlap">Étlap</Link></li>
        <li><Link to="/kosar">Kosár</Link></li>
        <li><Link to="/login">Belépés</Link></li>
      </ul>
    </nav>
  );
}

export default Header;
