import React, { useState } from "react";
import AuthService from "../../services/AuthService";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await AuthService.login(username, password);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

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
        <button type="submit">Ingresar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

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
