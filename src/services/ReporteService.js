import AuthService from "./AuthService";


const API = "https://psis-2025.onrender.com/api/matriculas";

const ReporteService = {

  getAlumnos: async () => {
    try {
      const res = await fetch(`${API}/alumnos`, {
        headers: AuthService.getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error("Error al obtener alumnos");
      }

      return await res.json(); 
    } catch (error) {
      console.error("ReporteService.getAlumnos:", error);
      throw error;
    }
  },


  getCursosPorAlumno: async (alumnoId) => {
    try {
      const res = await fetch(`${API}/alumno/${alumnoId}`, {
        headers: AuthService.getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error("No se encontraron cursos para este alumno");
      }

      return await res.json(); 
    } catch (error) {
      console.error("ReporteService.getCursosPorAlumno:", error);
      throw error;
    }
  }

};

export default ReporteService;
