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

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = register({ ...form, rol: null });

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

        {error && <Alert severity="error" className="register-alert">{error}</Alert>}

        <form onSubmit={handleSubmit} className="register-form">
          <TextField
            label="Correo"
            name="correo"
            type="email"
            required
            value={form.correo}
            onChange={handleChange}
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            label="Nombre completo"
            name="nombre"
            required
            value={form.nombre}
            onChange={handleChange}
          />
          <TextField
            label="Identificación"
            name="identificacion"
            required
            value={form.identificacion}
            onChange={handleChange}
          />
          <TextField
            label="Edad"
            name="edad"
            type="number"
            required
            value={form.edad}
            onChange={handleChange}
          />
          <TextField
            label="Colegio"
            name="colegio"
            required
            value={form.colegio}
            onChange={handleChange}
          />
          <TextField
            label="Grado (opcional)"
            name="grado"
            value={form.grado}
            onChange={handleChange}
          />

          <Button type="submit" variant="contained" className="register-button">
            Crear Cuenta
          </Button>
        </form>
      </Box>
    </Container>
  );
}
