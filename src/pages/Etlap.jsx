import { useState, useEffect } from "react";
import { TermekLista } from "../components/TermekLista.jsx";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "../assets/css/Etlap.css";

function Etlap() {
  const [selectedCategory, setSelectedCategory] = useState("Összes termék");
  const [selectedSort, setSelectedSort] = useState("none");
  const [categories, setCategories] = useState(["Összes termék"]);

  const { items } = useCart();

  const itemCount = items.reduce((total, item) => total + item.qty, 0);

  useEffect(() => {
    async function fetchCategories() {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("/api/Category", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!res.ok) {
          setCategories(["Összes termék"]);
          return;
        }

        const data = await res.json();
        const apiCategories = data.result || data || [];
        const categoryNames = apiCategories.map((category) => category.name || category.Name);

        setCategories(["Összes termék", ...categoryNames]);
      } catch {
        setCategories(["Összes termék"]);
      }
    }

    fetchCategories();
  }, []);

  return (
    <>
      <div className="etlap-toolbar">
        <strong className="Kateg">Kategóriák:</strong>

        <div className="etlap-category-list">
          {categories.map((category) => (
            <button
              key={category}
              className={`szuro_button ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="etlap-sort">
          <label className="Kateg etlap-sort-label" htmlFor="etlap-sort-select">
            Rendezés:
          </label>
          <select
            id="etlap-sort-select"
            className="Kateg etlap-sort-select"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="none">Nincs</option>
            <option value="price-asc">Ár szerint növekvő</option>
            <option value="price-desc">Ár szerint csökkenő</option>
            <option value="name-asc">Név szerint A-Z</option>
            <option value="name-desc">Név szerint Z-A</option>
          </select>
        </div>

        <div className="etlap-cart-wrapper">
          <Link to="/kosar" className="etlap-cart-link">
            <span className="etlap-cart-icon">🛒</span>
            {itemCount > 0 && <span className="etlap-cart-count">{itemCount}</span>}
          </Link>
        </div>
      </div>

      <TermekLista category={selectedCategory} sort={selectedSort} />
    </>
  );
}

export default Etlap;