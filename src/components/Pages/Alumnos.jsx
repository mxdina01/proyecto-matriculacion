import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlumnoService from "../../services/AlumnoService";
import "../styles/Alumnos.css";
import "../styles/Buttons.css";

function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAlumno, setModalAlumno] = useState(null);

  const fetchAlumnos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await AlumnoService.getAlumnos();
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

  const handleDelete = async (id) => {
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

  const filteredAlumnos = alumnos.filter((alumno) =>
    `${alumno.nombres} ${alumno.apellidos}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (alumno) => {
    setModalAlumno(alumno);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setModalAlumno(null);
  };

  return (
    <div className="alumnos-page">
      <h2>Lista de Alumnos</h2>
      <Link to="/agregaralumno">
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

      {/* Modal */}
      {modalVisible && modalAlumno && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modalAlumno.nombres} {modalAlumno.apellidos}</h3>
            <p><strong>CI:</strong> {modalAlumno.ci}</p>
            <p><strong>Curso:</strong> {modalAlumno.curso || "No asignado"}</p>
            <button className="btn btn-outlined" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alumnos;
