import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Link as MuiLink } from "@mui/material";
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

  if (loading) return <Typography>Cargando...</Typography>;
  if (!bitacora)
    return (
      <Container className="bitacora-container">
        <Typography variant="h5">Bitácora no encontrada</Typography>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </Container>
    );

  const isImage = (url) => {
    const extension = url.split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
  };

  return (
    <Container className="bitacora-container">
      <Typography variant="h4" className="bitacora-title">
        Bitácora del {bitacora.fecha}
      </Typography>

      <Typography>
        <strong>Proyecto:</strong> {bitacora.proyecto?.titulo || bitacora.proyecto_id}
      </Typography>

      <Typography className="bitacora-section">
        <strong>Descripción:</strong>
      </Typography>
      <Typography>{bitacora.descripcion}</Typography>

      <Typography className="bitacora-section">
        <strong>Observaciones:</strong>
      </Typography>
      <Typography>{bitacora.observaciones}</Typography>

      <Typography className="bitacora-section">
        <strong>Archivos adjuntos:</strong>
      </Typography>
      <Box className="bitacora-fotos">
        {bitacora.fotos?.length > 0 ? (
          bitacora.fotos.map((file, index) =>
            isImage(file) ? (
              <img
                key={index}
                src={file}
                alt={`evidencia-${index}`}
                className="bitacora-img"
              />
            ) : (
              <Typography key={index}>
                📎 <MuiLink href={file} target="_blank" rel="noopener noreferrer">
                  Descargar archivo {index + 1}
                </MuiLink>
              </Typography>
            )
          )
        ) : (
          <Typography>No se adjuntaron archivos.</Typography>
        )}
      </Box>

      <Button variant="outlined" onClick={() => navigate(-1)}>
        ← Volver al proyecto
      </Button>
    </Container>
  );
}
