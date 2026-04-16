import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Fiok.css";

const Fiokosszesito = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notice, setNotice] = useState(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const token = localStorage.getItem("token");

  function show(type, text) {
    setNotice({ type, text });
  }

  function clearNotice() {
    setNotice(null);
  }

  function getStatusText(status) {
    switch (status) {
      case 0:
        return "Feldolgozás alatt";
      case 1:
        return "Elfogadva";
      case 2:
        return "Kiszállítás alatt";
      case 3:
        return "Teljesítve";
      case 4:
        return "Törölve";
      default:
        return "-";
    }
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
      try {
        setUserData(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("userData");
        navigate("/rendeles");
        return;
      }
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

  function handlePasswordInputChange(e) {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    clearNotice();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      show("error", "Minden jelszó mezőt tölts ki.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      show("error", "Az új jelszó legyen legalább 6 karakter, tartalmaznia kell speciális karaktert.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      show("error", "Az új jelszavak nem egyeznek.");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      show("error", "Az új jelszó nem lehet ugyanaz, mint a régi.");
      return;
    }

    const possibleUserName =
      userData?.userName ||
      userData?.UserName ||
      userData?.username ||
      userData?.Username ||
      userData?.CustomerName ||
      "";

    if (!possibleUserName) {
      show("error", "Nem található felhasználónév az adatok között.");
      return;
    }

    const requestBody = {
      userName: possibleUserName,
      password: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    };

    try {
      setPasswordLoading(true);

      const res = await fetch("https://localhost:7218/api/User/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      const text = await res.text();

      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      console.log("Change password request body:", requestBody);
      console.log("Change password status:", res.status);
      console.log("Change password raw response:", text);
      console.log("Change password parsed response:", data);

      if (res.status === 401 || res.status === 403) {
  show("error", "Nincs jogosultság vagy lejárt token.");
  return;
}

if (!res.ok || data?.success === false) {
  const errorMessage =
    data?.message ||
    data?.title ||
    data?.errors?.userName?.[0] ||
    data?.errors?.UserName?.[0] ||
    data?.errors?.password?.[0] ||
    data?.errors?.Password?.[0] ||
    data?.errors?.newPassword?.[0] ||
    data?.errors?.NewPassword?.[0] ||
    text ||
    "Sikertelen jelszócsere.";

  show("error", errorMessage);
  return;
}

show("success", data?.message || "A jelszó sikeresen módosítva lett.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      setShowPasswordForm(false);
    } catch (err) {
      show("error", "Hálózati hiba: " + err.message);
    } finally {
      setPasswordLoading(false);
    }
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

        <p className="fiok-text">
          <strong>Név:</strong> {userData.userName || userData.CustomerName || "-"}
        </p>

        <p className="fiok-text">
          <strong>Email:</strong> {userData.CustomerEmail || userData.email || "-"}
        </p>

     <div className="fiok-password-area">
      <button
        type="button"
        className={`fiok-password-btn ${showPasswordForm ? "active" : ""}`}
        onClick={() => setShowPasswordForm(!showPasswordForm)}
      >
        <span>
          {showPasswordForm ? "Jelszócsere bezárása" : "Jelszó csere"}
        </span>
        <span className={`fiok-password-btn-icon ${showPasswordForm ? "active" : ""}`}>
          +
        </span>
      </button>

      <div className={`fiok-password-form-wrap ${showPasswordForm ? "open" : ""}`}>
        <form className="fiok-password-form" onSubmit={handlePasswordChange}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Jelenlegi jelszó"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
            className="fiok-input"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="Új jelszó"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
            className="fiok-input"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Új jelszó megerősítése"
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
            className="fiok-input"
          />

          <button
            type="submit"
            className="fiok-save-password-btn"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Mentés..." : "Jelszó mentése"}
          </button>
        </form>
      </div>
    </div>
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
                    <td>{getStatusText(order.status)}</td>
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