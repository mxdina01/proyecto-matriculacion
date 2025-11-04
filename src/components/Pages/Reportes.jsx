import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/reportes.css";
import ReporteService from "../../services/ReporteService";
import AuthService from "../../services/AuthService";

function Reportes() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setResultados([]);
      setMensaje("");
      return;
    }

    const buscarAlumnoYCursos = async () => {
      setLoading(true);
      setMensaje("");
      try {
        
        const alumnos = await ReporteService.searchAlumnos(query, AuthService.getToken());

        if (alumnos.length === 0) {
          setResultados([]);
          setMensaje("No se encontraron alumnos con esa cédula.");
          return;
        }

        const alumnoFiltrado = alumnos[0]; 

    
        const cursos = await ReporteService.getCursosPorAlumno(alumnoFiltrado.id, AuthService.getToken());

        if (cursos.length === 0) {
          setResultados([]);
          setMensaje(`El alumno ${alumnoFiltrado.nombre} ${alumnoFiltrado.apellido} no está matriculado en ningún curso.`);
          return;
        }

        const matriculas = cursos.map((curso) => ({
          alumno: alumnoFiltrado,
          curso,
        }));

        setResultados(matriculas);
      } catch (error) {
        console.error("Error al buscar matriculados:", error);
        setResultados([]);
        setMensaje("Error al cargar los datos del servidor.");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => buscarAlumnoYCursos(), 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

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
