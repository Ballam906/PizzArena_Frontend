async function fetchUserData(url) {
  const res = await fetch(url);
  const text = await res.text();

  if (res.status === 401) {
    throw new Error("Nincs jogosultság.");
  }

  if (!res.ok) {
    throw new Error("Sikertelen lekérés.");
  }

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Érvénytelen JSON válasz érkezett a szervertől.");
    }
  }

  return data.result;
}

export async function getPublicUser(id) {
  return fetchUserData(`/api/User/${id}`);
}

export async function getAllPublicUsers() {
  return fetchUserData("/api/User");
}