import React, { lazy, Suspense } from "react";
import "./components/styles/App.css";
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// 💤 Lazy loading: las páginas se cargan solo cuando se visitan
const Home = lazy(() => import("./components/Pages/Home"));
const AgregarAlumno = lazy(() => import("./components/Pages/AgregarAlumno"));
const Alumnos = lazy(() => import("./components/Pages/Alumnos"));
const Matricular = lazy(() => import("./components/Pages/Matricular"));
const Cursos = lazy(() => import("./components/Pages/Cursos"));
const Login = lazy(() => import("./components/Pages/Login"));
const Register = lazy(() => import("./components/Pages/Register"));
const EditarAlumno = lazy(() => import("./components/Pages/EditarAlumno"));

// 🗺️ Lista de rutas con control de header
const routes = [
  { path: "/", element: <Login />, hideHeader: true },
  { path: "/login", element: <Login />, hideHeader: true },
  { path: "/register", element: <Register />, hideHeader: true },

  // Todas las demás rutas estarán protegidas
  { path: "/home", element: <Home />, hideHeader: false },
  { path: "/alumnos", element: <Alumnos />, hideHeader: false },
  { path: "/agregaralumno", element: <AgregarAlumno />, hideHeader: false },
  { path: "/editaralumno/:id", element: <EditarAlumno />, hideHeader: false },
  { path: "/cursos", element: <Cursos />, hideHeader: false },
  { path: "/matricular", element: <Matricular />, hideHeader: false },
];

function AppContent() {
  const location = useLocation();

  // Busca la ruta actual y decide si ocultar el Header
  const route = routes.find((r) => matchPath({ path: r.path, end: true }, location.pathname));
  const hideHeader = route?.hideHeader;

  return (
    <>
      {!hideHeader && <Header />}

      {/* Suspense muestra el fallback mientras carga cada página */}
      <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50px" }}>Cargando...</div>}>
        <Routes>
          {/* Rutas públicas (login y register) */}
          {routes
            .filter((r) => r.hideHeader)
            .map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            {routes
              .filter((r) => !r.hideHeader)
              .map((r) => (
                <Route key={r.path} path={r.path} element={r.element} />
              ))}
          </Route>
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