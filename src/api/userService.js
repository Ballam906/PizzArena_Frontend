export async function getPublicUser(id) {
  const res = await fetch(`/api/User/${id}`);

  const text = await res.text();

  if (res.status === 401) {
    throw new Error("Nincs jogosultság.");
  }

  if (!res.ok) {
    throw new Error("Sikertelen lekérés.");
  }

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Érvénytelen JSON válasz érkezett a szervertől.");
  }

  return data.result;
}

export async function getAllPublicUsers() {
  const res = await fetch("/api/User");

  const text = await res.text();

  if (res.status === 401) {
    throw new Error("Nincs jogosultság.");
  }

  if (!res.ok) {
    throw new Error("Sikertelen lekérés.");
  }

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Érvénytelen JSON válasz érkezett a szervertől.");
  }

  return data.result;
}