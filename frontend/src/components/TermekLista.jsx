import { useEffect, useState } from "react";
import { getTermekek } from "../api/client.js";

export function TermekLista() {
  const [cartItems, setCartItems] = useState([]);
  const [termekek, setTermekek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTermekek()
      .then((termekek) => setTermekek(termekek))
      .catch((err) => setError(err?.message ?? String(err)))
      .finally(() => setLoading(false));
  }, []);

  function addToCart(t) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === t.id);

      if (existing) {
        return prev.map((item) =>
          item.id === t.id ? { ...item, qty: item.qty + 1 } : item
        );
      }

      return [...prev, { id: t.id, nev: t.nev, ar: t.ar, qty: 1 }];
    });
  }

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div>Hiba: {error}</div>;

  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      }}
    >
      {termekek.map((t) => (
        <div
          key={t.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <img
            src={t.kep_Url}
            alt={t.nev}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "0.5rem",
            }}
          />
          <h3>{t.nev}</h3>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>{t.leiras}</p>
          <strong>{t.ar} Ft</strong>

          <button onClick={() => addToCart(t)} style={{ marginTop: "0.5rem" }}>
            Kosárba
          </button>
        </div>
      ))}
    </div>
  );
}
