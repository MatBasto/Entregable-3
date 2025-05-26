import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import "./BitacoraDetalle.css";

export default function BitacoraDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bitacora, setBitacora] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBitacora = async () => {
      const { data, error } = await supabase
        .from("bitacoras")
        .select("*, proyecto:proyecto_id(titulo)")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al obtener la bitácora", error);
      } else {
        setBitacora(data);
      }
      setLoading(false);
    };

    fetchBitacora();
  }, [id]);

  const isImage = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
  };

  if (loading) {
    return (
      <div className="bitacora-loading">
        Cargando bitácora...
      </div>
    );
  }

  if (!bitacora) {
    return (
      <div className="bitacora-error">
        <h2 className="bitacora-error-title">Bitácora no encontrada</h2>
        <button 
          className="bitacora-volver-btn"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="bitacora-detalle-container">
      <h1 className="bitacora-detalle-title">
        Bitácora del {bitacora.fecha}
      </h1>

      <div className="bitacora-proyecto-info">
        <strong>Proyecto:</strong> {bitacora.proyecto?.titulo || bitacora.proyecto_id}
      </div>

      <div className="bitacora-seccion">
        <h3 className="bitacora-seccion-titulo">Descripción</h3>
        <p className="bitacora-texto">{bitacora.descripcion}</p>
      </div>

      <div className="bitacora-seccion">
        <h3 className="bitacora-seccion-titulo">Observaciones</h3>
        <p className="bitacora-texto">{bitacora.observaciones}</p>
      </div>

      <div className="bitacora-seccion">
        <h3 className="bitacora-seccion-titulo">Archivos adjuntos</h3>
        <div className="bitacora-archivos-grid">
          {bitacora.fotos && bitacora.fotos.length > 0 ? (
            bitacora.fotos.map((file, index) =>
              isImage(file) ? (
                <div key={index} className="bitacora-imagen-card">
                  <img
                    src={file}
                    alt={`Evidencia ${index + 1}`}
                    className="bitacora-imagen"
                  />
                </div>
              ) : (
                <a
                  key={index}
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bitacora-archivo-link"
                >
                  <span className="bitacora-archivo-icon">📎</span>
                  <span>Descargar archivo {index + 1}</span>
                </a>
              )
            )
          ) : (
            <div className="bitacora-sin-archivos">
              No se adjuntaron archivos.
            </div>
          )}
        </div>
      </div>

      <button 
        className="bitacora-volver-btn"
        onClick={() => navigate(-1)}
      >
        ← Volver al proyecto
      </button>
    </div>
  );
}