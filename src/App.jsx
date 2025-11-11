import React from "react";
import "./components/styles/App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Pages/Home";
import AgregarAlumno from "./components/Pages/AgregarAlumno";
import Alumnos from "./components/Pages/Alumnos";
import Matricular from "./components/Pages/Matricular";
import Cursos from "./components/Pages/Cursos";
import Login from "./components/Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Pages/Register";

//Lista de rutas + ocultar headers
const routes = [
  { path: "/", element: <Login />, hideHeader: true },
  { path: "/login", element: <Login />, hideHeader: true },
  { path: "/register", element: <Register />, hideHeader: true},
  { path: "/home", element: <Home />, hideHeader: false},
  { path: "/alumnos", element: <Alumnos />, hideHeader: false},
  { path: "/agregaralumno", element: <AgregarAlumno/>, hideHeader: false},
  { path: "/cursos", element: <Cursos/>, hideHeader: false},
  { path: "/matricular", element: <Matricular/>, hideHeader: false},

]

function AppContent(){

//fetchea en cual ubi se encuentra el user currently
  const location = useLocation();

//busca la ruta actual een nuestra lista y ve si debemos ocultar el header
const route = routes.find(r =>r.path === location.pathname);
const hideHeader = route?.hideHeader;
return (
  <>
    {!hideHeader && <Header />}
    <Routes>
      {/* renderizado dinamico de rutass */}
      {routes.map(r => (
        <Route key={r.path} path={r.path} element={r.element}/>
      ))}
    </Routes>
  </>
);

}
    
  export default function App(){
    return (
      <Router>
        <AppContent />
      </Router>
    );
  }