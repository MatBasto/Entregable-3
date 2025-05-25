import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await login(correo, password);

    if (result.success) {
      setError("");
      alert("Inicio de sesión exitoso");
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <Container className="login-page">
      <Box className="login-container">
        <Typography variant="h4" className="login-title">
          Iniciar Sesión
        </Typography>

        {error && (
          <Alert severity="error" className="login-error">
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            name="correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth className="login-button" sx={{ mt: 2 }}>
            Iniciar sesión
          </Button>
        </form>
      </Box>
    </Container>
  );
}
