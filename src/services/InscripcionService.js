import AuthService from "./AuthService";

const API = "https://psis-2025.onrender.com/api/inscripciones";

const InscripcionService = {
  // Matricular un alumno en un curso
  matricular: async ({ alumnoId, cursoId }) => {
    try {
      const res = await fetch(`${API}/matricular`, {
        method: "POST",
        headers: {
          ...AuthService.getAuthHeaders(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ alumnoId, cursoId })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Error al matricular alumno");
      return data;
    } catch (error) {
      console.error("InscripcionService.matricular:", error);
      throw error;
    }
  },

  // Obtener alumnos de un curso
  getAlumnosPorCurso: async (cursoId) => {
  try {
    const res = await fetch(`https://psis-2025.onrender.com/api/inscripciones/por-curso/${cursoId}`, {
      headers: AuthService.getAuthHeaders(),
    });
    const data = await res.json().catch(() => ([]));
    if (!res.ok) throw new Error(data.message || "Error al obtener alumnos por curso");
    return data;
  } catch (error) {
    console.error("InscripcionService.getAlumnosPorCurso:", error);
    throw error;
  }
},


  // Obtener cursos de un alumno
  getCursosPorAlumno: async (alumnoId) => {
    try {
      const res = await fetch(`${API}/reporte/cursos-por-alumno/${alumnoId}`, {
        headers: AuthService.getAuthHeaders()
      });
      const data = await res.json().catch(() => ([]));
      if (!res.ok) throw new Error(data.message || "Error al obtener cursos por alumno");
      return data;
    } catch (error) {
      console.error("InscripcionService.getCursosPorAlumno:", error);
      throw error;
    }
  },

  // Eliminar inscripción por ID
  eliminar: async (inscripcionId) => {
    try {
      const res = await fetch(`${API}/${inscripcionId}`, {
        method: "DELETE",
        headers: AuthService.getAuthHeaders()
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error al eliminar inscripción");
      }
      return true;
    } catch (error) {
      console.error("InscripcionService.eliminar:", error);
      throw error;
    }
  }
};

export default InscripcionService;
