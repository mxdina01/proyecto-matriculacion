import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlumnoService from "../../services/AlumnoService";
import "../styles/Alumnos.css";

function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);


  const cargarAlumnos = async () => {
    try {
      const data = await AlumnoService.getAlumnos();
      setAlumnos(data);
    } catch (error) {
      console.error("Error al cargar alumnos:", error);
    } finally {
    setLoading(false);
  }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  return (
    <div className="alumnos-page">
      <div className="header-alumnos">
        <h2>Lista de Alumnos</h2>
        <Link to="/agregaralumno">
          <button className="btn btn-secondary">Agregar Alumno +</button>
        </Link>
      </div>

      {mensaje && <p>{mensaje}</p>}

      <div className="lista-alumnos">
        {loading ? (
        <p>Cargando alumnos...</p>
           ) : alumnos.length === 0 ? (
             <p>Aún no hay alumnos registrados</p>
                ) : (
          <table className="tabla-alumnos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Documento</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno.id}>
                  <td>{alumno.id}</td>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.apellido}</td>
                  <td>{alumno.documento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Alumnos;
