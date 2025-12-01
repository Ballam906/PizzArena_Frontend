import Header from "./tools/header.jsx";
import Footer from "./tools/footer.jsx";
import { Routes, Route } from "react-router-dom";
import Etlap from "./pages/etlap.jsx";
import Kosar from "./pages/kosar.jsx";
import Login from "./pages/login.jsx";
import Fooldal from "./tools/fooldal.jsx";
import "./App.css";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/fooldal" element={<Fooldal />} />
        <Route path="/etlap" element={<Etlap />} />
        <Route path="/kosar" element={<Kosar />} />
        <Route path="/login" element={<Login />} />
      </Routes>

        <Footer />
    </>
  );
}

export default App;
