import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Fiok.css";

const Fiokosszesito = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [notice, setNotice] = useState(null);

  const token = localStorage.getItem("token");

  function show(type, text) {
    setNotice({ type, text });
  }

  function clearNotice() {
    setNotice(null);
  }

  function getOrderTotal(items) {
    if (!items || items.length === 0) return 0;

    let total = 0;

    for (let i = 0; i < items.length; i++) {
      const itemPrice = items[i].ItemPrice || items[i].itemPrice || 0;
      const piece = items[i].Piece || items[i].piece || 0;
      total += itemPrice * piece;
    }

    return total;
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");

    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      navigate("/rendeles");
      return;
    }

    if (!token) {
      navigate("/rendeles");
      return;
    }

    async function fetchOrders() {
      try {
        clearNotice();

        const res = await fetch("https://localhost:7218/api/Order/MyOrdersWithItems", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const text = await res.text();

        let data;
        try {
          data = text ? JSON.parse(text) : [];
        } catch {
          data = [];
        }

        if (res.status === 401 || res.status === 403) {
          show("error", "Nincs jogosultság vagy lejárt token.");
          return;
        }

        if (!res.ok) {
          show("error", "Hiba a szerverről: " + res.status + " " + res.statusText);
          return;
        }

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data.result)) {
          setOrders(data.result);
        } else {
          setOrders([]);
        }
      } catch (err) {
        show("error", "Hálózati hiba: " + err.message);
      }
    }

    fetchOrders();
  }, [navigate, token]);

  function toggleEdit() {
    setEditingName(!editingName);
  }

  function handleNameChange(e) {
    const updated = {
      ...userData,
      CustomerName: e.target.value
    };

    setUserData(updated);
    localStorage.setItem("userData", JSON.stringify(updated));
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData");
    show("info", "Sikeresen kijelentkeztél.");
    navigate("/rendeles");
  }

  if (!userData) {
    return <p className="fiok-loading">Betöltés...</p>;
  }

  return (
    <div className="fiok-wrapper">
      <h2 className="fiok-title">Felhasználói fiók</h2>

      {notice && (
        <div className={`fiok-notice fiok-notice-${notice.type}`}>
          {notice.text}
        </div>
      )}

      <section className="fiok-section">
        <div className="fiok-section-header">
          <h3>Regisztrációs adatok</h3>
        </div>

        {editingName ? (
          <input
            type="text"
            value={userData.CustomerName || ""}
            onChange={handleNameChange}
            className="fiok-input"
          />
        ) : (
          <p className="fiok-text">
            <strong>Név:</strong> {userData.CustomerName || "-"}
          </p>
        )}

        <p className="fiok-text">
          <strong>Email:</strong> {userData.CustomerEmail || "-"}
        </p>
      </section>

      <section className="fiok-section">
        <h3>Rendelés előzmények</h3>

        {orders.length === 0 ? (
          <p className="fiok-empty">Nincs rendelésed még.</p>
        ) : (
          <div className="fiok-table-wrapper">
            <table className="fiok-table">
              <thead>
                <tr>
                  <th>Dátum</th>
                  <th>Név</th>
                  <th>Összeg</th>
                  <th>Rendelés státusz</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx}>
                    <td>
                      {order.orderTime
                        ? new Date(order.orderTime).toLocaleString()
                        : "-"}
                    </td>
                    <td>{order.customerName || order.CustomerName || "-"}</td>
                    <td>{getOrderTotal(order.orderItems || order.OrderItems)} Ft</td>
                    <td>{order.status || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <button className="fiok-logout-btn" onClick={handleLogout}>
        Kijelentkezés
      </button>
    </div>
  );
};

export default Fiokosszesito;