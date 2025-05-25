import { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    correo: "",
    password: "",
    nombre: "",
    identificacion: "",
    edad: "",
    colegio: "",
    grado: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register({ ...form });

    if (result.success) {
      alert("Cuenta creada. Espera a que un coordinador te asigne un rol.");
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box className="register-container">
        <Typography variant="h4" className="register-title">
          Crear Cuenta
        </Typography>

        {error && (
          <Alert severity="error" className="register-alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <TextField
            label="Correo"
            name="correo"
            type="email"
            required
            fullWidth
            value={form.correo}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            required
            fullWidth
            value={form.password}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Nombre completo"
            name="nombre"
            required
            fullWidth
            value={form.nombre}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Identificación"
            name="identificacion"
            required
            fullWidth
            value={form.identificacion}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Edad"
            name="edad"
            type="number"
            required
            fullWidth
            value={form.edad}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Colegio"
            name="colegio"
            required
            fullWidth
            value={form.colegio}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Grado (opcional)"
            name="grado"
            fullWidth
            value={form.grado}
            onChange={handleChange}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="register-button"
            sx={{ mt: 2 }}
          >
            Crear Cuenta
          </Button>
        </form>
      </Box>
    </Container>
  );
}
