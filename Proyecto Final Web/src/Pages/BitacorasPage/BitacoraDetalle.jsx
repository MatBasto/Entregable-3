import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";
import "./BitacoraDetalle.css";

// 🔹 Datos simulados (más adelante se conectará con Supabase)
const bitacorasSimuladas = [
  {
    id: 1,
    proyecto: "Energías Renovables",
    fecha: "2025-04-15",
    descripcion: "Instalación de paneles solares.",
    observaciones: "Participación activa.",
    fotos: ["https://via.placeholder.com/150", "https://via.placeholder.com/100"],
  },
  {
    id: 2,
    proyecto: "Energías Renovables",
    fecha: "2025-04-20",
    descripcion: "Prueba de voltaje.",
    observaciones: "Voltaje estable.",
    fotos: [],
  },
];

export default function BitacoraDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const bitacora = bitacorasSimuladas.find((b) => b.id === parseInt(id));

  if (!bitacora) {
    return (
      <Container className="bitacora-container">
        <Typography variant="h5">Bitácora no encontrada</Typography>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </Container>
    );
  }

  return (
    <Container className="bitacora-container">
      <Typography variant="h4" className="bitacora-title">
        Bitácora del {bitacora.fecha}
      </Typography>

      <Typography className="bitacora-item">
        <strong>Proyecto:</strong> {bitacora.proyecto}
      </Typography>

      <Typography className="bitacora-section">
        <strong>Descripción:</strong>
      </Typography>
      <Typography className="bitacora-text">{bitacora.descripcion}</Typography>

      <Typography className="bitacora-section">
        <strong>Observaciones:</strong>
      </Typography>
      <Typography className="bitacora-text">{bitacora.observaciones}</Typography>

      <Typography className="bitacora-section">
        <strong>Imágenes adjuntas:</strong>
      </Typography>
      <Box className="bitacora-fotos">
        {bitacora.fotos.length > 0 ? (
          bitacora.fotos.map((foto, index) => (
            <img key={index} src={foto} alt={`evidencia ${index}`} className="bitacora-img" />
          ))
        ) : (
          <Typography className="bitacora-text">No se adjuntaron evidencias.</Typography>
        )}
      </Box>

      <Button className="bitacora-volver-btn" variant="outlined" onClick={() => navigate(-1)}>
        ← Volver al proyecto
      </Button>
    </Container>
  );
}
