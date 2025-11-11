import React, { useState } from "react";
import AuthService from "../../services/AuthService";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

//funcion para loginearse 
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


//peticion a authservice
  const handleSubmit = async (e) => {
    e.preventDefault(); //evita q la pag se recarge al enviar el form
    setError("");
    setLoading(true);
    try {
      await AuthService.login(username, password); //maneja el inicio de sesion
      navigate("/home"); //si todo va bn
    } catch (err) {
      setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  //render de la pagina

  return (
    <div className="auth-page">
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
       <button type="submit" disabled={loading}> {/*que se desshabilite mientaas cargue y que cambie el text*/}
  {loading ? "Ingresando..." : "Ingresar"}
</button>

      <p>
        ¿No tenés cuenta?{" "}
        <Link to="/register">
          Crear cuenta
        </Link>
      </p>
    </div>
  </div>
  );
  
}

export default Login;
