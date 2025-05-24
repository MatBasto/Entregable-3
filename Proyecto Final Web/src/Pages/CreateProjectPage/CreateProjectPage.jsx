import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { useAuth } from "../../Context/AuthContext";
import { Navigate } from "react-router-dom";
import "./CreateProjectPage.css";

export default function CreateProjectPage() {
  const { user } = useAuth();

  if (user?.rol !== "docente") {
    return <Navigate to="/" />;
  }

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
    { nombre: "", apellido: "", identificacion: "", grado: "" },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIntegranteChange = (index, field, value) => {
    const nuevos = [...integrantes];
    nuevos[index][field] = value;
    setIntegrantes(nuevos);
  };

  const agregarIntegrante = () => {
    setIntegrantes([
      ...integrantes,
      { nombre: "", apellido: "", identificacion: "", grado: "" },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoProyecto = {
      ...formData,
      estado: "Formulación",
      docente: user.nombre,
      integrantes,
    };

    console.log("Proyecto creado:", nuevoProyecto);
    alert("Proyecto registrado correctamente (simulado)");
  };

  return (
    <Container maxWidth="md">
      <Box className="create-container">
        <Typography variant="h4" className="create-title">
          Crear Nuevo Proyecto
        </Typography>
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

          <Typography variant="h6" className="integrantes-section">
            Integrantes del equipo
          </Typography>

          {integrantes.map((integrante, index) => (
            <Grid container spacing={2} key={index} className="integrante-group">
              {[
                { label: "Nombre", field: "nombre" },
                { label: "Apellido", field: "apellido" },
                { label: "Identificación", field: "identificacion" },
                { label: "Grado escolar", field: "grado" },
              ].map(({ label, field }) => (
                <Grid item xs={12} sm={3} key={field}>
                  <TextField
                    fullWidth
                    label={label}
                    value={integrante[field]}
                    onChange={(e) => handleIntegranteChange(index, field, e.target.value)}
                    required
                  />
                </Grid>
              ))}
            </Grid>
          ))}

          <Button type="button" onClick={agregarIntegrante} className="add-button">
            + Agregar integrante
          </Button>

          <Button type="submit" className="submit-button">
            Registrar Proyecto
          </Button>
        </form>
      </Box>
    </Container>
  );
}
