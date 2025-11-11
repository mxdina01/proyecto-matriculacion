import React, { lazy, Suspense } from "react";
import "./components/styles/App.css";
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load de las páginas
const Home = lazy(() => import("./components/Pages/Home"));
const Alumnos = lazy(() => import("./components/Pages/Alumnos"));
const AgregarAlumno = lazy(() => import("./components/Pages/AgregarAlumno"));
const EditarAlumno = lazy(() => import("./components/Pages/EditarAlumno"));
const Cursos = lazy(() => import("./components/Pages/Cursos"));
const Matricular = lazy(() => import("./components/Pages/Matricular"));
const Login = lazy(() => import("./components/Pages/Login"));
const Register = lazy(() => import("./components/Pages/Register"));

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

  // Decide si ocultar o mostrar el Header según la ruta actual
  const route = routes.find(r => matchPath({ path: r.path, end: true }, location.pathname));
  const hideHeader = route?.hideHeader;

  return (
    <>
      {!hideHeader && <Header />}

      <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50px" }}>Cargando...</div>}>
        <Routes>
          {/* Rutas públicas */}
          {routes
            .filter(r => !r.isProtected)
            .map(r => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}

          {/* Rutas protegidas: cada una envuelta en ProtectedRoute */}
          {routes
            .filter(r => r.isProtected)
            .map(r => (
              <Route
                key={r.path}
                path={r.path}
                element={<ProtectedRoute>{r.element}</ProtectedRoute>}
              />
            ))}
        </Routes>
      </Suspense>
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
