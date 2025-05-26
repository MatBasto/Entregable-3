import { useState, useEffect } from "react";
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
import { supabase } from "../../supabase";
import "./ProjectsPage.css";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [filtro, setFiltro] = useState({
    texto: "",
    institucion: "",
    docente: "",
  });
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("proyectos")
        .select("*, usuarios:docente_id(nombre)");

      if (error) {
        console.error("Error al obtener proyectos:", error.message);
        return;
      }

      const proyectosConDocente = data.map((p) => ({
        ...p,
        docente: p.usuarios?.nombre || "Sin asignar",
      }));

      setAllProjects(proyectosConDocente);
    };

    fetchProjects();
  }, []);

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

  const limpiarFiltros = () => {
    setFiltro({
      texto: "",
      institucion: "",
      docente: "",
    });
  };

  const hayFiltrosActivos = filtro.texto || filtro.institucion || filtro.docente;

  return (
    <div className="projects-page">
      <Container className="projects-container">
        <div className="projects-header">
          <Typography className="projects-title">
            Proyectos Registrados
          </Typography>
          <Typography className="projects-subtitle">
            Explora y gestiona todos los proyectos académicos
          </Typography>
        </div>

        <div className="filters-section">
          <Typography className="filters-title">
            🔍 Filtros de búsqueda
          </Typography>
          <div className="filters-grid">
            <div className="filter-field">
              <TextField
                label="Buscar por título"
                value={filtro.texto}
                onChange={(e) => setFiltro({ ...filtro, texto: e.target.value })}
                placeholder="Ingresa el título del proyecto..."
              />
            </div>
            <div className="filter-field">
              <TextField
                select
                label="Institución"
                value={filtro.institucion}
                onChange={(e) => setFiltro({ ...filtro, institucion: e.target.value })}
              >
                <MenuItem value="">Todas las instituciones</MenuItem>
                {instituciones.map((i, idx) => (
                  <MenuItem key={idx} value={i}>
                    {i}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="filter-field">
              <TextField
                select
                label="Docente"
                value={filtro.docente}
                onChange={(e) => setFiltro({ ...filtro, docente: e.target.value })}
              >
                <MenuItem value="">Todos los docentes</MenuItem>
                {docentes.map((d, idx) => (
                  <MenuItem key={idx} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>
        </div>

        {user && (
          <div className="actions-section">
            <Button className="report-button" onClick={generarReporteGeneral}>
              📄 Generar reporte general
            </Button>
          </div>
        )}

        <div className="results-counter">
          <Typography className="results-count">
            {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''} encontrado{proyectosFiltrados.length !== 1 ? 's' : ''}
          </Typography>
          {hayFiltrosActivos && (
            <button className="clear-filters" onClick={limpiarFiltros}>
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="projects-grid-container">
          {proyectosFiltrados.length > 0 ? (
            <div className="projects-grid">
              {proyectosFiltrados.map((project) => (
                <div key={project.id} className="project-card-wrapper">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-projects-container">
              <div className="no-projects-icon">📂</div>
              <Typography className="no-projects-title">
                No se encontraron proyectos
              </Typography>
              <Typography className="no-projects-message">
                {hayFiltrosActivos 
                  ? "Intenta ajustar los filtros de búsqueda para encontrar más resultados."
                  : "Aún no hay proyectos registrados en el sistema."
                }
              </Typography>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}