import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { supabase } from "../../supabase";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import "./RegistrarBitacora.css";

export default function RegistrarBitacora() {
  const { id: proyectoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fecha: "",
    descripcion: "",
    observaciones: "",
    imagenes: [],
    archivos: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, tipo) => {
    const nuevos = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      [tipo]: [...prev[tipo], ...nuevos],
    }));
  };

  const eliminarArchivo = (tipo, index) => {
    const copia = [...form[tipo]];
    copia.splice(index, 1);
    setForm({ ...form, [tipo]: copia });
  };

  const subirArchivos = async () => {
    const urls = [];
    const todosArchivos = [...form.imagenes, ...form.archivos];

    for (const file of todosArchivos) {
      const nombreArchivo = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from("bitacoras").upload(nombreArchivo, file);

      if (error) {
        console.error("Error al subir archivo", error);
        continue;
      }

      const { data } = supabase.storage.from("bitacoras").getPublicUrl(nombreArchivo);
      urls.push(data.publicUrl);
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fotos = await subirArchivos();

    const { error } = await supabase.from("bitacoras").insert({
      proyecto_id: proyectoId,
      autor_id: user.id,
      fecha: form.fecha,
      descripcion: form.descripcion,
      observaciones: form.observaciones,
      fotos,
    });

    if (!error) {
      alert("Bitácora registrada correctamente");
      navigate(`/projects/${proyectoId}`);
    } else {
      console.error("Error al registrar bitácora", error);
      alert("Ocurrió un error al registrar la bitácora.");
    }
  };

  return (
    <Container className="bitacora-form">
      <Typography variant="h4">Registrar Bitácora</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Fecha"
          type="date"
          name="fecha"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={form.fecha}
          onChange={handleChange}
          required
        />

        <TextField
          label="Descripción"
          name="descripcion"
          multiline
          rows={4}
          fullWidth
          value={form.descripcion}
          onChange={handleChange}
          required
        />

        <TextField
          label="Observaciones"
          name="observaciones"
          multiline
          rows={3}
          fullWidth
          value={form.observaciones}
          onChange={handleChange}
        />

        <Box className="upload-section">
          <Button variant="contained" component="label" startIcon={<ImageIcon />}>
            Subir Imágenes
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, "imagenes")}
            />
          </Button>

          <Button variant="outlined" component="label" startIcon={<AttachFileIcon />}>
            Adjuntar Archivos
            <input
              type="file"
              hidden
              multiple
              onChange={(e) => handleFileChange(e, "archivos")}
            />
          </Button>
        </Box>

        <Box className="preview-section">
          <Typography variant="subtitle1">Archivos Seleccionados:</Typography>
          {[...form.imagenes, ...form.archivos].map((file, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1} mt={1}>
              <Typography>{file.name}</Typography>
              <IconButton onClick={() => eliminarArchivo(
                form.imagenes.includes(file) ? "imagenes" : "archivos",
                form.imagenes.includes(file)
                  ? form.imagenes.indexOf(file)
                  : form.archivos.indexOf(file)
              )}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="submit-bitacora"
        >
          Guardar Bitácora
        </Button>
      </form>
    </Container>
  );
}
