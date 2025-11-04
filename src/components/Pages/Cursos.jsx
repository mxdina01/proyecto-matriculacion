import React, { useState, useEffect } from "react";
import "../styles/cursos.css";
import CursoService from "../../services/CursoService";
import InscripcionService from "../../services/InscripcionService";
import AuthService from "../../services/AuthService";

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [alumnosPorCurso, setAlumnosPorCurso] = useState({});
  const [cargandoAlumnos, setCargandoAlumnos] = useState({});

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await CursoService.getCursos();
        setCursos(data);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
        setMensaje("No se pudieron cargar los cursos.");
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  const toggleAlumnos = async (cursoId) => {
    // Si ya están cargados, los ocultamos
    if (alumnosPorCurso[cursoId]) {
      setAlumnosPorCurso(prev => ({ ...prev, [cursoId]: null }));
      return;
    }

    setCargandoAlumnos(prev => ({ ...prev, [cursoId]: true }));

    try {
      const alumnos = await InscripcionService.getPorCurso(cursoId, AuthService.getToken());
      setAlumnosPorCurso(prev => ({ ...prev, [cursoId]: alumnos }));
    } catch (error) {
      console.error("Error al cargar alumnos del curso:", error);
      setAlumnosPorCurso(prev => ({ ...prev, [cursoId]: [] }));
    } finally {
      setCargandoAlumnos(prev => ({ ...prev, [cursoId]: false }));
    }
  };

  return (
    <div className="cursos-page">
      <div className="header-cursos">
        <h2>Lista de Cursos</h2>
      </div>

      <div className="container-cursos">
        {loading ? (
          <p className="mensaje">Cargando cursos...</p>
        ) : mensaje ? (
          <p className="mensaje">{mensaje}</p>
        ) : cursos.length === 0 ? (
          <p className="mensaje">No hay cursos registrados.</p>
        ) : (
          <ul className="lista-cursos">
            {cursos.map(curso => (
              <li key={curso.id} className="curso-item">
                <div className="curso-header">
                  <span>{curso.nombre}</span>
                  <button onClick={() => toggleAlumnos(curso.id)}>
                    {alumnosPorCurso[curso.id] ? "Ocultar alumnos" : "Ver alumnos"}
                  </button>
                </div>

                {cargandoAlumnos[curso.id] && <p>Cargando alumnos...</p>}

                {alumnosPorCurso[curso.id] && (
                  <div className="alumnos-lista">
                    {alumnosPorCurso[curso.id].length === 0 ? (
                      <p>No hay alumnos matriculados en este curso.</p>
                    ) : (
                      <>
                        <p>Cantidad de alumnos: {alumnosPorCurso[curso.id].length}</p>
                        <ul>
                          {alumnosPorCurso[curso.id].map(alumno => (
                            <li key={alumno.id}>
                              {alumno.nombre} {alumno.apellido}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Cursos;
