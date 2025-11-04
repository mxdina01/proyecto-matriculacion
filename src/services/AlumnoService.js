import AuthService from "./AuthService";

const API = "https://psis-2025.onrender.com/api/alumnos";

const AlumnoService = {

  getAlumnos: async () => {
    try {
      const res = await fetch(API, { headers: AuthService.getAuthHeaders() });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener alumnos");
      }

      return await res.json();
    } catch (error) {
      console.error("AlumnoService.getAlumnos:", error);
      throw error;
    }
  },

  addAlumno: async (alumno) => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(alumno)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al agregar alumno");
      }

      return await res.json();
    } catch (error) {
      console.error("AlumnoService.addAlumno:", error);
      throw error;
    }
  },

  searchAlumnos: async (query) => {
    try {
      const res = await fetch(`${API}?search=${encodeURIComponent(query)}`, {
        headers: AuthService.getAuthHeaders()
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al buscar alumnos");
      }

      return await res.json();
    } catch (error) {
      console.error("AlumnoService.searchAlumnos:", error);
      throw error;
    }
  }
};

export default AlumnoService;
