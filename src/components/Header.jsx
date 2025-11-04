import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./styles/Header.css";
import AuthService from "../services/AuthService";
import { useLocation } from "react-router-dom";

function Header(){

  const navigate = useNavigate();
  const location = useLocation();
  const user = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  if (location.pathname=="/login"  || location.pathname === "/register"){
    return null;
  } 

    return (
        <header className="header">
            <h2>PSIS - Matriculacion</h2>
        <nav className="nav">
        <NavLink to="/home" end>INICIO</NavLink>
        <NavLink to="/alumnos">ALUMNOS</NavLink>
        <NavLink to="/reportes">MATRICULAS</NavLink>
        <NavLink to="/cursos">CURSOS</NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>Cerrar Sesión</button>

    </header>
  );
}



export default Header;