import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { postOrder } from "../api/client.js";
import "../assets/css/Kosar.css";

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
    <div className="kosar-page">
      <div className="kosar-container">
        <div className="kosar-header">
          <h1 className="kosar-title">Kosár</h1>
          <p className="kosar-subtitle">
            Nézd át a termékeket, add meg a szállítási adatokat, és véglegesítsd a rendelésed.
          </p>
        </div>

        {apiError && (
          <div className="kosar-alert kosar-alert-error">
            {apiError}
          </div>
        )}

        {apiOk && (
          <div className="kosar-alert kosar-alert-success">
            {apiOk}
          </div>
        )}

        <div className="kosar-grid">
          <div className="kosar-card">
            <div className="kosar-card-header">
              <h2 className="kosar-section-title">Termékek</h2>

              {!!items.length && (
                <button onClick={clear} className="kosar-btn kosar-btn-light">
                  Kosár ürítése
                </button>
              )}
            </div>

            {!items.length ? (
              <div className="kosar-empty-cart">A kosár üres.</div>
            ) : (
              <div className="kosar-products-list">
                {items.map((x) => (
                  <div key={x.id} className="kosar-product-card">
                    <img
                      src={x.image}
                      alt={x.name}
                      className="kosar-product-image"
                    />

                    <div className="kosar-product-info">
                      <div className="kosar-product-name">{x.name}</div>
                      <div className="kosar-product-price">{x.price} Ft / db</div>

                      <div className="kosar-product-actions">
                        <button
                          onClick={() => dec(x.id)}
                          className="kosar-qty-btn"
                        >
                          -
                        </button>

                        <span className="kosar-qty-value">{x.qty}</span>

                        <button
                          onClick={() => inc(x.id)}
                          className="kosar-qty-btn"
                        >
                          +
                        </button>

                        <button
                          onClick={() => remove(x.id)}
                          className="kosar-btn kosar-btn-delete"
                        >
                          Törlés
                        </button>
                      </div>
                    </div>

                    <div className="kosar-product-total">
                      {(Number(x.price) || 0) * (Number(x.qty) || 0)} Ft
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="kosar-right-column">
            <div className="kosar-card">
              <h2 className="kosar-section-title kosar-section-title-margin">
                Szállítási adatok
              </h2>

              <div className="kosar-form-grid">
                <select
                  value={restaurantId}
                  onChange={(e) => setRestaurantId(e.target.value)}
                  className="kosar-form-input"
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
                  className="kosar-form-input"
                />

                <input
                  placeholder="Telefonszám"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="kosar-form-input"
                />

                <input
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="kosar-form-input"
                />

                <div className="kosar-form-row">
                  <input
                    placeholder="Város"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="kosar-form-input"
                  />
                  <input
                    placeholder="Irányítószám"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="kosar-form-input"
                  />
                </div>

                <input
                  placeholder="Utca, házszám"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="kosar-form-input"
                />

                <textarea
                  placeholder="Egyéb (emelet, ajtó, kapukód, stb.)"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  rows={4}
                  className="kosar-form-input kosar-form-textarea"
                />
              </div>
            </div>

            <div className="kosar-summary-card">
              <div className="kosar-delivery-time">
                Szállítási idő: {settings?.deliveryTime ?? "..."} perc
              </div>

              <h2 className="kosar-summary-title">Összesítés</h2>

              <div className="kosar-summary-list">
                <div className="kosar-summary-row">
                  <span>Részösszeg</span>
                  <b>{total} Ft</b>
                </div>

                <div className="kosar-summary-row">
                  <span>Szállítás</span>
                  <b>{shipping} Ft</b>
                </div>

                <div className="kosar-summary-divider" />

                <div className="kosar-summary-row kosar-summary-row-total">
                  <span>Végösszeg</span>
                  <b>{grandTotal} Ft</b>
                </div>
              </div>

              <div className="kosar-summary-actions">
                <button
                  onClick={() => nav(-1)}
                  className="kosar-btn kosar-btn-back"
                >
                  Vissza
                </button>

                <button
                  onClick={submitOrder}
                  disabled={submitting || !items.length}
                  className={`kosar-btn kosar-btn-order ${
                    submitting || !items.length ? "kosar-btn-order-disabled" : ""
                  }`}
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