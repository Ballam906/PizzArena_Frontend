import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { postOrder } from "../api/client.js";
import "../assets/css/Kosar.css";

function parseJwt(token) {
  try {
    const tokenParts = token.split(".");
    const payload = tokenParts[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => "%" + char.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  const claims = token ? parseJwt(token) : null;

  if (!claims) {
    return null;
  }

  return claims.sub || claims.userid || claims.userId || null;
}

function readJson(text, defaultValue) {
  if (!text) {
    return defaultValue;
  }

  try {
    return JSON.parse(text);
  } catch {
    return defaultValue;
  }
}

function isValidName(value) {
  const text = value.trim();
  return /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s.-]{2,60}$/.test(text);
}

function isValidPhone(value) {
  const text = value.trim().replace(/\s|-/g, "");
  return /^(\+36|06)\d{8,9}$/.test(text);
}

function isValidEmail(value) {
  const text = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

function isValidPostalCode(value) {
  return /^\d{4}$/.test(value.trim());
}

function isValidCity(value) {
  const text = value.trim();
  return /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s.-]{2,50}$/.test(text);
}

function isValidStreet(value) {
  const text = value.trim();
  return text.length >= 5 && text.length <= 100;
}

function isValidOther(value) {
  const text = value.trim();
  return text.length >= 3 && text.length <= 100;
}

export default function Kosar() {
  const navigate = useNavigate();
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

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  const shipping = useMemo(() => {
    return items.length > 0 ? 490 : 0;
  }, [items.length]);

  const grandTotal = useMemo(() => {
    return total + shipping;
  }, [total, shipping]);

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch("/api/Restaurant");

        if (!res.ok) {
          setRestaurants([]);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setRestaurants(data);
          return;
        }

        if (Array.isArray(data.result)) {
          setRestaurants(data.result);
          return;
        }

        setRestaurants([]);
      } catch {
        setRestaurants([]);
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
          setSettings(null);
          return;
        }

        const text = await res.text();
        const data = readJson(text, null);
        setSettings(data);
      } catch {
        setSettings(null);
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

    if (!isValidName(customerName)) {
      setApiError("Adj meg valós nevet.");
      return;
    }

    if (!isValidPhone(customerPhone)) {
      setApiError("Adj meg érvényes telefonszámot.");
      return;
    }

    if (!isValidEmail(customerEmail)) {
      setApiError("Adj meg érvényes email címet.");
      return;
    }

    if (!isValidCity(city)) {
      setApiError("Adj meg érvényes várost.");
      return;
    }

    if (!isValidPostalCode(postalCode)) {
      setApiError("Az irányítószám pontosan 4 számjegy legyen.");
      return;
    }

    if (!isValidStreet(street)) {
      setApiError("Adj meg valós utcát és házszámot.");
      return;
    }

    if (!isValidOther(other)) {
      setApiError("Az egyéb címadat mező túl rövid vagy hibás.");
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
      items: items.map((item) => ({
        productId: item.id,
        piece: item.qty,
        itemPrice: Number(item.price) || 0,
        itemName: item.name
      }))
    };

    try {
      setSubmitting(true);
      await postOrder(payload);
      setApiOk("Rendelés leadva.");
      clear();
    } catch (error) {
      setApiError(error?.message || "Sikertelen rendelés.");
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

              {items.length > 0 && (
                <button type="button" onClick={clear} className="kosar-btn kosar-btn-light">
                  Kosár ürítése
                </button>
              )}
            </div>

            {!items.length ? (
              <div className="kosar-empty-cart">A kosár üres.</div>
            ) : (
              <div className="kosar-products-list">
                {items.map((item) => (
                  <div key={item.id} className="kosar-product-card">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="kosar-product-image"
                    />

                    <div className="kosar-product-info">
                      <div className="kosar-product-name">{item.name}</div>
                      <div className="kosar-product-price">{item.price} Ft / db</div>

                      <div className="kosar-product-actions">
                        <button
                          type="button"
                          onClick={() => dec(item.id)}
                          className="kosar-qty-btn"
                        >
                          -
                        </button>

                        <span className="kosar-qty-value">{item.qty}</span>

                        <button
                          type="button"
                          onClick={() => inc(item.id)}
                          className="kosar-qty-btn"
                        >
                          +
                        </button>

                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="kosar-btn kosar-btn-delete"
                        >
                          Törlés
                        </button>
                      </div>
                    </div>

                    <div className="kosar-product-total">
                      {(Number(item.price) || 0) * (Number(item.qty) || 0)} Ft
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

                  {restaurants.map((restaurant) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name} - {restaurant.address}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Név"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="kosar-form-input"
                  maxLength={60}
                />

                <input
                  placeholder="Telefonszám"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(
                      e.target.value.replace(/[^0-9+]/g, "").slice(0, 15)
                    )
                  }
                  className="kosar-form-input"
                  inputMode="tel"
                  maxLength={15}
                />

                <input
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="kosar-form-input"
                  type="email"
                  maxLength={100}
                />

                <div className="kosar-form-row">
                  <input
                    placeholder="Város"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="kosar-form-input"
                    maxLength={50}
                  />

                  <input
                    placeholder="Irányítószám"
                    value={postalCode}
                    onChange={(e) =>
                      setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="kosar-form-input"
                    inputMode="numeric"
                    maxLength={4}
                  />
                </div>

                <input
                  placeholder="Utca, házszám"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="kosar-form-input"
                  maxLength={100}
                />

                <textarea
                  placeholder="Egyéb (emelet, ajtó, kapukód, stb.)"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  rows={4}
                  className="kosar-form-input kosar-form-textarea"
                  maxLength={100}
                />
              </div>
            </div>

            <div className="kosar-summary-card">
              <div className="kosar-delivery-time">
                Szállítási idő: {settings?.deliveryTime ?? settings?.DeliveryTime ?? "..."} perc
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
                  type="button"
                  onClick={() => navigate(-1)}
                  className="kosar-btn kosar-btn-back"
                >
                  Vissza
                </button>

                <button
                  type="button"
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