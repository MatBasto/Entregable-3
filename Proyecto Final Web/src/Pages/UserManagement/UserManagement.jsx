import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
} from "@mui/material";
import { useAuth } from "../../Context/AuthContext";
import "./UserManagement.css";

export default function UserManagement() {
  const { user, usuarios, setUsuarios } = useAuth();

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "estudiante",
  });

  const [modoEdicion, setModoEdicion] = useState(null);
  const [usuarioEditado, setUsuarioEditado] = useState({
    nombre: "",
    correo: "",
    rol: "",
  });

  const [error, setError] = useState("");

  if (user?.rol !== "coordinador") {
    return <Typography variant="h5" className="acceso-denegado">Acceso denegado</Typography>;
  }

  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setUsuarioEditado({ ...usuarioEditado, [e.target.name]: e.target.value });
  };

  const agregarUsuario = () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.correo || !nuevoUsuario.password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const existe = usuarios.some((u) => u.correo === nuevoUsuario.correo);
    if (existe) {
      setError("Ya existe una cuenta con este correo.");
      return;
    }

    const nuevo = {
      ...nuevoUsuario,
      id: usuarios.length + 1,
      identificacion: Date.now().toString(),
      edad: 0,
      colegio: "",
      grado: "",
    };

    setUsuarios([...usuarios, nuevo]);
    setNuevoUsuario({ nombre: "", correo: "", password: "", rol: "estudiante" });
    setError("");
  };

  const eliminarUsuario = (id) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  const iniciarEdicion = (usuario) => {
    setModoEdicion(usuario.id);
    setUsuarioEditado({ ...usuario });
  };

  const cancelarEdicion = () => {
    setModoEdicion(null);
    setUsuarioEditado({ nombre: "", correo: "", rol: "" });
  };

  const guardarUsuario = () => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === usuarioEditado.id ? usuarioEditado : u
      )
    );
    cancelarEdicion();
  };

  return (
    <Container>
      <Typography variant="h4" className="titulo-principal">
        Gestión de Usuarios
      </Typography>

      <Box className="formulario-usuario">
        <Typography variant="h6" className="subtitulo">Crear nuevo usuario</Typography>
        {error && <Alert severity="error" className="mensaje-error">{error}</Alert>}

        <Box className="campos-formulario">
          <TextField label="Nombre" name="nombre" value={nuevoUsuario.nombre} onChange={handleChange} />
          <TextField label="Correo" name="correo" value={nuevoUsuario.correo} onChange={handleChange} />
          <TextField label="Contraseña" name="password" type="password" value={nuevoUsuario.password} onChange={handleChange} />
          <TextField select label="Rol" name="rol" value={nuevoUsuario.rol} onChange={handleChange}>
            <MenuItem value="estudiante">Estudiante</MenuItem>
            <MenuItem value="docente">Docente</MenuItem>
          </TextField>
          <Button variant="contained" onClick={agregarUsuario}>
            Agregar
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" className="subtitulo">Usuarios registrados</Typography>

      <Table className="tabla-usuarios">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                {modoEdicion === u.id ? (
                  <TextField name="nombre" value={usuarioEditado.nombre} onChange={handleEditChange} />
                ) : u.nombre}
              </TableCell>
              <TableCell>
                {modoEdicion === u.id ? (
                  <TextField name="correo" value={usuarioEditado.correo} onChange={handleEditChange} />
                ) : u.correo}
              </TableCell>
              <TableCell>
                {modoEdicion === u.id ? (
                  <TextField select name="rol" value={usuarioEditado.rol || ""} onChange={handleEditChange}>
                    <MenuItem value="estudiante">Estudiante</MenuItem>
                    <MenuItem value="docente">Docente</MenuItem>
                    <MenuItem value="coordinador">Coordinador</MenuItem>
                  </TextField>
                ) : u.rol || <em>Sin rol</em>}
              </TableCell>
              <TableCell>
                {modoEdicion === u.id ? (
                  <>
                    <Button color="success" onClick={guardarUsuario}>
                      Guardar
                    </Button>
                    <Button color="inherit" onClick={cancelarEdicion}>
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button color="primary" onClick={() => iniciarEdicion(u)} disabled={!u.rol}>
                      Editar
                    </Button>
                    <Button color="error" onClick={() => eliminarUsuario(u.id)}>
                      Eliminar
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
