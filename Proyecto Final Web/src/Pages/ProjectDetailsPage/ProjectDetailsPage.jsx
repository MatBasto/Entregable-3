import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "../../supabase";
import "./ProjectDetailsPage.css";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estado, setEstado] = useState("");
  const [observacionEstado, setObservacionEstado] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("proyectos")
        .select(`*, usuarios:docente_id(nombre),
                  integrantes:integrantes(id, estudiante:usuarios(id, nombre, grado, identificacion)),
                  bitacoras(*)`)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al obtener proyecto", error);
      } else {
        setProject(data);
        setEstado(data.estado);
      }

      const { data: historialEstados } = await supabase
        .from("historial_estados")
        .select("fecha, estado, observaciones")
        .eq("proyecto_id", id)
        .order("fecha", { ascending: true });

      setHistorial(historialEstados || []);
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  const cambiarEstado = async () => {
    const { error } = await supabase.from("proyectos").update({ estado, observaciones: observacionEstado }).eq("id", id);

    const { error: historialError } = await supabase.from("historial_estados").insert({
      proyecto_id: id,
      estado,
      fecha: new Date().toISOString().slice(0, 10),
      observaciones: observacionEstado,
    });

    if (!error && !historialError) {
      alert("Estado actualizado correctamente");
      setProject({ ...project, estado, observaciones: observacionEstado });
      setHistorial([...historial, {
        estado,
        fecha: new Date().toISOString().slice(0, 10),
        observaciones: observacionEstado,
      }]);
      setObservacionEstado("");
    } else {
      alert("Error al actualizar el estado o historial");
    }
  };

  const obtenerImagenBase64 = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = reject;
      img.src = url;
    });

  const generarPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(project.titulo, 14, 20);

    doc.setFontSize(12);
    doc.text(`Área: ${project.area}`, 14, 30);
    doc.text(`Docente: ${project.usuarios?.nombre || ""}`, 14, 37);
    doc.text(`Institución: ${project.institucion}`, 14, 44);
    doc.text(`Cronograma: ${project.cronograma}`, 14, 51);
    doc.text(`Presupuesto: ${project.presupuesto}`, 14, 58);
    doc.text(`Estado: ${project.estado}`, 14, 65);

    doc.setFont("helvetica", "bold");
    doc.text("Objetivos:", 14, 75);
    doc.setFont("helvetica", "normal");
    doc.text(project.objetivos, 14, 82, { maxWidth: 180 });

    doc.setFont("helvetica", "bold");
    doc.text("Observaciones:", 14, 95);
    doc.setFont("helvetica", "normal");
    doc.text(project.observaciones, 14, 102, { maxWidth: 180 });

    autoTable(doc, {
      startY: 115,
      head: [["Nombre", "ID", "Grado"]],
      body: project.integrantes.map((i) => [
        i.estudiante?.nombre || "",
        i.estudiante?.identificacion || "",
        i.estudiante?.grado || "",
      ]),
      theme: "grid",
    });

    let y = doc.lastAutoTable.finalY + 10;

    if (historial.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Historial de Estados:", 14, y);
      y += 6;

      autoTable(doc, {
        startY: y,
        head: [["Fecha", "Estado", "Observaciones"]],
        body: historial.map((h) => [h.fecha, h.estado, h.observaciones || ""]),
        theme: "striped",
      });

      y = doc.lastAutoTable.finalY + 10;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Bitácoras:", 14, y);
    y += 8;

    for (const b of project.bitacoras) {
      doc.setFont("helvetica", "bold");
      doc.text(`${b.fecha} - ${b.descripcion}`, 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`Observaciones: ${b.observaciones}`, 14, y);
      y += 8;

      for (const foto of b.fotos || []) {
        try {
          const imgData = await obtenerImagenBase64(foto);
          doc.addImage(imgData, "JPEG", 14, y, 50, 35);
          y += 40;
        } catch {
          doc.text("Error al cargar imagen", 14, y);
          y += 10;
        }
      }

      y += 10;
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save(`proyecto_${project.id}.pdf`);
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (!project) return <Typography>Proyecto no encontrado</Typography>;

  const esIntegrante =
    user?.rol === "estudiante" &&
    project.integrantes.some((i) => i.estudiante?.id === user.id);

  return (
    <Container className="project-details-page">
      <Box className="project-container">
        <Typography variant="h4" className="project-title">
          {project.titulo}
        </Typography>

        <Box className="project-info">
          <Typography><strong>Área:</strong> {project.area}</Typography>
          <Typography><strong>Docente:</strong> {project.usuarios?.nombre}</Typography>
          <Typography><strong>Cronograma:</strong> {project.cronograma}</Typography>
          <Typography><strong>Presupuesto:</strong> {project.presupuesto}</Typography>
          <Typography><strong>Institución:</strong> {project.institucion}</Typography>
          <Typography><strong>Estado:</strong> {project.estado}</Typography>
        </Box>

        <Box className="project-section">
          <Typography variant="h6">Integrantes</Typography>
          <ul className="project-ul">
            {project.integrantes.map((i, idx) => (
              <li key={idx}>
                {i.estudiante?.nombre} - ID: {i.estudiante?.identificacion} - Grado: {i.estudiante?.grado}
              </li>
            ))}
          </ul>
        </Box>

        <Box className="project-section">
          <Typography><strong>Observaciones:</strong> {project.observaciones}</Typography>
        </Box>

        {historial.length > 0 && (
          <Box className="project-section">
            <Typography variant="h6">Historial de Estados</Typography>
            <ul className="project-ul">
              {historial.map((h, idx) => (
                <li key={idx}>
                  <strong>{h.fecha}:</strong> {h.estado} - {h.observaciones || "Sin observaciones"}
                </li>
              ))}
            </ul>
          </Box>
        )}

        {user?.rol === "coordinador" && (
          <Box className="estado-form">
            <Typography variant="h6">Cambiar Estado</Typography>
            <FormControl fullWidth className="estado-select">
              <InputLabel>Nuevo Estado</InputLabel>
              <Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value="Formulación">Formulación</MenuItem>
                <MenuItem value="Evaluación">Evaluación</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Finalizado">Finalizado</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Observación"
              fullWidth
              multiline
              rows={3}
              className="estado-textarea"
              value={observacionEstado}
              onChange={(e) => setObservacionEstado(e.target.value)}
            />

            <Button
              variant="contained"
              onClick={cambiarEstado}
              className="estado-boton"
            >
              Guardar cambio de estado
            </Button>
          </Box>
        )}

        <Box className="project-section">
          <Typography variant="h6">Bitácoras</Typography>
          {project.bitacoras.length > 0 ? (
            <ul className="project-ul">
              {project.bitacoras.map((b) => (
                <li key={b.id}>
                  <Link to={`/bitacora/${b.id}`}>
                    {b.fecha} - {b.descripcion}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Typography>No hay bitácoras.</Typography>
          )}

          {esIntegrante && (
            <Button
              variant="outlined"
              component={Link}
              to={`/projects/${project.id}/bitacora/nueva`}
              className="bitacora-nueva-btn"
            >
              + Nueva Bitácora
            </Button>
          )}
        </Box>

        <Button
          variant="outlined"
          className="pdf-button"
          onClick={generarPDF}
        >
          📄 Exportar a PDF
        </Button>
      </Box>
    </Container>
  );
}
