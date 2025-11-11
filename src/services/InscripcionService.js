const API = "https://psis-2025.onrender.com/api/inscripciones";

const InscripcionService = {
  matricular: async ({ alumnoId, cursoId }) => {
    const res = await fetch(`${API}/matricular`, {
      method: "POST",
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify({ alumnoId, cursoId })
    });
    if (!res.ok) throw new Error("Error al matricular alumno");
    return await res.json();
  },

  // Alumnos por curso (reporte completo)
  getAlumnosPorCurso: async (cursoId) => {
    const res = await fetch(`${API}/reporte/alumnos-por-curso/${cursoId}`, { headers: AuthService.getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener alumnos por curso");
    return await res.json();
  },

  // Cursos por alumno (reporte completo)
  getCursosPorAlumno: async (alumnoId) => {
    const res = await fetch(`${API}/reporte/cursos-por-alumno/${alumnoId}`, { headers: AuthService.getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener cursos por alumno");
    return await res.json();
  },

  // Mantener endpoints antiguos si los necesitas
  getPorCurso: async (cursoId) => {
    const res = await fetch(`${API}/por-curso/${cursoId}`, { headers: AuthService.getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener inscripciones por curso");
    return await res.json();
  },

  getPorAlumno: async (alumnoId) => {
    const res = await fetch(`${API}/por-alumno/${alumnoId}`, { headers: AuthService.getAuthHeaders() });
    if (!res.ok) throw new Error("Error al obtener inscripciones por alumno");
    return await res.json();
  },

  eliminar: async (id) => {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: AuthService.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al eliminar inscripción");
    return true;
  }
};
