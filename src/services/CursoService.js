import AuthService from "./AuthService";

const API = "https://psis-2025.onrender.com/api/cursos";

const CursoService = {
  getCursos: async () => {
    try {
      const res = await fetch(API, { headers: AuthService.getAuthHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error al obtener cursos");
      }
      return await res.json();
    } catch (error) {
      console.error("CursoService.getCursos:", error);
      throw error;
    }
  }
};

export default CursoService;
