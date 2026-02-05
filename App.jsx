// src/App.jsx - 2025.12.02 
import { Routes, Route } from "react-router-dom";
import Header from "./main_pages/Header.jsx";
import Footer from "./main_pages/Footer.jsx";
import Kezdolap from "./pages/Kezdolap.jsx";
import Etlap from "./pages/Etlap.jsx";
import Rolunk from "./pages/Rolunk.jsx";
import Rendeles from "./pages/Rendeles.jsx";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Kezdolap />} />
        <Route path="/etlap" element={<Etlap />} />
        <Route path="/rolunk" element={<Rolunk />} />
        <Route path="/rendeles" element={<Rendeles />} />
      </Routes>

 
    </>
  );
}

export default App;
