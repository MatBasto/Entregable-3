import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ProjectCard from "../../Components/ProjectCard/ProjectCard";
import { useAuth } from "../../Context/AuthContext";
import "./ProjectsPage.css";

// Datos simulados (futura conexión con Supabase)
const allProjects = [
  {
    id: 1,
    titulo: "Energías Renovables en la Escuela",
    area: "Ciencias Naturales",
    institucion: "Colegio El Saber",
    docente: "Marta",
    estado: "Activo",
  },
  {
    id: 2,
    titulo: "Huerta Escolar Sostenible",
    area: "Tecnología",
    institucion: "Colegio Campestre",
    docente: "Juan",
    estado: "Formulación",
  },
  {
    id: 3,
    titulo: "Reciclaje Creativo",
    area: "Ciencias Sociales",
    institucion: "Colegio El Saber",
    docente: "Marta",
    estado: "Finalizado",
  },
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [filtro, setFiltro] = useState({
    texto: "",
    institucion: "",
    docente: "",
  });

  const instituciones = [...new Set(allProjects.map((p) => p.institucion))];
  const docentes = [...new Set(allProjects.map((p) => p.docente))];

  const proyectosFiltrados = allProjects.filter((p) => {
    return (
      p.titulo.toLowerCase().includes(filtro.texto.toLowerCase().trim()) &&
      (filtro.institucion === "" || p.institucion === filtro.institucion) &&
      (filtro.docente === "" || p.docente === filtro.docente)
    );
  });

  const generarReporteGeneral = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte General de Proyectos", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Título", "Área", "Institución", "Docente", "Estado"]],
      body: allProjects.map((p) => [
        p.titulo,
        p.area,
        p.institucion,
        p.docente,
        p.estado,
      ]),
      headStyles: { fillColor: [41, 128, 185] },
      theme: "striped",
    });

    doc.save("reporte_general_proyectos.pdf");
  };

  return (
    <Container className="projects-page">
      <Typography variant="h4" className="projects-title">
        Proyectos Registrados
      </Typography>

      <Box className="projects-filters">
        <TextField
          label="Buscar por título"
          value={filtro.texto}
          onChange={(e) => setFiltro({ ...filtro, texto: e.target.value })}
        />
        <TextField
          select
          label="Institución"
          value={filtro.institucion}
          onChange={(e) => setFiltro({ ...filtro, institucion: e.target.value })}
        >
          <MenuItem value="">Todas</MenuItem>
          {instituciones.map((i, idx) => (
            <MenuItem key={idx} value={i}>{i}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Docente"
          value={filtro.docente}
          onChange={(e) => setFiltro({ ...filtro, docente: e.target.value })}
        >
          <MenuItem value="">Todos</MenuItem>
          {docentes.map((d, idx) => (
            <MenuItem key={idx} value={d}>{d}</MenuItem>
          ))}
        </TextField>
      </Box>

      {user && (
        <Button
          variant="outlined"
          className="report-button"
          onClick={generarReporteGeneral}
        >
          📄 Generar reporte general
        </Button>
      )}

      <Box className="projects-grid">
        {proyectosFiltrados.map((project) => (
          <Box key={project.id} className="project-card-wrapper">
            <ProjectCard project={project} />
          </Box>
        ))}
      </Box>

      {proyectosFiltrados.length === 0 && (
        <Typography className="no-projects-message">
          No se encontraron proyectos.
        </Typography>
      )}
    </Container>
  );
}
