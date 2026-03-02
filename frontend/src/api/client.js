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

export async function postOrder(payload) {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/Order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || ("API hiba: " + res.status));
  }

  // ha a backend nem ad vissza body-t, ez elhasalna -> ezért védjük
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return await res.json();
  return await res.text();
}
