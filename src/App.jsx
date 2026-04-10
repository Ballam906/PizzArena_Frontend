import { Routes, Route } from "react-router-dom";
import Header from "./main_pages/Header.jsx";
import Footer from "./main_pages/Footer.jsx";
import Kezdolap from "./pages/Kezdolap.jsx";
import Etlap from "./pages/Etlap.jsx";
import Rolunk from "./pages/Rolunk.jsx";
import Rendeles from "./pages/Rendeles.jsx";
import Kosar from "./pages/Kosar.jsx";
import Fiok from "./pages/Fiokosszesito.jsx";
import Adatvedelem from "./pages/Adatvedelem.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Kezdolap />} />
        <Route path="/etlap" element={<Etlap />} />
        <Route path="/kosar" element={<Kosar />} />
        <Route path="/rolunk" element={<Rolunk />} />
        <Route path="/fiok" element={<Fiok />} />
        <Route path="/rendeles" element={<Rendeles />} />
        <Route path="/adatvedelem" element={<Adatvedelem />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;