import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlumnoService from "../../services/AlumnoService";
import InscripcionService from "../../services/InscripcionService";
import "../styles/Alumnos.css";
import "../styles/Buttons.css";

function Alumnos() {
  const [alumnos, setAlumnos] = useState([]); //GUARDA la lista de alumn que viene del server
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); //para la busqueda

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAlumno, setModalAlumno] = useState(null);

  const fetchAlumnos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await AlumnoService.getAlumnos(); //fetchea alumnos del back
      setAlumnos(response);
    } catch (err) {
      console.error("Error en fetchAlumnos:", err);
      setError("Error al cargar los alumnos. Verifique la conexión con el servidor.");
      setAlumnos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const handleDelete = async (id) => { //fetchea la opcion de eliminar alumnos del back
    if (!window.confirm("¿Seguro que querés eliminar este alumno?")) return;
    try {
      await AlumnoService.deleteAlumno(id);
      setAlumnos(alumnos.filter((a) => a.id !== id));
      alert("Alumno eliminado correctamente.");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar el alumno.");
    }
  };

  const filteredAlumnos = alumnos.filter((alumno) => //filtra busqueda segun input del user
    `${alumno.nombres} ${alumno.apellidos}`.toLowerCase().includes(search.toLowerCase())
  );

// cerrar modal
const closeModal = () => {
  setModalVisible(false);
  setModalAlumno(null);
};

// modal
const handleView = async (alumno) => {
  try {
    const data = await AlumnoService.getAlumnoById(alumno.id); // info básica
    const cursos = await InscripcionService.getCursosPorAlumno(alumno.id); // cursos donde está matriculado
    setModalAlumno({ ...data, cursos }); // agregamos cursos al modalAlumno
    setModalVisible(true);
  } catch (err) {
    console.error(err);
    alert("No se pudo cargar la información del alumno");
  }
};

//render

  return (
    <div className="alumnos-page">
      <h2>Lista de Alumnos</h2>
      <Link to="/agregaralumno">
        <button className="btn btn-filled">Agregar Alumno</button>
      </Link>
            {/* Modal */}
      {modalVisible && modalAlumno && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3>{modalAlumno.nombres} {modalAlumno.apellidos}</h3>
      <p><strong>CI:</strong> {modalAlumno.ci}</p>
      
      {modalAlumno.cursos && modalAlumno.cursos.length > 0 ? (
        <div>
          <strong>Cursos matriculados:</strong>
          <ul>
            {modalAlumno.cursos.map((c) => (
              <li key={c.id}>{c.nombre}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No está matriculado en ningún curso.</p>
      )}

      <button className="btn btn-outlined" onClick={closeModal}>Cerrar</button>
    </div>
  </div>
)}

      <div className="alumnos-list-container">
        <input
          type="text"
          placeholder="Buscar alumno..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {loading && <p>Cargando alumnos...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && filteredAlumnos.length === 0 && (
          <p>No hay alumnos que coincidan.</p>
        )}

        {!loading && filteredAlumnos.map((alumno) => (
          <div className="alumno-card" key={alumno.id}>
            <p>{alumno.nombres} {alumno.apellidos}</p>
            <div className="card-buttons">
              <button className="btn btn-filled" onClick={() => handleView(alumno)}>
                Ver
              </button>
              <Link to={`/editaralumno/${alumno.id}`}>
                <button className="btn btn-outlined">Editar</button>
              </Link>
              <button className="btn btn-danger" onClick={() => handleDelete(alumno.id)}>
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
