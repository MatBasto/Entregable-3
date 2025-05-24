import { Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  return (
    <Card className="project-card">
      <CardContent
        component={Link}
        to={`/projects/${project.id}`}
        className="project-card-link"
      >
        <Typography className="project-title">
          {project.titulo}
        </Typography>
        <Typography className="project-area">
          Área: {project.area}
        </Typography>
        <Typography className="project-card-section">
          Institución: {project.institucion}
        </Typography>
        <Typography className="project-card-section">
          Docente: {project.docente}
        </Typography>
        <Typography className="project-card-section">
          Estado: <strong>{project.estado}</strong>
        </Typography>

        {project?.foto && (
          <Box className="project-img-container">
            <img
              src={project.foto}
              alt="imagen del proyecto"
              className="project-card-img"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
