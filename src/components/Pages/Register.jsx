import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "../styles/Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
     
      await AuthService.register({
        username,
        password,
        email,
        fullName,
      });

      setSuccess("Registro exitoso. Redirigiendo a login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
     setError(err.response?.data?.message || "Error en el registro");
    }

  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre y Apellido"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
          <button type="submit">Registrarse</button>
          {error && <span className="error-msg">{error}</span>}
          {success && <span className="success-msg">{success}</span>}
        </form>
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
