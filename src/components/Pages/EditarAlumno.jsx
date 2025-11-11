// AlumnoService.js
import AuthService from "./AuthService";

const API = "https://psis-2025.onrender.com/api/alumnos";

const AlumnoService = {
  // ...otras funciones

  // Obtener un alumno por su ID
  getAlumnoById: async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        headers: AuthService.getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Error al obtener el alumno");
      return await res.json();
    } catch (error) {
      console.error("AlumnoService.getAlumnoById:", error);
      throw error;
    }
  },

  // Actualizar alumno
  updateAlumno: async (id, alumno) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: AuthService.getAuthHeaders(),
        body: JSON.stringify(alumno),
      });
      if (!res.ok) throw new Error("Error al actualizar alumno");
      return await res.json();
    } catch (error) {
      console.error("AlumnoService.updateAlumno:", error);
      throw error;
    }
  },
};

export default AlumnoService;
