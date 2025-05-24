import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import "./RegistrarBitacora.css";

/**
 * Página para que estudiantes registren bitácoras con evidencias.
 * (Simulada por ahora sin conexión a base de datos).
 */
export default function RegistrarBitacora() {
  const { id } = useParams(); // ID del proyecto
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fecha: "",
    descripcion: "",
    observaciones: "",
  });

  const [evidencias, setEvidencias] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const archivos = Array.from(e.target.files);
    setEvidencias(archivos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaBitacora = {
      ...form,
      fotos: evidencias.map((file) => URL.createObjectURL(file)), // Simulado
    };

    console.log(`Nueva bitácora para proyecto ${id}:`, nuevaBitacora);
    alert("Bitácora registrada correctamente (simulado)");

    navigate(`/projects/${id}`);
  };

  return (
    <Container maxWidth="md" className="registrar-container">
      <Box>
        <Typography variant="h4" className="registrar-title">
          Registrar Bitácora del Proyecto #{id}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Fecha"
            name="fecha"
            type="date"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            value={form.fecha}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Descripción del Avance"
            name="descripcion"
            multiline
            rows={4}
            margin="normal"
            value={form.descripcion}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Observaciones"
            name="observaciones"
            multiline
            rows={3}
            margin="normal"
            value={form.observaciones}
            onChange={handleChange}
          />

          <Typography variant="subtitle1" className="form-section">
            Adjuntar evidencias (imágenes)
          </Typography>
          <input
            type="file"
            multiple
            accept="image/*"
            className="file-input"
            onChange={handleFileChange}
          />

          <Box sx={{ mt: 2, mb: 2 }}>
            {evidencias.length > 0 &&
              evidencias.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`evidencia-${idx}`}
                  className="preview-img"
                />
              ))}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Registrar Bitácora
          </Button>
        </form>
      </Box>
    </Container>
  );
}
