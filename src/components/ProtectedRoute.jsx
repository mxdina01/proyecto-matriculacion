import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthService";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);  
  const [user, setUser] = useState(null);        
  useEffect(() => {
    const verificarUsuario = async () => {
      try {
       
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error al verificar usuario:", error);
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    verificarUsuario();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Verificando sesión...</p>;
  }


  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return children;
}

export default ProtectedRoute;
