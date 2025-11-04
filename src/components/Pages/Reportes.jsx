import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReporteService from "../../services/ReporteService";
import AlumnoService from "../../services/AlumnoService";
import "../styles/Reportes.css";

function Reportes() {
  const [busqueda, setBusqueda] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [mensaje, setMensaje] = useState("");


  useEffect(() => {
    if (!busqueda.trim() || alumnoSeleccionado) {
      setAlumnos([]);
      return;
    }

    const fetchAlumnos = async () => {
      setLoadingAlumnos(true);
      try {
        const data = await AlumnoService.searchAlumnos(busqueda);
        setAlumnos(data);
      } catch (error) {
        console.error("Error en la búsqueda:", error);
      } finally {
        setLoadingAlumnos(false);
      }
    };

    const debounce = setTimeout(fetchAlumnos, 400)
    return () => clearTimeout(debounce);
  }, [busqueda, alumnoSeleccionado]);


  const seleccionarAlumno = async (alumno) => {
    setAlumnoSeleccionado(alumno);
    setBusqueda(`${alumno.nombres} ${alumno.apellidos}`);
    setAlumnos([]);

    try {
      const data = await ReporteService.getCursosPorAlumno(alumno.id);
      setCursos(data);
      setMensaje("");
    } catch (error) {
      console.error("Error cargando cursos:", error);
      setMensaje("No se encontraron cursos para este alumno.");
      setCursos([]);
    }
  };

  return (
    <div className="reportes-page">
      <Link to="/matricular">
        <button className="btn btn-secondary">Matricular Alumno +</button>
      </Link>

      <input
        type="text"
        placeholder="Buscar alumno por nombre o apellido"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setAlumnoSeleccionado(null);
        }}
      />

      {loadingAlumnos && <p>Buscando alumnos...</p>}

      {alumnos.length > 0 && (
        <div className="dropdown-alumnos">
          {alumnos.map((alumno) => (
            <div
              key={alumno.id}
              className="dropdown-opcion"
              onClick={() => seleccionarAlumno(alumno)}
            >
              {alumno.nombres} {alumno.apellidos}
            </div>
          ))}
        </div>
      )}

      {mensaje && <p>{mensaje}</p>}

      {cursos.length > 0 && (
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
            {cursos.map((matricula, index) => (
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
  );
}

export default Reportes;
