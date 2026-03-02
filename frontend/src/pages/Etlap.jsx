import { useState } from "react";
import { TermekLista } from "../components/TermekLista.jsx";
import { Link } from "react-router-dom";
import "../assets/css/Etlap.css";

function Etlap() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <>
      <header>
        <ul>
          <li><Link to="/etlap">Termékek</Link></li>
          <li><Link to="/kosar">🛒</Link></li>
        </ul>
      </header>

      <TermekLista category={selectedCategory} />
    </>
  );
}

export default Etlap;