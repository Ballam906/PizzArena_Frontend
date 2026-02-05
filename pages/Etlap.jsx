// src/pages/Etlap.jsx - 2025.12.02 
import { TermekLista } from "../components/TermekLista.jsx";
import { Link } from "react-router-dom";

function Etlap() {
  return (
    <>
        <header>
        <ul>
          <li><Link to="/etlap">Termékek</Link></li>
          <li><Link to="/kosar">🛒</Link></li>
        </ul>
      </header>
    
         <TermekLista />
    </>
  )
}

export default Etlap
