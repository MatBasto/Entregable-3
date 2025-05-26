import { useEffect, useState } from "react";
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

  const getStatusClass = (status) => {
    const statusMap = {
      'Formulación': 'status-formulacion',
      'Evaluación': 'status-evaluacion',
      'Activo': 'status-activo',
      'Finalizado': 'status-finalizado'
    };
    return statusMap[status] || 'status-formulacion';
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';
  };

  if (loading) {
    return (
      <div className="loading-container">
        Cargando proyecto...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="error-container">
        <h2 className="error-title">Proyecto no encontrado</h2>
        <Link to="/projects" className="btn btn-primary">
          ← Volver a proyectos
        </Link>
      </div>
    );
  }

  const esIntegrante =
    user?.rol === "estudiante" &&
    project.integrantes.some((i) => i.estudiante?.id === user.id);

  return (
    <div className="project-details-container">
      <div className="project-header">
        <h1 className="project-title">{project.titulo}</h1>
        <div className={`project-status-badge ${getStatusClass(project.estado)}`}>
          {project.estado}
        </div>
      </div>

      <div className="project-info-grid">
        <div className="info-card">
          <div className="info-label">Área</div>
          <div className="info-value">{project.area}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Docente</div>
          <div className="info-value">{project.usuarios?.nombre}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Institución</div>
          <div className="info-value">{project.institucion}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Cronograma</div>
          <div className="info-value">{project.cronograma}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Presupuesto</div>
          <div className="info-value">{project.presupuesto}</div>
        </div>
      </div>

      <div className="project-section">
        <h3 className="section-title">Objetivos</h3>
        <p className="info-value">{project.objetivos}</p>
      </div>

      <div className="project-section">
        <h3 className="section-title">Integrantes</h3>
        {project.integrantes.map((integrante, idx) => (
          <div key={idx} className="integrante-item">
            <div className="integrante-avatar">
              {getInitials(integrante.estudiante?.nombre)}
            </div>
            <div className="integrante-info">
              <div className="integrante-nombre">
                {integrante.estudiante?.nombre}
              </div>
              <div className="integrante-detalles">
                ID: {integrante.estudiante?.identificacion} • Grado: {integrante.estudiante?.grado}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="project-section">
        <h3 className="section-title">Observaciones</h3>
        <p className="info-value">{project.observaciones || "Sin observaciones"}</p>
      </div>

      {historial.length > 0 && (
        <div className="project-section">
          <h3 className="section-title">Historial de Estados</h3>
          {historial.map((h, idx) => (
            <div key={idx} className="historial-item">
              <div className="historial-fecha">{h.fecha}</div>
              <div className="historial-estado">{h.estado}</div>
              <div className="historial-observacion">
                {h.observaciones || "Sin observaciones"}
              </div>
            </div>
          ))}
        </div>
      )}

      {user?.rol === "coordinador" && (
        <div className="estado-form">
          <h3 className="estado-form-title">Cambiar Estado del Proyecto</h3>
          
          <div className="form-group">
            <label className="form-label">Nuevo Estado</label>
            <select
              className="form-select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="Formulación">Formulación</option>
              <option value="Evaluación">Evaluación</option>
              <option value="Activo">Activo</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Observación del cambio</label>
            <textarea
              className="form-textarea"
              placeholder="Describe el motivo del cambio de estado..."
              value={observacionEstado}
              onChange={(e) => setObservacionEstado(e.target.value)}
            />
          </div>

          <button
            className="btn btn-success"
            onClick={cambiarEstado}
          >
            💾 Guardar cambio de estado
          </button>
        </div>
      )}

      <div className="project-section">
        <h3 className="section-title">Bitácoras del Proyecto</h3>
        {project.bitacoras.length > 0 ? (
          <ul className="project-list">
            {project.bitacoras.map((bitacora) => (
              <li key={bitacora.id} className="project-list-item">
                <Link to={`/bitacora/${bitacora.id}`} className="bitacora-link">
                  📋 {bitacora.fecha} - {bitacora.descripcion}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="sin-bitacoras">
            📝 No hay bitácoras registradas para este proyecto
          </div>
        )}

        {esIntegrante && (
          <Link
            to={`/projects/${project.id}/bitacora/nueva`}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            ➕ Nueva Bitácora
          </Link>
        )}
      </div>

      <div className="actions-section">
        <button
          className="btn btn-secondary"
          onClick={generarPDF}
        >
          📄 Exportar a PDF
        </button>
        
        <Link
          to="/projects"
          className="btn btn-primary"
        >
          ← Volver a Proyectos
        </Link>
      </div>
    </div>
  );
}