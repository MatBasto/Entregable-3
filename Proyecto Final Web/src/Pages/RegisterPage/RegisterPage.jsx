import { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
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
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await register({ ...form });

      if (result.success) {
        setSuccess("¡Cuenta creada exitosamente! Espera a que un coordinador te asigne un rol.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
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
    <div className="register-page">
      <div className="register-container-wrapper">
        <Container className="register-container">
          <div className="register-header">
            <div className="register-icon">
              👤
            </div>
            <Typography className="register-title">
              Crear Cuenta
            </Typography>
            <Typography className="register-subtitle">
              Únete a nuestra plataforma de proyectos académicos
            </Typography>
          </div>

          <div className="form-info">
            <Typography className="form-info-text">
              <span className="form-info-icon">ℹ️</span>
              Después del registro, un coordinador revisará tu solicitud y te asignará los permisos correspondientes.
            </Typography>
          </div>

          {error && (
            <Alert severity="error" className="error-alert">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className="success-alert">
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-grid">
              <div className="form-field">
                <TextField
                  label="Correo electrónico"
                  name="correo"
                  type="email"
                  required
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-field">
                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-field">
              <TextField
                label="Nombre completo"
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                disabled={isLoading}
              />
            </div>

            <div className="form-grid two-columns">
              <div className="form-field">
                <TextField
                  label="Identificación"
                  name="identificacion"
                  required
                  value={form.identificacion}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-field">
                <TextField
                  label="Edad"
                  name="edad"
                  type="number"
                  required
                  value={form.edad}
                  onChange={handleChange}
                  placeholder="Tu edad"
                  disabled={isLoading}
                  inputProps={{ min: 10, max: 100 }}
                />
              </div>
            </div>

            <div className="form-field">
              <TextField
                label="Colegio o Institución"
                name="colegio"
                required
                value={form.colegio}
                onChange={handleChange}
                placeholder="Nombre de tu institución"
                disabled={isLoading}
              />
            </div>

            <div className="form-field optional">
              <TextField
                label="Grado"
                name="grado"
                value={form.grado}
                onChange={handleChange}
                placeholder="Ej: 11°, Universitario, etc."
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className={`register-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? '' : 'Crear Cuenta'}
            </Button>
          </form>

          <div className="register-footer">
            <Typography className="login-link">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </Typography>
          </div>
        </Container>
      </div>
    </div>
  );
}