import AuthService from "./AuthService"; 

const API = "https://psis-2025.onrender.com/api/alumnos"; //define la url base


const AlumnoService = {

  //obtener todos los alumnos del back
  getAlumnos: async () => {
    try {
      const res = await fetch(API, { headers: AuthService.getAuthHeaders() }); //realiza una peticion GET al api

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

  //agrega los alummos nuevos
  addAlumno: async (alumno) => {
  try {
    const res = await fetch(API, { //realiza una peticion POST al url
      method: "POST",
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify({ id: 0, ...alumno }) // incluye id por si el backend lo necesita
    });
    if (!res.ok) throw new Error("Error al agregar alumno");
    return await res.json();
  } catch (error) {
    console.error("AlumnoService.addAlumno:", error);
    throw error;
  }
},

//updatea la lista de alumnos 
updateAlumno: async (id, alumno) => {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(alumno)
    });
    if (!res.ok) throw new Error("Error al actualizar alumno");
    return await res.json();
  } catch (error) {
    console.error("AlumnoService.updateAlumno:", error);
    throw error;
  }
},

//elimina alumnos 
deleteAlumno: async (id) => {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: AuthService.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al eliminar alumno");
    return true; 
  } catch (error) {
    console.error("AlumnoService.deleteAlumno:", error);
    throw error;
  }
},


//buscar alumnos x nombre o ci
 searchAlumnos: async (query) => {
  try {
    const res = await fetch(`${API}?search=${encodeURIComponent(query)}`, {
      headers: AuthService.getAuthHeaders()
    });
    if (!res.ok) throw new Error("Error al buscar alumnos");
    return await res.json();
  } catch (error) {
    console.error("AlumnoService.searchAlumnos:", error);
    throw error;
  }
}
};


export default AlumnoService;
