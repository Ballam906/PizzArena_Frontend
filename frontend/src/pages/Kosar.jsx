// src/pages/Kosar.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { postOrder } from "../api/client.js";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  const c = token ? parseJwt(token) : null;

  return (
    c?.sub ??
    c?.userid ??
    c?.userId ??
    c?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ??
    null
  );
}

export default function Kosar() {
  const nav = useNavigate();
  const { items, inc, dec, remove, clear, total } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [other, setOther] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiOk, setApiOk] = useState(null);

  const shipping = useMemo(() => (items.length ? 490 : 0), [items.length]);
  const grandTotal = useMemo(() => total + shipping, [total, shipping]);

  async function submitOrder() {
    setApiError(null);
    setApiOk(null);

    const userid = getUserIdFromToken();
    if (!userid) {
      setApiError("Nincs userId a tokenben. Jelentkezz be újra.");
      return;
    }

    if (!items.length) {
      setApiError("A kosár üres.");
      return;
    }

    if (!customerEmail.trim() || !customerPhone.trim()) {
      setApiError("Email és telefonszám kötelező.");
      return;
    }

    if (!city.trim() || !postalCode.trim() || !street.trim() || !other.trim()) {
      setApiError("Cím mezők kötelezőek (város, irsz, utca, egyéb).");
      return;
    }

    const payload = {
      userid,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      street: street.trim(),
      other: other.trim(),
      items: items.map((x) => ({ productId: x.id, quantity: x.qty })),
      shipping,
      total: grandTotal,
    };

    try {
      setSubmitting(true);
      await postOrder(payload);
      setApiOk("Rendelés leadva.");
      clear();
    } catch (e) {
      setApiError(e?.message ?? String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: "1rem", maxWidth: 960, margin: "0 auto" }}>
      <h1>Kosár</h1>

      {apiError && (
        <div style={{ border: "1px solid #f99", background: "#fff5f5", padding: "0.75rem", borderRadius: 10, marginBottom: "1rem" }}>
          {apiError}
        </div>
      )}
      {apiOk && (
        <div style={{ border: "1px solid #9f9", background: "#f5fff5", padding: "0.75rem", borderRadius: 10, marginBottom: "1rem" }}>
          {apiOk}
        </div>
      )}

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: "1rem", background: "#fff" }}>
        <h2>Termékek</h2>

        {!items.length ? (
          <div>A kosár üres.</div>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {items.map((x) => (
              <div
                key={x.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "64px 1fr auto",
                  gap: "0.75rem",
                  alignItems: "center",
                  border: "1px solid #f0f0f0",
                  borderRadius: 12,
                  padding: "0.75rem",
                }}
              >
                <img
                  src={x.image}
                  alt={x.name}
                  style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10, background: "#fafafa" }}
                />

                <div>
                  <div style={{ fontWeight: 600 }}>{x.name}</div>
                  <div style={{ color: "#666", fontSize: 14 }}>{x.price} Ft / db</div>
                  <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => dec(x.id)}>-</button>
                    <span style={{ minWidth: 24, textAlign: "center" }}>{x.qty}</span>
                    <button onClick={() => inc(x.id)}>+</button>
                    <button onClick={() => remove(x.id)} style={{ marginLeft: 8 }}>
                      Törlés
                    </button>
                  </div>
                </div>

                <div style={{ fontWeight: 700 }}>
                  {(Number(x.price) || 0) * (Number(x.qty) || 0)} Ft
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "1rem", border: "1px solid #eee", borderRadius: 12, padding: "1rem", background: "#fff" }}>
        <h2>Szállítási adatok</h2>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <input placeholder="Név (opcionális)" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <input placeholder="Telefonszám" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
          <input placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "0.5rem" }}>
            <input placeholder="Város" value={city} onChange={(e) => setCity(e.target.value)} />
            <input placeholder="Irányítószám" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
          </div>
          <input placeholder="Utca, házszám" value={street} onChange={(e) => setStreet(e.target.value)} />
          <textarea placeholder="Egyéb (emelet, ajtó, kapukód, stb.)" value={other} onChange={(e) => setOther(e.target.value)} rows={3} />
        </div>

        <div style={{ marginTop: "1rem", display: "grid", gap: 6 }}>
          <div>Részösszeg: <b>{total} Ft</b></div>
          <div>Szállítás: <b>{shipping} Ft</b></div>
          <div>Végösszeg: <b>{grandTotal} Ft</b></div>
        </div>

        <div style={{ marginTop: "1rem", display: "flex", gap: 8 }}>
          <button onClick={() => nav(-1)}>Vissza</button>
          <button onClick={submitOrder} disabled={submitting || !items.length}>
            {submitting ? "Küldés..." : "Rendelés leadása"}
          </button>
        </div>
      </div>
    </div>
  );
}
