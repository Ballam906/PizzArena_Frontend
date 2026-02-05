// src/main_pages/Header.jsx

import { Link } from "react-router-dom";
import "../assets/css/Footer.css";
import pizzarenaLogo from "../assets/images/pizzarena_logo.png";

function Footer() {
  return (
    <footer> 
        <ul>
            <li><img src={pizzarenaLogo} alt="PizzArena Logo" title="PizzArena Logo" /></li>
        </ul>
        <ul className="FooterListaBeallitasa">
            <li><Link to="/etlap">Étlap</Link></li>
            <li><Link to="/rolunk">Éttermünk</Link></li>
            <li><Link to="/rendeles">Rendelés</Link></li>
        </ul>
        <ul>
           <li></li>
           <li></li>
           <li></li>
        </ul>
    </footer>
  );
}

export default Footer;
