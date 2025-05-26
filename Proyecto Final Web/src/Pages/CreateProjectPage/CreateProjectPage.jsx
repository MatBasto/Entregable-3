import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useAuth } from "../../Context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import "./CreateProjectPage.css";

export default function CreateProjectPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.rol !== "docente") return <Navigate to="/" />;

  const [formData, setFormData] = useState({
    titulo: "",
    area: "",
    objetivos: "",
    cronograma: "",
    presupuesto: "",
    institucion: "",
    observaciones: "",
  });

  const [integrantes, setIntegrantes] = useState([
    { identificacion: "", nombre: null },
  ]);

  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIdentificacionChange = async (index, value) => {
    const nuevos = [...integrantes];
    nuevos[index].identificacion = value;
    nuevos[index].nombre = null;

    if (value.trim() !== "") {
      const { data, error } = await supabase
        .from("usuarios")
        .select("nombre")
        .eq("identificacion", value.trim())
        .eq("rol", "estudiante")
        .single();

      if (!error && data) {
        nuevos[index].nombre = data.nombre;
      } else {
        nuevos[index].nombre = null;
      }
    }

    setIntegrantes(nuevos);
  };

  const agregarCampoIdentificacion = () => {
    setIntegrantes([...integrantes, { identificacion: "", nombre: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setAviso("");

    const { data: proyecto, error: proyectoError } = await supabase
      .from("proyectos")
      .insert({
        ...formData,
        estado: "Formulación",
        docente_id: user.id,
      })
      .select()
      .single();

    if (proyectoError) {
      console.error("Error al crear proyecto:", proyectoError.message);
      setError("No se pudo crear el proyecto.");
      return;
    }

    const ids = integrantes.map((i) => i.identificacion.trim()).filter(Boolean);

    const { data: estudiantes, error: estError } = await supabase
      .from("usuarios")
      .select("id, identificacion")
      .in("identificacion", ids);

    if (estError) {
      console.error("Error al buscar estudiantes:", estError.message);
      setError("Error al buscar estudiantes.");
      return;
    }

    const registros = estudiantes.map((e) => ({
      proyecto_id: proyecto.id,
      estudiante_id: e.id,
    }));

    if (registros.length > 0) {
      const { error: insertError } = await supabase
        .from("integrantes")
        .insert(registros);

      if (insertError) {
        console.error("Error al registrar integrantes:", insertError.message);
        setAviso("Proyecto creado, pero ocurrió un error al agregar integrantes.");
      }
    }

    const encontradas = estudiantes.map((e) => e.identificacion);
    const noEncontradas = ids.filter((id) => !encontradas.includes(id));

    if (noEncontradas.length > 0) {
      setAviso(
        `Proyecto creado. Las siguientes identificaciones no se encontraron: ${noEncontradas.join(", ")}.`
      );
    } else {
      alert("Proyecto creado correctamente.");
      navigate("/projects");
    }
  };

  const formFields = [
    { label: "Título", name: "titulo", required: true },
    { label: "Área", name: "area", required: true },
    { label: "Objetivos", name: "objetivos", required: true },
    { label: "Cronograma", name: "cronograma", required: true },
    { label: "Presupuesto", name: "presupuesto", required: true },
    { label: "Institución", name: "institucion", required: true },
    { label: "Observaciones", name: "observaciones", required: false },
  ];

  return (
    <div className="create-page">
      <Container maxWidth="lg">
        <Box className="create-container">
          <Typography variant="h4" className="create-title">
            Crear Nuevo Proyecto
          </Typography>

          <div className="alert-container">
            {error && <Alert severity="error">{error}</Alert>}
            {aviso && <Alert severity="warning">{aviso}</Alert>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {formFields.map((field) => (
                <div key={field.name} className="form-field">
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    multiline={field.name === "objetivos" || field.name === "observaciones"}
                    rows={field.name === "objetivos" || field.name === "observaciones" ? 3 : 1}
                  />
                </div>
              ))}
            </div>

            <div className="integrantes-section">
              <Typography variant="h6" className="integrantes-title">
                Estudiantes del Proyecto
              </Typography>

              {integrantes.map((integrante, index) => (
                <div key={index} className="integrante-group">
                  <div className="integrante-field">
                    <TextField
                      fullWidth
                      label={`Identificación del estudiante ${index + 1}`}
                      value={integrante.identificacion}
                      onChange={(e) => handleIdentificacionChange(index, e.target.value)}
                      required
                      placeholder="Ingrese la identificación del estudiante"
                    />
                  </div>
                  
                  {integrante.identificacion && (
                    <div className={`student-status ${
                      integrante.nombre ? 'student-found' : 'student-not-found'
                    }`}>
                      {integrante.nombre ? (
                        `✓ ${integrante.nombre} - Estudiante encontrado`
                      ) : (
                        "✗ Estudiante no encontrado en el sistema"
                      )}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={agregarCampoIdentificacion}
                className="add-student-button"
              >
                + Agregar otro estudiante
              </button>
            </div>

            <div className="submit-section">
              <button type="submit" className="submit-button">
                Registrar Proyecto
              </button>
            </div>
          </form>
        </Box>
      </Container>
    </div>
  );
}