export const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function getTermekek() {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/Product", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) throw new Error("API hiba: " + res.status);
  const data = await res.json();
  return data.result;
}
