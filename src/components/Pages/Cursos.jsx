import React, { useState, useEffect } from "react";
import "../styles/Cursos.css";
import "../styles/Buttons.css";
import CursoService from "../../services/CursoService";
import InscripcionService from "../../services/InscripcionService";
import AlumnoService from "../../services/AlumnoService";

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // inscripciones x curso
  const [inscripcionesPorCurso, setInscripcionesPorCurso] = useState({});
  const [cargandoAlumnos, setCargandoAlumnos] = useState({});

  // pop-up de matriculacion
  const [modalVisible, setModalVisible] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [alumnosDisponibles, setAlumnosDisponibles] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");

  //buscar cursos por alumno
  const [busquedaAlumno, setBusquedaAlumno] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [alumnoBuscado, setAlumnoBuscado] = useState(null);
  const [cursosPorAlumno, setCursosPorAlumno] = useState([]);

  //llamar los cursos del back
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

  //mostar slash ocultar alumnos por curso
  const toggleAlumnos = async (cursoId) => {
    if (inscripcionesPorCurso[cursoId]) {
      setInscripcionesPorCurso((prev) => ({ ...prev, [cursoId]: null }));
      return;
    }

    setCargandoAlumnos((prev) => ({ ...prev, [cursoId]: true })); //mostrar indicacion de q cargan los alumnos
    try {
      const inscripciones = await InscripcionService.getAlumnosPorCurso(cursoId);  //llama api para ver matrc
      setInscripcionesPorCurso((prev) => ({ ...prev, [cursoId]: inscripciones }));
    } catch (error) {
      console.error(error);
      setInscripcionesPorCurso((prev) => ({ ...prev, [cursoId]: [] }));
    } finally {
      setCargandoAlumnos((prev) => ({ ...prev, [cursoId]: false }));
    }
  };

  // pop up matricular
  const abrirModalMatricula = async (curso) => { //configura el popup
    setCursoSeleccionado(curso);
    setModalVisible(true);
    setAlumnoSeleccionado("");
//lama a todos los alumnos ya matriculados en dicho curso
    try {
      const todos = await AlumnoService.getAlumnos();
      const inscritos = await InscripcionService.getAlumnosPorCurso(curso.id);
      const disponibles = todos.filter( //calcula que alumnos quedan disponibles para matricular 
        (a) => !inscritos.some((i) => i.alumno.id === a.id) 
      );
      setAlumnosDisponibles(disponibles);
    } catch (error) {
      console.error(error);
      setAlumnosDisponibles([]);
    }
  };

  const matricularAlumno = async () => { //envia la matricula 
    if (!alumnoSeleccionado) return;

    try {
      await InscripcionService.matricular({ 
        alumnoId: alumnoSeleccionado.toString(),
        cursoId: cursoSeleccionado.id.toString(),
      });

      // Actualizar inscripciones del curso
      const inscripciones = await InscripcionService.getAlumnosPorCurso(cursoSeleccionado.id);
      setInscripcionesPorCurso((prev) => ({
        ...prev,
        [cursoSeleccionado.id]: inscripciones,
      }));

      setModalVisible(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo matricular al alumno.");
    }
  };

  // delete matriculado
  const eliminarMatricula = async (inscripcionId, cursoId) => { 
    if (!window.confirm("¿Seguro que deseas eliminar esta matrícula?")) return;

    try {
      await InscripcionService.eliminar(inscripcionId); //llama a la api delete
      const inscripciones = await InscripcionService.getAlumnosPorCurso(cursoId); //refreca la lista 
      setInscripcionesPorCurso((prev) => ({ ...prev, [cursoId]: inscripciones }));
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la matrícula.");
    }
  };

  //busqueda componente 
useEffect(() => {
  const delay = setTimeout(async () => { //debounce pa q nomas se ejecute cuando el user deje de tipear
    if (!busquedaAlumno.trim() || alumnoBuscado) {
      setResultadosBusqueda([]);
      return;
    }
    try {
      const data = await AlumnoService.getAlumnos(); // Traemos todos los alumnos
      // Filtramos localmente según lo que el usuario escribe
      const filtrados = data.filter((a) =>
        a.nombres.toLowerCase().includes(busquedaAlumno.toLowerCase()) ||
        a.apellidos.toLowerCase().includes(busquedaAlumno.toLowerCase()) ||
        a.ci.includes(busquedaAlumno)
      );
      setResultadosBusqueda(filtrados);
    } catch (error) {
      console.error(error);
      setResultadosBusqueda([]);
    }
  }, 400);

  return () => clearTimeout(delay);
}, [busquedaAlumno, alumnoBuscado]); 


  //cursos por alumno
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
  }, [alumnoBuscado]); //se ejecuta cada q cambie el alumno buscado

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
                    {inscripcionesPorCurso[curso.id] ? "Ocultar alumnos" : "Ver alumnos"}
                  </button>
                  <button onClick={() => abrirModalMatricula(curso)}>Matricular alumno</button>
                </div>

                {cargandoAlumnos[curso.id] && <p>Cargando alumnos...</p>}

                {inscripcionesPorCurso[curso.id] && (
                  <div className="alumnos-lista">
                    {inscripcionesPorCurso[curso.id].length === 0 ? (
                      <p>No hay alumnos matriculados.</p>
                    ) : (
                      <ul>
                        {inscripcionesPorCurso[curso.id].map((i) => (
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
