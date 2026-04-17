export async function getTermekek() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/Product", {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API hiba: ${res.status}`);
  }

  return res.json();
}

export async function postOrder(data) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Nincs token a localStorage-ben.");
  }

  const res = await fetch("/api/Order/FullOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const text = await res.text();

  let result = {};

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }
  }

  if (!res.ok) {
    throw new Error(result.message || result.raw || `API hiba: ${res.status}`);
  }

  return result;
}