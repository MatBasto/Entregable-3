import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(correo, password);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="login-container">
        <div className="login-header">
          <div className="login-icon">
            🔐
          </div>
          <Typography className="login-title">
            Bienvenido
          </Typography>
          <Typography className="login-subtitle">
            Inicia sesión para continuar
          </Typography>
        </div>

        {error && (
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-field">
            <TextField
              label="Correo electrónico"
              type="email"
              name="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="ejemplo@correo.com"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-field">
            <TextField
              label="Contraseña"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Tu contraseña"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className={`login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="login-footer">
          <Typography className="register-link">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </Typography>
        </div>
      </Container>
    </div>
  );
}