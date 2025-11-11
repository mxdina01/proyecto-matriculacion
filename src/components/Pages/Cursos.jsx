import React, { useEffect, useState } from "react";
import "../styles/Matricular.css";
import AlumnoService from "../../services/AlumnoService.js";
import CursoService from "../../services/CursoService.js";
import InscripcionService from "../../services/InscripcionService.js";

function Matricular() {
  const [alumnoBusqueda, setAlumnoBusqueda] = useState("");
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [todosAlumnos, setTodosAlumnos] = useState([]); // <-- traemos todos una sola vez

  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");

  const [loadingAlumnos, setLoadingAlumnos] = useState(true);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // Cargar todos los alumnos al inicio
  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const data = await AlumnoService.getAlumnos();
        setTodosAlumnos(data);
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      } finally {
        setLoadingAlumnos(false);
      }
    };
    fetchAlumnos();
  }, []);

  // Cargar cursos
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await CursoService.getCursos();
        setCursos(data);
      } catch (error) {
        console.error("Error al obtener cursos:", error);
      } finally {
        setLoadingCursos(false);
      }
    };
    fetchCursos();
  }, []);

  // Filtrado en tiempo real local
  useEffect(() => {
    if (!alumnoBusqueda.trim() || alumnoSeleccionado) {
      setAlumnosFiltrados([]);
      return;
    }

    const filtrados = todosAlumnos.filter((a) =>
      a.nombres.toLowerCase().includes(alumnoBusqueda.toLowerCase()) ||
      a.apellidos.toLowerCase().includes(alumnoBusqueda.toLowerCase()) ||
      a.ci.includes(alumnoBusqueda)
    );

    setAlumnosFiltrados(filtrados);
  }, [alumnoBusqueda, alumnoSeleccionado, todosAlumnos]);

  const handleSeleccionarAlumno = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setAlumnoBusqueda(`${alumno.nombres} ${alumno.apellidos}`);
    setAlumnosFiltrados([]);
  };

  const handleLimpiarAlumno = () => {
    setAlumnoSeleccionado(null);
    setAlumnoBusqueda("");
    setAlumnosFiltrados([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alumnoSeleccionado || !cursoSeleccionado) {
      setMensaje("Seleccioná un alumno y un curso");
      return;
    }

    try {
      await InscripcionService.matricular({
        alumnoId: alumnoSeleccionado.id,
        cursoId: parseInt(cursoSeleccionado),
      });
      setMensaje(
        `Alumno ${alumnoSeleccionado.nombres} ${alumnoSeleccionado.apellidos} matriculado correctamente.`
      );
      handleLimpiarAlumno();
      setCursoSeleccionado("");
    } catch (error) {
      console.error(error);
      setMensaje("No se pudo matricular al alumno");
    }
  };

  return (
    <div className="matricular-page">
      <div className="form-container">
        <h2>Matricular Alumno</h2>

        <form className="matricular-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="alumno">Alumno:</label>
            <input
              type="text"
              id="alumno"
              placeholder="Nombre o nro de documento"
              value={alumnoBusqueda}
              onChange={(e) => {
                setAlumnoBusqueda(e.target.value);
                setAlumnoSeleccionado(null);
              }}
            />
            {alumnoSeleccionado && (
              <button type="button" onClick={handleLimpiarAlumno}>
                Cambiar
              </button>
            )}
          </div>

          {loadingAlumnos && <p>Cargando alumnos...</p>}

          {alumnosFiltrados.length > 0 && (
            <ul className="alumnos-lista">
              {alumnosFiltrados.map((a) => (
                <li key={a.id} onClick={() => handleSeleccionarAlumno(a)}>
                  {a.nombres} {a.apellidos} - {a.ci}
                </li>
              ))}
            </ul>
          )}

          <div className="form-group">
            <label htmlFor="curso">Curso:</label>
            {loadingCursos ? (
              <p>Cargando cursos...</p>
            ) : (
              <select
                id="curso"
                required
                value={cursoSeleccionado}
                onChange={(e) => setCursoSeleccionado(e.target.value)}
              >
                <option value="">Seleccionar un curso</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loadingAlumnos || loadingCursos}>
            Matricular Alumno
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Matricular;
