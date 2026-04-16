import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import "../assets/css/TermekLista.css";

export function TermekLista({ category = "Összes termék", sort = "none" }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { add } = useCart();

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const categoryResponse = await fetch("/api/Category", { headers });

        if (!categoryResponse.ok) {
          setCategories([]);
          setProducts([]);
          return;
        }

        const categoryData = await categoryResponse.json();
        const finalCategories = Array.isArray(categoryData)
          ? categoryData
          : categoryData.result || [];

        setCategories(finalCategories);

        const productResponse = await fetch("/api/Product", { headers });

        if (!productResponse.ok) {
          setProducts([]);
          return;
        }

        const productData = await productResponse.json();
        const finalProducts = Array.isArray(productData)
          ? productData
          : productData.result || [];

        setProducts(finalProducts);
      } catch {
        setCategories([]);
        setProducts([]);
      }
    }

    fetchData();
  }, []);

  const categoryMap = useMemo(() => {
    const map = {};

    for (let i = 0; i < categories.length; i++) {
      const categoryItem = categories[i];
      const id = categoryItem.id || categoryItem.Id;
      const name = categoryItem.name || categoryItem.Name || "Ismeretlen";
      map[id] = name;
    }

    return map;
  }, [categories]);

  function getCategoryName(categoryId) {
    return categoryMap[categoryId] || "Ismeretlen";
  }

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const isAvailable = product.isAvailable ?? product.IsAvailable ?? false;
      return isAvailable === true;
    });

    if (category !== "Összes termék") {
      result = result.filter((product) => {
        const productCategoryId = product.categoryId || product.CategoryId;
        const productCategoryName = getCategoryName(productCategoryId);

        return productCategoryName.toLowerCase() === category.toLowerCase();
      });
    }

    result.sort((a, b) => {
      const priceA = Number(a.price || a.Price) || 0;
      const priceB = Number(b.price || b.Price) || 0;
      const nameA = a.name || a.Name || "";
      const nameB = b.name || b.Name || "";

      if (sort === "price-asc") {
        return priceA - priceB;
      }

      if (sort === "price-desc") {
        return priceB - priceA;
      }

      if (sort === "name-asc") {
        return nameA.localeCompare(nameB);
      }

      if (sort === "name-desc") {
        return nameB.localeCompare(nameA);
      }

      return 0;
    });

    return result;
  }, [products, category, sort, categoryMap]);

  return (
    <div className="products-container">
      {filteredProducts.length === 0 ? (
        <p className="products-empty">
          Nincs termék a(z) "{category}" kategóriában.
        </p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const productId = product.id || product.Id;
            const productName = product.name || product.Name || "Névtelen termék";
            const productImage =
              product.image_Url ||
              product.Image_Url ||
              product.imageUrl ||
              "https://via.placeholder.com/150";
            const productCategoryId = product.categoryId || product.CategoryId;
            const productDescription = product.description || product.Description || "";
            const productPrice = Number(product.price || product.Price) || 0;

            return (
              <div key={productId} className="product-card">
                <img
                  src={productImage}
                  alt={productName}
                  className="product-image"
                />

                <h3 className="product-title">{productName}</h3>

                <p className="product-category">
                  {getCategoryName(productCategoryId)}
                </p>

                <p className="product-description">{productDescription}</p>

                <p className="product-price">{productPrice} Ft</p>

                <button
                  type="button"
                  onClick={() => add({ ...product, image: productImage })}
                  className="product-button"
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