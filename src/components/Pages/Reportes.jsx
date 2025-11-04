import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Reportes.css";
import ReporteService from "../../services/ReporteService";
import AuthService from "../../services/AuthService";

function Reportes() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!alumnoBusqueda.trim() || alumnoSeleccionado) {
      setAlumnosFiltrados([]);
      return;
    }

    const fetchAlumnos = async () => {
      setLoadingAlumnos(true);
      try {
      
        const data = await AlumnoService.searchAlumnos(alumnoBusqueda); 
        setAlumnosFiltrados(data);
      } catch (error) {
        console.error("Error al buscar alumnos:", error);
      } finally {
        setLoadingAlumnos(false);
      }
    };

    fetchAlumnos();
  }, [alumnoBusqueda, alumnoSeleccionado]);

  const handleSeleccionarAlumno = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setAlumnoBusqueda(`${alumno.nombres} ${alumno.apellidos}`);
    setAlumnosFiltrados([]);
  };
  return (
    <div className="reportes-page">
      <Link to="/matricular">
        <button className="btn btn-secondary">Matricular Alumno +</button>
      </Link>

      <div className="buscar-matriculados">
        <input
          type="text"
          placeholder="Ingresar cédula"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="lista-matriculados">
        {loading ? (
          <p className="mensaje">Cargando resultados...</p>
        ) : mensaje ? (
          <p className="mensaje">{mensaje}</p>
        ) : resultados.length === 0 ? (
          <p className="mensaje">Ingrese una cédula para ver los cursos.</p>
        ) : (
          <table className="tabla-matriculados">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Documento</th>
                <th>Curso</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((matricula, index) => (
                <tr key={index}>
                  <td>{matricula.alumno.nombre}</td>
                  <td>{matricula.alumno.apellido}</td>
                  <td>{matricula.alumno.documento}</td>
                  <td>{matricula.curso.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Reportes;
