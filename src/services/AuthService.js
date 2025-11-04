const API_URL = import.meta.env.VITE_API_URL + "/api/auth/";

const AuthService = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || "Error al registrar usuario");
    }

    return true;
  },

  login: async (username, password) => {
    const res = await fetch(`${API_URL}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Credenciales inválidas");

    localStorage.setItem("user", JSON.stringify(data));
    return data;
  },

  logout: () => localStorage.removeItem("user"),

  getCurrentUser: () => JSON.parse(localStorage.getItem("user") || "null"),

  getToken: () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?.token || null;
  },

  getAuthHeaders: () => {
    const token = AuthService.getToken();
    return token ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
  },
};

export default AuthService;
