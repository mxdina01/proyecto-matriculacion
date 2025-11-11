import React from "react";
import "./components/styles/App.css";
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Pages/Home";
import AgregarAlumno from "./components/Pages/AgregarAlumno";
import Alumnos from "./components/Pages/Alumnos";
import Matricular from "./components/Pages/Matricular";
import Cursos from "./components/Pages/Cursos";
import Login from "./components/Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./components/Pages/Register";
import EditarAlumno from "./components/Pages/EditarAlumno";


// Lista de rutas
const routes = [
  { path: "/", element: <Login />, hideHeader: true, isProtected: false },
  { path: "/login", element: <Login />, hideHeader: true, isProtected: false },
  { path: "/register", element: <Register />, hideHeader: true, isProtected: false },
    { path: "/home", element: <Home />, hideHeader: false, isProtected: true },
  { path: "/alumnos", element: <Alumnos />, hideHeader: false, isProtected: true },
  { path: "/agregaralumno", element: <AgregarAlumno />, hideHeader: false, isProtected: true },
  { path: "/editaralumno/:id", element: <EditarAlumno />, hideHeader: false, isProtected: true },
  { path: "/cursos", element: <Cursos />, hideHeader: false, isProtected: true },
  { path: "/matricular", element: <Matricular />, hideHeader: false, isProtected: true },
];

function AppContent() {
  const location = useLocation();

  // fetchea la ubicacion actual del user + ver si debe ocultar o no
  // Usamos 'routes.find' para obtener la configuración de la ruta actual
  const route = routes.find(r => matchPath({ path: r.path, end: true }, location.pathname));
  const hideHeader = route?.hideHeader;

  return (
    <>
      {/* 1. Renderizado condicional del Header */}
      {!hideHeader && <Header />}
      
      <Routes>
        {routes
          .filter(r => !r.isProtected) // Filtra solo rutas públicas
          .map(r => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}

        {/* 3. Rutas PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          {routes
            .filter(r => r.isProtected) // Filtra solo rutas protegidas
            .map(r => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}