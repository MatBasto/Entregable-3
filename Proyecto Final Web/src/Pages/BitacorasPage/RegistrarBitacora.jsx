import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { supabase } from "../../supabase";
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

  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
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
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const todosLosArchivos = [...form.imagenes, ...form.archivos];

  return (
    <div className="registrar-bitacora-container">
      <h1 className="registrar-bitacora-title">Registrar Bitácora</h1>
      
      <form className="bitacora-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            name="fecha"
            className="form-input"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-input form-textarea"
            placeholder="Describe las actividades realizadas..."
            value={form.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Observaciones</label>
          <textarea
            name="observaciones"
            className="form-input form-textarea large"
            placeholder="Anota observaciones importantes..."
            value={form.observaciones}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Archivos adjuntos</label>
          <div className="upload-section">
            <label className="upload-btn upload-btn-primary">
              <span>📷</span>
              <span>Subir Imágenes</span>
              <input
                type="file"
                className="upload-input"
                multiple
                accept="image/*"
                onChange={(e) => handleFileChange(e, "imagenes")}
              />
            </label>

            <label className="upload-btn upload-btn-secondary">
              <span>📎</span>
              <span>Adjuntar Archivos</span>
              <input
                type="file"
                className="upload-input"
                multiple
                onChange={(e) => handleFileChange(e, "archivos")}
              />
            </label>
          </div>
        </div>

        <div className="preview-section">
          <h3 className="preview-title">Archivos Seleccionados:</h3>
          {todosLosArchivos.length > 0 ? (
            todosLosArchivos.map((file, index) => (
              <div key={index} className="archivo-item">
                <div className="archivo-info">
                  <span>{form.imagenes.includes(file) ? "🖼️" : "📄"}</span>
                  <span className="archivo-nombre">{file.name}</span>
                </div>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => eliminarArchivo(
                    form.imagenes.includes(file) ? "imagenes" : "archivos",
                    form.imagenes.includes(file)
                      ? form.imagenes.indexOf(file)
                      : form.archivos.indexOf(file)
                  )}
                  title="Eliminar archivo"
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <div className="sin-archivos">
              No se han seleccionado archivos
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Bitácora"}
        </button>
      </form>
    </div>
  );
}