import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlumnoService from "../../services/AlumnoService";
import "../styles/Alumnos.css";
import "../styles/Buttons.css";

function Alumnos() {
  // 1. Estados principales
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // 2. Función de carga de alumnos
  const fetchAlumnos = async () => {
    setLoading(true);
    // Limpiar errores anteriores antes de la nueva petición
    setError(""); 
    try {
      const response = await AlumnoService.getAlumnos();
      // Asumiendo que el servicio devuelve directamente el array de alumnos, no 'response.data'
      setAlumnos(response); 
    } catch (err) {
      console.error("Error en fetchAlumnos:", err);
      setError("Error al cargar los alumnos. Verifique la conexión con el servidor.");
      // Opcional: limpiar la lista de alumnos al fallar
      setAlumnos([]); 
    } finally {
      setLoading(false);
    }
  };

  // 3. useEffect para carga inicial
  useEffect(() => {
    fetchAlumnos();
  }, []);

  // 4. Función de eliminación
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este alumno?")) return;

    try {
      await AlumnoService.deleteAlumno(id);
      // Actualiza el estado local para eliminar el alumno de la lista sin recargar
      setAlumnos(alumnos.filter((a) => a.id !== id));
      alert("Alumno eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar el alumno.");
    }
  };

  // 5. Filtrado de alumnos (Lógica de búsqueda)
  const filteredAlumnos = alumnos.filter((alumno) =>
    `${alumno.nombres} ${alumno.apellidos}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 6. Renderizado del componente
  return (
    <div className="alumnos-page">
      <h2>Lista de Alumnos</h2>
      <Link to="/AgregarAlumno">
        <button className="btn btn-filled">Agregar Alumno</button>
      </Link>

      <div className="alumnos-list-container">
        <input
          type="text"
          placeholder="Buscar alumno..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {/* Mensajes de estado */}
        {loading && <p>Cargando alumnos...</p>}
        
        {/* Muestra el mensaje de error si existe */}
        {error && <p className="error-message">{error}</p>} 

        {/* CONDICIÓN CORREGIDA: Muestra "No hay alumnos" SOLO si NO está cargando,
          NO hay un error de conexión, Y la lista filtrada está vacía. 
        */}
        {!loading && !error && filteredAlumno.length === 0 && (
          <p>No hay alumnos que coincidan.</p>
        )}

        {/* Renderizado de tarjetas de alumnos */}
        {!loading && filteredAlumnos.map((alumno) => (
          <div className="alumno-card" key={alumno.id}>
            <p>
              {alumno.nombres} {alumno.apellidos}
            </p>
            <div className="card-buttons">
              <Link to={`/alumnos/editar/${alumno.id}`}>
                <button className="btn btn-outlined">Editar</button>
              </Link>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(alumno.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Alumnos;