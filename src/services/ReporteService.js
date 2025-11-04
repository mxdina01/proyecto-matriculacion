import AuthService from "./AuthService";

const API = "https://jpsis-2025.onrender.com/api/reportes";

const ReporteService = {
  getAlumnos: async () => {
    try {
      const res = await fetch(`${API}/alumnos`, { headers: AuthService.getAuthHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error al obtener alumnos");
      }
      return await res.json();
    } catch (error) {
      console.error("ReporteService.getAlumnos:", error);
      throw error;
    }
  },

  getCursosPorAlumno: async (alumnoId) => {
    try {
      const res = await fetch(`${API}/alumno/${alumnoId}/cursos`, { headers: AuthService.getAuthHeaders() });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error al obtener cursos del alumno");
      }
      return await res.json();
    } catch (error) {
      console.error("ReporteService.getCursosPorAlumno:", error);
      throw error;
    }
  }
};

export default ReporteService;
