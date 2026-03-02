import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function normalizeProduct(t) {
    const id = t?.id ?? t?.Id;
    const name = t?.nev ?? t?.name ?? t?.Name;
    const price = t?.ar ?? t?.price ?? t?.Price;
    const image = t?.kep_Url ?? t?.kepUrl ?? t?.image_Url ?? t?.Image_Url ?? t?.imageUrl;
    return { id, name, price, image };
  }

  function add(product) {
    const p = normalizeProduct(product);
    if (p.id == null) return;

    setItems((prev) => {
      const existing = prev.find((x) => x.id === p.id);
      if (existing) return prev.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { ...p, qty: 1 }];
    });
  }

  function inc(id) {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)));
  }

  function dec(id) {
    setItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: Math.max(0, x.qty - 1) } : x))
        .filter((x) => x.qty > 0)
    );
  }

  function remove(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const total = useMemo(
    () => items.reduce((sum, x) => sum + (Number(x.price) || 0) * (Number(x.qty) || 0), 0),
    [items]
  );

  const value = useMemo(() => ({ items, add, inc, dec, remove, clear, total }), [items, total]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
