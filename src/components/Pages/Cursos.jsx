import React, { useState, useEffect } from "react";
import "../styles/Cursos.css";
import "../styles/Buttons.css";
import CursoService from "../../services/CursoService";
import InscripcionService from "../../services/InscripcionService";
import AlumnoService from "../../services/AlumnoService";

function Cursos() {
  // --- ESTADOS PRINCIPALES ---
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // --- ALUMNOS POR CURSO ---
  const [alumnosPorCurso, setAlumnosPorCurso] = useState({});
  const [cargandoAlumnos, setCargandoAlumnos] = useState({});

  // --- MODAL MATRICULACIÓN ---
  const [modalVisible, setModalVisible] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [alumnosDisponibles, setAlumnosDisponibles] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");

  // --- BUSQUEDA CURSOS POR ALUMNO ---
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [alumnoBuscado, setAlumnoBuscado] = useState(null);
  const [cursosPorAlumno, setCursosPorAlumno] = useState([]);

  // ------------------- CARGAR CURSOS -------------------
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await CursoService.getCursos();
        setCursos(data);
      } catch (error) {
        console.error(error);
        setMensaje("No se pudieron cargar los cursos.");
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  // ------------------- TOGGLE ALUMNOS POR CURSO -------------------
  const toggleAlumnos = async (cursoId) => {
    if (alumnosPorCurso[cursoId]) {
      setAlumnosPorCurso((prev) => ({ ...prev, [cursoId]: null }));
      return;
    }

    setCargandoAlumnos((prev) => ({ ...prev, [cursoId]: true }));
    try {
      // Usar getPorCurso para obtener ID de inscripciones
      const alumnos = await InscripcionService.getPorCurso(cursoId);
      setAlumnosPorCurso((prev) => ({ ...prev, [cursoId]: alumnos }));
    } catch (error) {
      console.error(error);
      setAlumnosPorCurso((prev) => ({ ...prev, [cursoId]: [] }));
    } finally {
      setCargandoAlumnos((prev) => ({ ...prev, [cursoId]: false }));
    }
  };

  // ------------------- MODAL MATRICULAR -------------------
  const abrirModalMatricula = async (curso) => {
    setCursoSeleccionado(curso);
    setModalVisible(true);
    setAlumnoSeleccionado("");

    try {
      const todos = await AlumnoService.getAlumnos();
      const inscritos = await InscripcionService.getAlumnosPorCurso(curso.id);
      const disponibles = todos.filter(
        (a) => !inscritos.some((i) => i.id === a.id)
      );
      setAlumnosDisponibles(disponibles);
    } catch (error) {
      console.error(error);
      setAlumnosDisponibles([]);
    }
  };

  const matricularAlumno = async () => {
    if (!alumnoSeleccionado) return;
    try {
      await InscripcionService.matricular({
        alumnoId: alumnoSeleccionado.toString(),
        cursoId: cursoSeleccionado.id.toString(),
      });

      // Actualizar lista de alumnos en la card
      const alumnos = await InscripcionService.getPorCurso(cursoSeleccionado.id);
      setAlumnosPorCurso((prev) => ({ ...prev, [cursoSeleccionado.id]: alumnos }));
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo matricular al alumno.");
    }
  };

  // ------------------- ELIMINAR MATRICULA -------------------
  const eliminarMatricula = async (inscripcionId, cursoId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta matrícula?")) return;

    try {
      await InscripcionService.eliminar(inscripcionId);
      const alumnos = await InscripcionService.getPorCurso(cursoId);
      setAlumnosPorCurso((prev) => ({ ...prev, [cursoId]: alumnos }));
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la matrícula.");
    }
  };

  // ------------------- BUSCAR ALUMNOS (AUTOCOMPLETE) -------------------
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!busquedaAlumno.trim() || alumnoBuscado) {
        setResultadosBusqueda([]);
        return;
      }
      try {
        const data = await AlumnoService.searchAlumnos(busquedaAlumno);
        setResultadosBusqueda(data);
      } catch (error) {
        console.error(error);
        setResultadosBusqueda([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [busquedaAlumno, alumnoBuscado]);

  // ------------------- OBTENER CURSOS POR ALUMNO -------------------
  useEffect(() => {
    const fetchCursosPorAlumno = async () => {
      if (!alumnoBuscado) {
        setCursosPorAlumno([]);
        return;
      }
      try {
        const data = await InscripcionService.getCursosPorAlumno(alumnoBuscado.id);
        setCursosPorAlumno(data);
      } catch (error) {
        console.error(error);
        setCursosPorAlumno([]);
      }
    };
    fetchCursosPorAlumno();
  }, [alumnoBuscado]);

  const seleccionarAlumnoBuscado = (alumno) => {
    setAlumnoBuscado(alumno);
    setBusquedaAlumno(`${alumno.nombres} ${alumno.apellidos}`);
    setResultadosBusqueda([]);
  };

  // ------------------- RENDER -------------------
  return (
    <div className="cursos-page">
      <div className="header-cursos">
        <h2>Lista de Cursos</h2>
      </div>

      {/* BUSCADOR DE CURSOS POR ALUMNO */}
      <div className="busqueda-alumno">
        <h3>Buscar cursos por alumno</h3>
        <input
          type="text"
          placeholder="Nombre o CI del alumno..."
          value={busquedaAlumno}
          onChange={(e) => {
            setBusquedaAlumno(e.target.value);
            setAlumnoBuscado(null);
          }}
        />
        {resultadosBusqueda.length > 0 && !alumnoBuscado && (
          <ul className="alumnos-lista">
            {resultadosBusqueda.map((a) => (
              <li key={a.id} onClick={() => seleccionarAlumnoBuscado(a)}>
                {a.nombres} {a.apellidos} - {a.ci}
              </li>
            ))}
          </ul>
        )}

        {cursosPorAlumno.length > 0 && (
          <div className="cursos-del-alumno">
            <h4>Cursos donde está matriculado:</h4>
            <ul>
              {cursosPorAlumno.map((c) => (
                <li key={c.id}>{c.nombre}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* LISTA DE CURSOS EN CARDS */}
      <div className="cursos-container">
        {loading ? (
          <p>Cargando cursos...</p>
        ) : cursos.length === 0 ? (
          <p>No hay cursos registrados.</p>
        ) : (
          <div className="cards-grid">
            {cursos.map((curso) => (
              <div key={curso.id} className="curso-card">
                <h3>{curso.nombre}</h3>

                <div className="card-buttons">
                  <button onClick={() => toggleAlumnos(curso.id)}>
                    {alumnosPorCurso[curso.id] ? "Ocultar alumnos" : "Ver alumnos"}
                  </button>
                  <button onClick={() => abrirModalMatricula(curso)}>Matricular alumno</button>
                </div>

                {cargandoAlumnos[curso.id] && <p>Cargando alumnos...</p>}

                {alumnosPorCurso[curso.id] && (
                  <div className="alumnos-lista">
                    {alumnosPorCurso[curso.id].length === 0 ? (
                      <p>No hay alumnos matriculados.</p>
                    ) : (
                      <ul>
                        {alumnosPorCurso[curso.id].map((i) => (
                          <li key={i.id}>
                            {i.alumno.nombres} {i.alumno.apellidos}{" "}
                            <button
                              className="btn-eliminar"
                              onClick={() => eliminarMatricula(i.id, curso.id)}
                            >
                              Eliminar
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE MATRICULACIÓN */}
      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h3>Matricular alumno en {cursoSeleccionado.nombre}</h3>
            {alumnosDisponibles.length === 0 ? (
              <p>No hay alumnos disponibles para matricular.</p>
            ) : (
              <>
                <select
                  value={alumnoSeleccionado}
                  onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                >
                  <option value="">Selecciona un alumno</option>
                  {alumnosDisponibles.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombres} {a.apellidos}
                    </option>
                  ))}
                </select>
                <div className="modal-buttons">
                  <button onClick={matricularAlumno}>Matricular</button>
                  <button onClick={() => setModalVisible(false)}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cursos;
