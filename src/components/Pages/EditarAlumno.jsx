import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AlumnoService from "../../services/AlumnoService";
import "../styles/EditarAlumno.css";
import "../styles/Buttons.css";

// Página para editar un alumno existente
function EditarAlumno() {
  // 1. Estados principales
  const [alumno, setAlumno] = useState({
    nombres: "",
    apellidos: "",
    ci: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); // obtiene el id desde la URL

  // 2. Función para cargar los datos del alumno
  const fetchAlumno = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await AlumnoService.getAlumnoById(id); // necesitas agregar esta función en AlumnoService
      setAlumno(data);
    } catch (err) {
      console.error("Error al cargar alumno:", err);
      setError("No se pudo cargar el alumno. Verifique la conexión.");
    } finally {
      setLoading(false);
    }
  };

  // 3. useEffect para cargar alumno al montar el componente
  useEffect(() => {
    fetchAlumno();
  }, [id]);

  // 4. Función para manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlumno((prev) => ({ ...prev, [name]: value }));
  };

  // 5. Función para enviar los cambios al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await AlumnoService.updateAlumno(id, alumno);
      alert("Alumno actualizado correctamente.");
      navigate("/alumnos"); // vuelve a la lista de alumnos
    } catch (err) {
      console.error("Error al actualizar alumno:", err);
      setError("No se pudo actualizar el alumno.");
    }
  };

  // 6. Renderizado del componente
  return (
    <div className="alumnos-page">
      <h2>Editar Alumno</h2>
<div className="editar-container">
      {loading ? (
        <p>Cargando datos del alumno...</p>
      ) : (
        <form onSubmit={handleSubmit} className="alumno-form">
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={alumno.nombres}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={alumno.apellidos}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="ci"
            placeholder="Cédula"
            value={alumno.ci}
            onChange={handleChange}
            required
          />
       
          <div className="card-buttons">
            <button type="submit" className="btn-guardar">Guardar cambios</button>
            <Link to="/alumnos">
              <button type="button" className="btn-cancelar">Cancelar</button>
            </Link>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </div>
    </div>
    

  );
}

export default EditarAlumno;
