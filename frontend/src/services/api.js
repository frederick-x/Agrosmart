// All communication with the Flask REST API lives here.
const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw Object.assign(new Error("Cannot reach the server. Please check that the backend is running."), { errors: {} });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    throw Object.assign(new Error(data.message || "Something went wrong."), { errors: data.errors || {}, status: res.status });
  }
  return data;
}

export const api = {
  register: (b) => request("/register", { method: "POST", body: b, auth: false }),
  login: (b) => request("/login", { method: "POST", body: b, auth: false }),
  predict: (b) => request("/predict", { method: "POST", body: b }),
  crops: (search = "") => request(`/crops?search=${encodeURIComponent(search)}`, { auth: false }),
  crop: (id) => request(`/crops/${id}`, { auth: false }),
  recommendations: (savedOnly = false) => request(`/recommendations${savedOnly ? "?saved=1" : ""}`),
  saveRecommendation: (id) => request("/recommendations", { method: "POST", body: { recommendation_id: id } }),
};
