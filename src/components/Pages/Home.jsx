import React from "react";
import "../styles/home.css";
import eyeicon from "../../assets/eye.png";
import plus from "../../assets/plus-small.png";
import alumno from "../../assets/alumnos.png";
import cursos from "../../assets/cursos.png";
import inscripciones from "../../assets/matricularse.png";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

function Home() {

  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  }

  return (
  
    <div className="home-container">
      <div className="top">
        <h1>Sistema de Matriculación PSIS</h1>
        <p>Gestión de alumnos, listado de cursos y matriculaciones.</p>
      </div>


      <div className="cards-container">

        <div className="card card-alumnos">
        
          <img src={alumno} className="card-icon" />
            <h2>Alumnos</h2>
            <p>Ver listado de alumnos y gestion</p>
           <div className="card-buttons">
            <Link to="/alumnos">
          <button className="btn btn-outlined"><img src={eyeicon} className="btn-icon"/>
            Ver alumnos</button>
          </Link>
          <Link to="/agregaralumno">
           <button className="btn btn-filled"><img src={plus} className="btn-icon" />
            Agregar alumnos</button></Link>
           </div>
           </div>

           <div className="card card-cursos">

              
              <img src={cursos} className="card-icon"/>
              <h2>Cursos</h2>
              <p>Ver listado de cursos disponibles.</p>
             <div className="card-buttons">
                <Link to="/cursos">
             <button className="btn btn-outlined"><img src={eyeicon} className="btn-icon"/>
              Ver cursos</button>
             </Link>

             </div>
             </div>
             

             <div className="card card-inscripciones">     
              
              <img src={inscripciones} className="card-icon"/>
              <h2>Inscripciones</h2>
              <p>Inscripcion a cursos y ver alumnos matriculados.</p>
              <div className="card-buttons">
              <Link to="/reportes">
              <button className="btn btn-outlined"><img src={eyeicon} className="btn-icon"/>Ver Inscriptos
                
              </button>
              </Link>
              <Link to="/matricular">
               <button className="btn btn-filled"><img src={plus} className="btn-icon" />Matricular Alumno</button>
               </Link>
               </div>
               </div>
              
         </div>
</div>
    


  );
}




export default Home;
