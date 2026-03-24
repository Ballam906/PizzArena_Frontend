import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export function TermekLista({ category = "Összes termék", sort = "none" }) {
  const [products, setProducts] = useState([]);
  const { add } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/Product");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.result && Array.isArray(data.result)) {
          setProducts(data.result);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log("Hiba a termékek lekérésekor:", error);
        setProducts([]);
      }
    }

    fetchProducts();
  }, []);

  function getCategoryName(product) {
    const categoryId = product.categoryId ?? product.CategoryId;

    switch (categoryId) {
      case 1:
      case 2:
        return "Pizzák";
      case 3:
        return "Hamburgerek";
      case 4:
        return "Előétel";
      case 5:
        return "Saláták";
      case 6:
        return "Tészták";
      case 7:
        return "Desszertek";
      case 8:
        return "Üdítők";
      case 9:
        return "Alkoholos italok";
      case 10:
        return "Kávé és Teák";
      default:
        return "Ismeretlen kategória";
    }
  }

  let filteredProducts = products.filter((product) => {
    const productCategory = getCategoryName(product);

    if (category === "Összes termék") return true;

    return productCategory.toLowerCase() === category.toLowerCase();
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.price ?? a.Price ?? 0;
    const priceB = b.price ?? b.Price ?? 0;
    const nameA = a.name ?? a.Name ?? "";
    const nameB = b.name ?? b.Name ?? "";

    if (sort === "price-asc") return priceA - priceB;
    if (sort === "price-desc") return priceB - priceA;
    if (sort === "name-asc") return nameA.localeCompare(nameB);
    if (sort === "name-desc") return nameB.localeCompare(nameA);

    return 0;
  });

  return (
    <div style={{ marginTop: "20px" }}>
      {filteredProducts.length === 0 ? (
        <p>Nincs megjeleníthető termék.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px"
          }}
        >
          {filteredProducts.map((product) => {
            const id = product.Id ?? product.id;
            const name = product.Name ?? product.name;
            const price = product.Price ?? product.price;
            const image = product.image_Url ?? product.imageUrl ?? product.image;
            const description = product.description ?? product.Description;
            const categoryName = getCategoryName(product);

            return (
              <div
                key={id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "15px",
                  background: "#fff"
                }}
              >
                {image && (
                  <img
                    src={image}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "10px"
                    }}
                  />
                )}

                <h3>{name}</h3>
                <p><strong>Kategória:</strong> {categoryName}</p>
                <p>{description}</p>
                <p><strong>Ár:</strong> {price} Ft</p>

                <button
                  onClick={() => {
                    add({
                      id,
                      name,
                      price,
                      image
                    });
                    console.log("Kosárba tett termék:", { id, name, price, image });
                  }}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "10px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#222",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  Kosárba
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}