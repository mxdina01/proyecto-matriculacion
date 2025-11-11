import React, { lazy, Suspense } from "react";
import "./components/styles/App.css";
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

//lazy loading para que solo carguen en ese isntante las pags que estan siendo visitadas
const Home = lazy(() => import("./components/Pages/Home"));
const AgregarAlumno = lazy(() => import("./components/Pages/AgregarAlumno"));
const Alumnos = lazy(() => import("./components/Pages/Alumnos"));
const Matricular = lazy(() => import("./components/Pages/Matricular"));
const Cursos = lazy(() => import("./components/Pages/Cursos"));
const Login = lazy(() => import("./components/Pages/Login"));
const Register = lazy(() => import("./components/Pages/Register"));
const EditarAlumno = lazy(() => import("./components/Pages/EditarAlumno"));

// rutas + header control
const routes = [
  { path: "/", element: <Login />, hideHeader: true },
  { path: "/login", element: <Login />, hideHeader: true },
  { path: "/register", element: <Register />, hideHeader: true },
  { path: "/home", element: <Home />, hideHeader: false },
  { path: "/alumnos", element: <Alumnos />, hideHeader: false },
  { path: "/agregaralumno", element: <AgregarAlumno />, hideHeader: false },
  { path: "/editaralumno/:id", element: <EditarAlumno />, hideHeader: false },
  { path: "/cursos", element: <Cursos />, hideHeader: false },
  { path: "/matricular", element: <Matricular />, hideHeader: false },
];

function AppContent() {
  const location = useLocation(); //hook que devuelve location

  //fetchea la current ubiccacion + mira si se oculta o no el header
  const route = routes.find((r) => matchPath({ path: r.path, end: true }, location.pathname));
  const hideHeader = route?.hideHeader;

  return (
    <>

     {/* para mostrar el header nms si la variable de hideheader es false*/}
      {!hideHeader && <Header />}

      {/* manejo de carga */}
      <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50px" }}>Cargando...</div>}>
        <Routes>
          {routes
            .filter((r) => r.hideHeader)
            .map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}

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