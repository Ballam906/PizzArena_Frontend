import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";

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
    <div style={{ marginTop: "20px" }}>
      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px" }}>
          Nincs termék a(z) "{category}" kategóriában.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}
        >
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "15px",
                background: "#fff",
                width: "280px",
                minWidth: "280px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <img
                src={
                  p.image_Url && p.image_Url !== "string"
                    ? p.image_Url
                    : "https://via.placeholder.com/150"
                }
                alt={p.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />
              <h3 style={{ marginTop: "10px" }}>{p.name}</h3>
              <p style={{ fontSize: "0.8rem", color: "#888" }}>
                {getCategoryName(p.categoryId)}
              </p>
              <p style={{ height: "40px", overflow: "hidden" }}>
                {p.description}
              </p>
              <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                {p.price} Ft
              </p>
              <button
                onClick={() => add({ ...p, image: p.image_Url })}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#222",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
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