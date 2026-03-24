import { useState } from "react";
import { TermekLista } from "../components/TermekLista.jsx";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "../assets/css/Etlap.css";

function Etlap() {
  const [selectedCategory, setSelectedCategory] = useState("Összes termék");
  const [selectedSort, setSelectedSort] = useState("none");

  const { items } = useCart();

  let itemCount = 0;
  for (let i = 0; i < items.length; i++) {
    itemCount += items[i].qty;
  }

  const categories = [
    "Összes termék",
    "Pizzák",
    "Hamburgerek",
    "Üdítők",
    "Desszertek",
    "Tészták",
    "Saláták",
    "Levesek*",
    "Köretek*",
    "Szószok*"
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          margin: "20px 0",
          padding: "15px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
        }}
      >
        <strong className="Kateg">Kategóriák:</strong>

        {categories.map((cat) => (
          <button
            className="szuro_button"
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: selectedCategory === cat ? "#222" : "#fff",
              color: selectedCategory === cat ? "#fff" : "#000",
              cursor: "pointer"
            }}
          >
            {cat}
          </button>
        ))}

        <div style={{ marginLeft: "10px" }}>
          <label className="Kateg" style={{ marginRight: "8px" }}>Rendezés:</label>
          <select
            className="Kateg"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            style={{ padding: "5px", borderRadius: "8px" }}
          >
            <option value="none">Nincs</option>
            <option value="price-asc">Ár szerint növekvő</option>
            <option value="price-desc">Ár szerint csökkenő</option>
            <option value="name-asc">Név szerint A-Z</option>
            <option value="name-desc">Név szerint Z-A</option>
          </select>
        </div>

        <div style={{ marginLeft: "auto" }}>
          <Link
            to="/kosar"
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#222",
              color: "#fff",
              textDecoration: "none",
              fontSize: "22px"
            }}
          >
            🛒

            {itemCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  minWidth: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "red",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 6px"
                }}
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <TermekLista category={selectedCategory} sort={selectedSort} />
    </>
  );
}

export default Etlap;