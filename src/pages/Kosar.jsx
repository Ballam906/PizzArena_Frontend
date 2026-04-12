import { useMemo, useState, useEffect } from "react";
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
  const [restaurantId, setRestaurantId] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiOk, setApiOk] = useState(null);

  const shipping = useMemo(() => (items.length ? 490 : 0), [items.length]);
  const grandTotal = useMemo(() => total + shipping, [total, shipping]);

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch("/api/Restaurant");

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error("Hiba az éttermek betöltésekor:", err);
      } finally {
        setRestaurantsLoading(false);
      }
    }

    fetchRestaurants();
  }, []);

  useEffect(() => {
    async function fetchGlobalSettings() {
      try {
        const res = await fetch("/api/GlobalSettings", {
          method: "GET"
        });

        if (!res.ok) {
          throw new Error("Nem sikerült lekérni a GlobalSettings adatokat.");
        }

        const text = await res.text();
        const data = JSON.parse(text);

        setSettings(data);
      } catch (error) {
        console.error("Hiba a GlobalSettings lekérésekor:", error);
      }
    }

    fetchGlobalSettings();
  }, []);

  async function submitOrder() {
    setApiError(null);
    setApiOk(null);

    const userId = getUserIdFromToken();

    if (!userId) {
      setApiError("Rendelést csak bejelentkezés után tudsz leadni.");
      return;
    }

    if (!items.length) {
      setApiError("A kosár üres.");
      return;
    }

    if (!restaurantId) {
      setApiError("Válassz éttermet.");
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
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      postalCode: postalCode.trim(),
      city: city.trim(),
      street: street.trim(),
      other: other.trim(),
      userId: userId,
      restaurantId: Number(restaurantId),
      items: items.map((x) => ({
        productId: x.id,
        piece: x.qty,
        itemPrice: Number(x.price) || 0
      }))
    };

    console.log("KÜLDÖTT RENDELÉS:", payload);

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8f8f8 0%, #efefef 100%)",
        padding: "32px 16px"
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "#1f1f1f"
            }}
          >
            Kosár
          </h1>
          <p style={{ marginTop: 8, color: "#666", fontSize: "1rem" }}>
            Nézd át a termékeket, add meg a szállítási adatokat, és véglegesítsd a rendelésed.
          </p>
        </div>

        {apiError && (
          <div
            style={{
              border: "1px solid #f1a8a8",
              background: "#fff1f1",
              color: "#9f1d1d",
              padding: "14px 16px",
              borderRadius: 14,
              marginBottom: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
            }}
          >
            {apiError}
          </div>
        )}

        {apiOk && (
          <div
            style={{
              border: "1px solid #9dd8aa",
              background: "#f1fff4",
              color: "#1f6b32",
              padding: "14px 16px",
              borderRadius: 14,
              marginBottom: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
            }}
          >
            {apiOk}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: 24
          }}
        >
          <div
            style={{
              border: "1px solid #e8e8e8",
              borderRadius: 20,
              padding: "22px",
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
                flexWrap: "wrap",
                gap: 12
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.35rem", color: "#222" }}>
                Termékek
              </h2>

              {!!items.length && (
                <button
                  onClick={clear}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid #ddd",
                    background: "#fafafa",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Kosár ürítése
                </button>
              )}
            </div>

            {!items.length ? (
              <div
                style={{
                  border: "1px dashed #d9d9d9",
                  borderRadius: 16,
                  padding: "28px",
                  textAlign: "center",
                  color: "#666",
                  background: "#fcfcfc"
                }}
              >
                A kosár üres.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "14px" }}>
                {items.map((x) => (
                  <div
                    key={x.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "88px 1fr auto",
                      gap: "16px",
                      alignItems: "center",
                      border: "1px solid #efefef",
                      borderRadius: 18,
                      padding: "14px",
                      background: "#fcfcfc"
                    }}
                  >
                    <img
                      src={x.image}
                      alt={x.name}
                      style={{
                        width: 88,
                        height: 88,
                        objectFit: "cover",
                        borderRadius: 14,
                        background: "#f3f3f3",
                        border: "1px solid #eee"
                      }}
                    />

                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "1.05rem",
                          color: "#1f1f1f",
                          marginBottom: 4
                        }}
                      >
                        {x.name}
                      </div>

                      <div style={{ color: "#666", fontSize: 14, marginBottom: 12 }}>
                        {x.price} Ft / db
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap"
                        }}
                      >
                        <button
                          onClick={() => dec(x.id)}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            background: "#fff",
                            cursor: "pointer",
                            fontWeight: 700
                          }}
                        >
                          -
                        </button>

                        <span
                          style={{
                            minWidth: 34,
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: "1rem"
                          }}
                        >
                          {x.qty}
                        </span>

                        <button
                          onClick={() => inc(x.id)}
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            background: "#fff",
                            cursor: "pointer",
                            fontWeight: 700
                          }}
                        >
                          +
                        </button>

                        <button
                          onClick={() => remove(x.id)}
                          style={{
                            marginLeft: 8,
                            padding: "8px 12px",
                            borderRadius: 10,
                            border: "none",
                            background: "#ffe5e5",
                            color: "#b42323",
                            cursor: "pointer",
                            fontWeight: 600
                          }}
                        >
                          Törlés
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: "1.05rem",
                        color: "#111",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {(Number(x.price) || 0) * (Number(x.qty) || 0)} Ft
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gap: 20,
              alignSelf: "start"
            }}
          >
            <div
              style={{
                border: "1px solid #e8e8e8",
                borderRadius: 20,
                padding: "22px",
                background: "#ffffff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: "1.35rem", color: "#222" }}>
                Szállítási adatok
              </h2>

              <div style={{ display: "grid", gap: "12px" }}>
                <select
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  style={inputStyle}
                  disabled={restaurantsLoading}
                >
                  <option value="">
                    {restaurantsLoading ? "Éttermek betöltése..." : "Válassz éttermet"}
                  </option>
                  {restaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} - {r.address}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Név"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Telefonszám"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={inputStyle}
                />

                <input
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={inputStyle}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 140px",
                    gap: "12px"
                  }}
                >
                  <input
                    placeholder="Város"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Irányítószám"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <input
                  placeholder="Utca, házszám"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  style={inputStyle}
                />

                <textarea
                  placeholder="Egyéb (emelet, ajtó, kapukód, stb.)"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            </div>

            <div
              style={{
                borderRadius: 20,
                padding: "22px",
                background: "linear-gradient(135deg, #1f1f1f 0%, #363636 100%)",
                color: "#fff",
                boxShadow: "0 12px 30px rgba(0,0,0,0.15)"
              }}
            >
              <div style={{ marginBottom: 12 }}>
                Szállítási idő: {settings?.deliveryTime ?? "..."} perc
              </div>

              <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: "1.35rem" }}>
                Összesítés
              </h2>

              <div style={{ display: "grid", gap: 10 }}>
                <div style={summaryRowStyle}>
                  <span>Részösszeg</span>
                  <b>{total} Ft</b>
                </div>

                <div style={summaryRowStyle}>
                  <span>Szállítás</span>
                  <b>{shipping} Ft</b>
                </div>

                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.18)",
                    margin: "6px 0"
                  }}
                />

                <div
                  style={{
                    ...summaryRowStyle,
                    fontSize: "1.1rem"
                  }}
                >
                  <span>Végösszeg</span>
                  <b>{grandTotal} Ft</b>
                </div>
              </div>

              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10
                }}
              >
                <button
                  onClick={() => nav(-1)}
                  style={{
                    padding: "13px 14px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.25)",
                    background: "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 700
                  }}
                >
                  Vissza
                </button>

                <button
                  onClick={submitOrder}
                  disabled={submitting || !items.length}
                  style={{
                    padding: "13px 14px",
                    borderRadius: 12,
                    border: "none",
                    background: submitting || !items.length ? "#bdbdbd" : "#ffffff",
                    color: submitting || !items.length ? "#666" : "#111",
                    cursor: submitting || !items.length ? "not-allowed" : "pointer",
                    fontWeight: 800
                  }}
                >
                  {submitting ? "Küldés..." : "Rendelés leadása"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: 12,
  border: "1px solid #dcdcdc",
  background: "#fcfcfc",
  fontSize: "0.95rem",
  outline: "none",
  boxSizing: "border-box"
};

const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};