import React from "react";
import "./components/styles/App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Pages/Home";
import AgregarAlumno from "./components/Pages/AgregarAlumno";
import Alumnos from "./components/Pages/Alumnos";
import Reportes from "./components/Pages/Reportes";
import Matricular from "./components/Pages/Matricular";
import Cursos from "./components/Pages/Cursos";
import Login from "./components/Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Pages/Register";




function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/register", "/"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
  <>
    {!shouldHideHeader && <Header /> }
    
     
  <Routes>    
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/home" element={<Home />} />
    <Route path="/alumnos" element={<Alumnos />} />
    <Route path="/agregaralumno" element={<AgregarAlumno />} />
    <Route path="/matricular" element={<Matricular />} />
    <Route path="/reportes" element={<Reportes />} />
    <Route path="/cursos" element={<Cursos />} />
</Routes>
    </>
  );
};

function App(){
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
