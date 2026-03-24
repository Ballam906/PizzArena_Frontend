export async function getTermekek() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/Product", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || ("API hiba: " + res.status));
  }

  return await res.json();
}

export async function postOrder(data) {
  const token = localStorage.getItem("token");

  console.log("TOKEN POSTORDER:", token);

  const res = await fetch("https://localhost:7218/api/Order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const text = await res.text();
  console.log("ORDER STATUS:", res.status);
  console.log("ORDER RESPONSE:", text);

  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { raw: text };
  }

  if (!res.ok) {
    throw new Error(result?.message || result?.raw || `API hiba: ${res.status}`);
  }

  return result;
}