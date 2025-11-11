import React, { useState } from "react"; //hook para actualizar valores
import { useNavigate, Link } from "react-router-dom"; //permite cambiar cosas sin recargar la pag + enlace de rutas
import AuthService from "../../services/AuthService";
import "../styles/auth.css";

//funcion de registro de usuarios con usestate
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();


//maneja la funcion de registro asincrona pq toma tiempo y recibe un evento
  const handleRegister = async (e) => {
    e.preventDefault(); //detiene que recarge la pag
    setError("");
    setSuccess("");

    //gestion de errores
    try {
      await AuthService.register({
        username,
        password,
        rol,
      
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
            placeholder="Agregar nombre de usuario:"
            value={username}
            onChange={(e) => setUsername(e.target.value)} //actualiza el username
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
