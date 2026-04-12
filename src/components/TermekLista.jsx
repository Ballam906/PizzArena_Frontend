import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import "../assets/css/TermekLista.css";

export function TermekLista({ category = "Összes termék", sort = "none" }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { add } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        const catRes = await fetch("/api/Category", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!catRes.ok) {
          throw new Error(`Category HTTP ${catRes.status}`);
        }

        const catData = await catRes.json();
        setCategories(catData);

        const prodRes = await fetch("/api/Product", {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (!prodRes.ok) {
          throw new Error(`Product HTTP ${prodRes.status}`);
        }

        const prodData = await prodRes.json();

        const finalProducts = Array.isArray(prodData)
          ? prodData
          : (prodData.result || []);

        setProducts(finalProducts);
      } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
      }
    }

    fetchData();
  }, []);

  function getCategoryName(categoryId) {
    const found = categories.find((c) => c.id === categoryId);
    return found ? found.name : "Ismeretlen";
  }

  let filteredProducts = products.filter((product) => {
    if (category === "Összes termék") return true;

    const productCatName = getCategoryName(product.categoryId);

    return (
      productCatName
        .toLowerCase()
        .includes(category.toLowerCase().replace("ák", "a")) ||
      category.toLowerCase().includes(productCatName.toLowerCase())
    );
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="products-container">
      {filteredProducts.length === 0 ? (
        <p className="products-empty">
          Nincs termék a(z) "{category}" kategóriában.
        </p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((p) => (
            <div key={p.id} className="product-card">
              <img
                src={
                  p.image_Url && p.image_Url !== "string"
                    ? p.image_Url
                    : "https://via.placeholder.com/150"
                }
                alt={p.name}
                className="product-image"
              />

              <h3 className="product-title">{p.name}</h3>

              <p className="product-category">
                {getCategoryName(p.categoryId)}
              </p>

              <p className="product-description">
                {p.description}
              </p>

              <p className="product-price">{p.price} Ft</p>

              <button
                onClick={() => add({ ...p, image: p.image_Url })}
                className="product-button"
              >
                Kosárba
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}