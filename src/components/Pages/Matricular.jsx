import React, { useEffect, useState } from "react";
import "../styles/Matricular.css";
import AuthService from "../../services/AuthService.js";
import AlumnoService from "../../services/AlumnoService.js";
import CursoService from "../../services/CursoService.js";

function Matricular() {
  const [alumnoBusqueda, setAlumnoBusqueda] = useState("");
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");

  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [mensaje, setMensaje] = useState("");


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

  const handleLimpiarAlumno = () => {
    setAlumnoSeleccionado(null);
    setAlumnoBusqueda("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alumnoSeleccionado || !cursoSeleccionado) {
      setMensaje("Seleccioná un alumno y un curso");
      return;
    }

    try {
      await fetch(`https://psis-2025.onrender.com/api/matriculas`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Authorization": `Bearer ${AuthService.getToken()}`
         },
        body: JSON.stringify({
          alumnoId: alumnoSeleccionado.id,
          cursoId: parseInt(cursoSeleccionado),
        }),
      });

      setMensaje(
        `Alumno ${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido} matriculado correctamente.`
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
              onChange={(e) => setAlumnoBusqueda(e.target.value)}
              disabled={!!alumnoSeleccionado}
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
