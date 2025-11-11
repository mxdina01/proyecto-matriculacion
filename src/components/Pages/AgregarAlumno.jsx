import React, { useState } from "react";
import "../styles/AgregarAlumno.css";
import AlumnoService from "../../services/AlumnoService";
import { useNavigate } from "react-router-dom";

function AgregarAlumno() { //guarda inputs del user para agg alumno
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [ci, setCi] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => { //se dispara cuando el user submitea el form
    e.preventDefault();

    const nuevoAlumno = { nombres, apellidos, ci }; //crea nuevo alumno con said datos 

    try { //llama al POST  del back con los datos del new student
      await AlumnoService.addAlumno(nuevoAlumno);

      setMensaje("Alumno registrado exitosamente"); //if everything goes right 
      setNombres("");
      setApellidos("");
      setCi("");


      setTimeout(() => navigate("/alumnos"), 1500); 


    } catch (error) { //si la api devuelve errores etcc
      console.error("Error al agregar alumno:", error);
      setMensaje("No se pudo registrar el alumno.");
    }
  };

  return (
    <div className="agregar-alumno-page">
      <div className="form-container">
        <h2>Agregar Alumno</h2>
        <form className="alumno-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombres">Nombre (*):</label>
            <input
              type="text"
              id="nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              placeholder="Escribir nombre"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellidos">Apellido (*):</label>
            <input
              type="text"
              id="apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              placeholder="Escribir apellido"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ci">Nro. de documento (*):</label>
            <input
              type="text"
              id="ci"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              placeholder="Número de Cédula"
              required
            />
          </div>

          <button type="submit" className="btn-submit">
            Registrar Alumno
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
}

export default AgregarAlumno;
