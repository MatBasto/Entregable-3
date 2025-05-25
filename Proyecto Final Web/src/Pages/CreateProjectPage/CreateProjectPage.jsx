import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
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

  return (
    <Container maxWidth="md">
      <Box className="create-container">
        <Typography variant="h4" className="create-title">
          Crear Nuevo Proyecto
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {aviso && <Alert severity="warning">{aviso}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              { label: "Título", name: "titulo" },
              { label: "Área", name: "area" },
              { label: "Objetivos", name: "objetivos" },
              { label: "Cronograma", name: "cronograma" },
              { label: "Presupuesto", name: "presupuesto" },
              { label: "Institución", name: "institucion" },
              { label: "Observaciones", name: "observaciones" },
            ].map((field) => (
              <Grid item xs={12} sm={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Estudiantes (por identificación)
          </Typography>

          {integrantes.map((i, idx) => (
            <Box key={idx} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={`Identificación del estudiante ${idx + 1}`}
                value={i.identificacion}
                onChange={(e) => handleIdentificacionChange(idx, e.target.value)}
                required
              />
              {i.identificacion && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {i.nombre ? (
                    <span style={{ color: "green" }}>
                      ✓ {i.nombre} encontrado
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>
                      ✗ No encontrado
                    </span>
                  )}
                </Typography>
              )}
            </Box>
          ))}

          <Button
            type="button"
            onClick={agregarCampoIdentificacion}
            sx={{ mt: 2 }}
          >
            + Agregar otro estudiante
          </Button>

          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            Registrar Proyecto
          </Button>
        </form>
      </Box>
    </Container>
  );
}
