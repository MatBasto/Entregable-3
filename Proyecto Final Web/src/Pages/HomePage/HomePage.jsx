import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Avatar
} from "@mui/material";
import { 
  School, 
  Assignment, 
  People, 
  Assessment,
  ArrowForward,
  CheckCircle
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import "./HomePage.css";

export default function HomePage() {
  const { user } = useAuth();

  const features = [
    {
      icon: <School />,
      title: "Gestión de Proyectos",
      description: "Crea, organiza y administra proyectos académicos de manera intuitiva y eficiente."
    },
    {
      icon: <Assignment />,
      title: "Documentación Completa",
      description: "Mantén registros detallados con bitácoras, reportes y documentación automática."
    },
    {
      icon: <People />,
      title: "Colaboración",
      description: "Facilita la comunicación entre docentes, estudiantes y coordinadores."
    },
    {
      icon: <Assessment />,
      title: "Evaluación y Seguimiento",
      description: "Herramientas avanzadas para evaluar el progreso y generar reportes PDF."
    }
  ];

  const benefits = [
    "Interfaz intuitiva y fácil de usar",
    "Acceso desde cualquier dispositivo",
    "Reportes automáticos en PDF",
    "Gestión de usuarios por roles",
    "Seguimiento en tiempo real",
    "Bitácoras detalladas"
  ];

  return (
    <Box className="home-wrapper">
      {/* Hero Section */}
      <Container maxWidth="lg" className="hero-container">
        <Box className="hero-content">
          <Box className="hero-text">
            <Typography variant="h2" className="hero-title">
              Plataforma de
              <span className="hero-highlight"> Proyectos Escolares</span>
            </Typography>
            <Typography variant="h5" className="hero-subtitle">
              Organiza, registra y evalúa proyectos académicos con facilidad
            </Typography>
            <Typography className="hero-description">
              Diseñada para que docentes, estudiantes y coordinadores gestionen
              proyectos escolares de manera colaborativa. Desde la creación hasta
              la evaluación, con documentación completa y reportes profesionales.
            </Typography>
            
            <Box className="hero-actions">
              {user ? (
                <Button
                  component={Link}
                  to="/projects"
                  variant="contained"
                  size="large"
                  className="cta-button primary"
                  endIcon={<ArrowForward />}
                >
                  Ver Proyectos
                </Button>
              ) : (
                <Box className="auth-buttons">
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    className="cta-button primary"
                    endIcon={<ArrowForward />}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    className="cta-button secondary"
                  >
                    Registrarse
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          <Box className="hero-visual">
            <Box className="floating-card">
              <Avatar className="hero-avatar">
                <School />
              </Avatar>
              <Typography variant="h6" className="card-title">
                ¡Bienvenido!
              </Typography>
              <Typography variant="body2" className="card-description">
                Gestiona tus proyectos de forma profesional
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" className="features-container">
        <Box className="section-header">
          <Typography variant="h3" className="section-title">
            Características Principales
          </Typography>
          <Typography variant="h6" className="section-subtitle">
            Todo lo que necesitas para gestionar proyectos académicos
          </Typography>
        </Box>

        <Grid container spacing={4} className="features-grid">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card className="feature-card">
                <CardContent className="feature-content">
                  <Avatar className="feature-avatar">
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" className="feature-title">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" className="feature-description">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Container maxWidth="lg" className="benefits-container">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box className="benefits-text">
              <Typography variant="h3" className="benefits-title">
                ¿Por qué elegir nuestra plataforma?
              </Typography>
              <Typography variant="h6" className="benefits-subtitle">
                Una solución completa y moderna para la gestión educativa
              </Typography>
              <Box className="benefits-list">
                {benefits.map((benefit, index) => (
                  <Box key={index} className="benefit-item">
                    <CheckCircle className="benefit-icon" />
                    <Typography className="benefit-text">
                      {benefit}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box className="benefits-visual">
              <Box className="stats-grid">
                <Box className="stat-item">
                  <Typography variant="h4" className="stat-number">100%</Typography>
                  <Typography className="stat-label">Digital</Typography>
                </Box>
                <Box className="stat-item">
                  <Typography variant="h4" className="stat-number">24/7</Typography>
                  <Typography className="stat-label">Acceso</Typography>
                </Box>
                <Box className="stat-item">
                  <Typography variant="h4" className="stat-number">∞</Typography>
                  <Typography className="stat-label">Proyectos</Typography>
                </Box>
                <Box className="stat-item">
                  <Typography variant="h4" className="stat-number">3</Typography>
                  <Typography className="stat-label">Roles</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      {!user && (
        <Container maxWidth="md" className="cta-container">
          <Box className="cta-section">
            <Typography variant="h4" className="cta-title">
              ¿Listo para comenzar?
            </Typography>
            <Typography variant="h6" className="cta-subtitle">
              Únete a nuestra plataforma y transforma la gestión de proyectos educativos
            </Typography>
            <Box className="cta-actions">
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                className="cta-button primary large"
                endIcon={<ArrowForward />}
              >
                Comenzar Ahora
              </Button>
            </Box>
          </Box>
        </Container>
      )}
    </Box>
  );
}