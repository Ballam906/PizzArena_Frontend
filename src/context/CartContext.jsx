import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function normalizeProduct(product) {
    const id = product?.id || product?.Id;
    const name = product?.name || "";
    const price = product?.price || 0;
    const image = product?.image_Url || "";

    return {
      id,
      name,
      price,
      image
    };
  }

  function add(product) {
    const normalizedProduct = normalizeProduct(product);

    if (!normalizedProduct.id) {
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === normalizedProduct.id);

      if (existingItem) {
        return prevItems.map((item) => {
          if (item.id === normalizedProduct.id) {
            return {
              ...item,
              qty: item.qty + 1
            };
          }

          return item;
        });
      }

      return [
        ...prevItems,
        {
          ...normalizedProduct,
          qty: 1
        }
      ];
    });
  }

  function inc(id) {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            qty: item.qty + 1
          };
        }

        return item;
      })
    );
  }

  function dec(id) {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            qty: item.qty - 1
          };
        }

        return item;
      });

      return updatedItems.filter((item) => item.qty > 0);
    });
  }

  function remove(id) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return sum + price * qty;
    }, 0);
  }, [items]);

  const value = useMemo(() => {
    return {
      items,
      add,
      inc,
      dec,
      remove,
      clear,
      total
    };
  }, [items, total]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("A useCart csak CartProvider-en belül használható.");
  }

  return context;
}