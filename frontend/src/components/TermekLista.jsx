import { useEffect, useState } from "react";
import { getTermekek } from "../api/client.js";
import { useCart } from "../context/CartContext.jsx";

export function TermekLista() {
  const { add } = useCart();

  const [termekek, setTermekek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getTermekek()
      .then((x) => {
        if (!cancelled) setTermekek(x ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
      {termekek.map((t) => {
        const id = t.id ?? t.Id;
        const nev = t.nev ?? t.name ?? t.Name;
        const leiras = t.leiras ?? t.description ?? t.Description;
        const ar = t.ar ?? t.price ?? t.Price;
        const kep = t.kep_Url ?? t.kepUrl ?? t.image_Url ?? t.Image_Url;

        return (
          <div
            key={id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: "1rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={kep}
              alt={nev}
              style={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: "0.5rem",
              }}
            />
            <h3>{nev}</h3>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>{leiras}</p>
            <strong>{ar} Ft</strong>

            <button onClick={() => add(t)} style={{ marginTop: "0.5rem" }}>
              Kosárba
            </button>
          </div>
        );
      })}
    </div>
  );
}
