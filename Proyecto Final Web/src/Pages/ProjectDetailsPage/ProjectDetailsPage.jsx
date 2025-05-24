import { useParams, Link } from "react-router-dom";
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
import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ProjectDetailsPage.css";

// Datos simulados
const proyectosSimulados = [
  {
    id: 1,
    titulo: "Energías Renovables en la Escuela",
    area: "Ciencias Naturales",
    objetivos: "Promover el uso de energías limpias.",
    cronograma: "Marzo - Junio",
    presupuesto: "$500.000",
    institucion: "Colegio El Saber",
    observaciones: "Proyecto activo",
    estado: "Activo",
    docente: "Carlos Docente",
    integrantes: [
      { nombre: "Laura", apellido: "Estudiante", identificacion: "1003", grado: "10°" },
      { nombre: "Pedro", apellido: "Sin Rol", identificacion: "1004", grado: "11°" },
    ],
    historialEstado: [
      { fecha: "2025-03-01", estado: "Formulación" },
      { fecha: "2025-03-15", estado: "Evaluación" },
      { fecha: "2025-04-01", estado: "Activo" },
    ],
    bitacoras: [
      {
        id: 1,
        fecha: "2025-04-10",
        descripcion: "Instalación de paneles",
        observaciones: "Trabajo exitoso",
        fotos: ["https://via.placeholder.com/150"],
      },
    ],
  },
];

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const project = proyectosSimulados.find((p) => p.id === parseInt(id));
  const [estado, setEstado] = useState(project?.estado || "");
  const [observacionEstado, setObservacionEstado] = useState("");

  if (!project) {
    return <Typography variant="h5">Proyecto no encontrado</Typography>;
  }

  const esIntegrante =
    user?.rol === "estudiante" &&
    project.integrantes.some((i) => i.identificacion === user.identificacion);

  const cambiarEstado = () => {
    alert(`Estado cambiado a ${estado}\nObservación: ${observacionEstado}`);
    // Aquí iría la lógica para actualizar en Supabase
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
    doc.text(`Docente: ${project.docente}`, 14, 37);
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
      head: [["Nombre", "Apellido", "ID", "Grado"]],
      body: project.integrantes.map((i) => [
        i.nombre,
        i.apellido,
        i.identificacion,
        i.grado,
      ]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Fecha", "Estado"]],
      body: project.historialEstado.map((h) => [h.fecha, h.estado]),
      headStyles: { fillColor: [34, 153, 84] },
    });

    if (project.bitacoras?.length > 0) {
      let y = doc.lastAutoTable.finalY + 20;
      doc.setFont("helvetica", "bold");
      doc.text("Bitácoras:", 14, y);
      y += 8;

      for (const b of project.bitacoras) {
        doc.text(`${b.fecha} - ${b.descripcion}`, 14, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.text(`Observaciones: ${b.observaciones}`, 14, y);
        y += 10;

        for (const foto of b.fotos) {
          try {
            const imgData = await obtenerImagenBase64(foto);
            doc.addImage(imgData, "JPEG", 14, y, 50, 35);
            y += 40;
          } catch {
            doc.text("Error al cargar imagen.", 14, y);
            y += 10;
          }
        }

        y += 10;
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      }
    }

    doc.save(`proyecto_${project.id}.pdf`);
  };

  return (
    <Container className="project-details-page">
      <Box className="project-container">
        <Typography variant="h4" className="project-title">
          {project.titulo}
        </Typography>

        <Box className="project-info">
          <Typography><strong>Área:</strong> {project.area}</Typography>
          <Typography><strong>Docente:</strong> {project.docente}</Typography>
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
                {i.nombre} {i.apellido} - ID: {i.identificacion} - Grado: {i.grado}
              </li>
            ))}
          </ul>
        </Box>

        <Box className="project-section">
          <Typography><strong>Observaciones:</strong> {project.observaciones}</Typography>
        </Box>

        <Box className="project-section">
          <Typography variant="h6">Historial de Estados</Typography>
          <ul className="project-ul">
            {project.historialEstado.map((h, i) => (
              <li key={i}><strong>{h.fecha}:</strong> {h.estado}</li>
            ))}
          </ul>
        </Box>

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
              to={`/proyectos/${project.id}/bitacora/nueva`}
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
