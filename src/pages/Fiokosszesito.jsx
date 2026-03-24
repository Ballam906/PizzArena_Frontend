import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

        console.log("TOKEN:", token);

        const res = await fetch("https://localhost:7218/api/Order/MyOrdersWithItems", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("MYORDERS STATUS:", res.status);

        const text = await res.text();
        console.log("MYORDERS RAW RESPONSE:", text);

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
    return <p>Betöltés...</p>;
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 20,
        background: "#f9f9f9",
        borderRadius: 8
      }}
    >
      <h2>Felhasználói fiók</h2>

      {notice && (
        <div
          style={{
            marginBottom: 15,
            padding: "8px 12px",
            borderRadius: 4,
            fontWeight: "bold",
            backgroundColor:
              notice.type === "success"
                ? "#4caf50"
                : notice.type === "error"
                ? "#f44336"
                : "#2196f3",
            color: "#fff"
          }}
        >
          {notice.text}
        </div>
      )}

      <section style={{ marginBottom: 20 }}>
        <h3>Regisztrációs adatok</h3>

        {editingName ? (
          <input
            type="text"
            value={userData.CustomerName || ""}
            onChange={handleNameChange}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
        ) : (
          <p>
            <strong>Név:</strong> {userData.CustomerName}
          </p>
        )}

        <p>
          <strong>Email:</strong> {userData.CustomerEmail}
        </p>

        <button
          onClick={toggleEdit}
          style={{ padding: "6px 12px", marginTop: 8 }}
        >
          {editingName ? "Mentés" : "Szerkesztés"}
        </button>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3>Rendelés előzmények</h3>

        {orders.length === 0 ? (
          <p>Nincs rendelésed még.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid #ccc" }}>
                <th>Dátum</th>
                <th>Név</th>
                <th>Összeg</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                  <td>
                    {order.orderTime
                      ? new Date(order.orderTime).toLocaleString()
                      : "-"}
                  </td>
                  <td>{order.customerName || order.CustomerName || "-"}</td>
                  <td>{getOrderTotal(order.orderItems || order.OrderItems)} Ft</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#837777",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 10
        }}
      >
        Kijelentkezés
      </button>
    </div>
  );
};

export default Fiokosszesito;