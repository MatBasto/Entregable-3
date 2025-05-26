import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Avatar,
  Divider
} from "@mui/material";
import { 
  Person, 
  Business
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  // Función para determinar el color del chip según el estado
  const getStatusChipProps = (estado) => {
    const statusMap = {
      'activo': { color: 'success', label: 'Activo' },
      'completado': { color: 'primary', label: 'Completado' },
      'en progreso': { color: 'warning', label: 'En Progreso' },
      'pendiente': { color: 'default', label: 'Pendiente' },
      'cancelado': { color: 'error', label: 'Cancelado' }
    };
    
    return statusMap[estado?.toLowerCase()] || { color: 'default', label: estado };
  };

  // Función para obtener las iniciales del área
  const getAreaInitials = (area) => {
    return area?.split(' ').map(word => word[0]).join('').toUpperCase() || 'PR';
  };

  const statusProps = getStatusChipProps(project.estado);

  return (
    <Card className="project-card" elevation={0}>
      <Box 
        component={Link} 
        to={`/projects/${project.id}`} 
        className="project-card-link"
      >
        {/* Header con Avatar y Estado */}
        <Box className="project-card-header">
          <Avatar className="project-area-avatar">
            {getAreaInitials(project.area)}
          </Avatar>
          <Chip
            label={statusProps.label}
            color={statusProps.color}
            size="small"
            className="project-status-chip"
          />
        </Box>



        <CardContent className="project-card-content">
          {/* Título del proyecto */}
          <Typography 
            variant="h6" 
            className="project-title"
            title={project.titulo}
          >
            {project.titulo}
          </Typography>

          {/* Área del proyecto */}
          <Typography variant="body2" className="project-area">
            {project.area}
          </Typography>

          <Divider className="project-divider" />

          {/* Información adicional */}
          <Box className="project-info-section">
            <Box className="project-info-item">
              <Business className="info-icon" />
              <Typography variant="body2" className="info-text">
                {project.institucion}
              </Typography>
            </Box>

            <Box className="project-info-item">
              <Person className="info-icon" />
              <Typography variant="body2" className="info-text">
                {project.docente}
              </Typography>
            </Box>
          </Box>

          {/* Footer con información adicional si existe */}
          {(project.fechaCreacion || project.participantes) && (
            <Box className="project-card-footer">
              {project.fechaCreacion && (
                <Typography variant="caption" className="project-date">
                  Creado: {new Date(project.fechaCreacion).toLocaleDateString()}
                </Typography>
              )}
              {project.participantes && (
                <Typography variant="caption" className="project-participants">
                  {project.participantes} participantes
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Box>
    </Card>
  );
}