import { Container, Typography, Box } from "@mui/material";
import "./HomePage.css";

export default function HomePage() {
  return (
    <Container className="home-container">
      <Box className="home-box">
        <Typography variant="h3" className="home-title">
          Plataforma de Proyectos Escolares
        </Typography>
        <Typography variant="h6" className="home-subtitle">
          Organiza, registra y evalúa proyectos académicos con facilidad
        </Typography>
        <Typography className="home-description">
          Esta plataforma ha sido diseñada para que docentes, estudiantes y coordinadores
          puedan gestionar los proyectos escolares de manera colaborativa. Desde la
          creación y evaluación, hasta la documentación con bitácoras y reportes PDF,
          todo está aquí.
        </Typography>
        <Typography className="home-note">
          Inicia sesión o regístrate para comenzar.
        </Typography>
      </Box>
    </Container>
  );
}
