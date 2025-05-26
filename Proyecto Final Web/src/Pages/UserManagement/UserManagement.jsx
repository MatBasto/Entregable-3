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
import { supabase } from "../../supabase";
import "./UserManagement.css";

export default function UserManagement() {
  const { user, usuarios, setUsuarios } = useAuth();

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    password: "",
    rol: "estudiante",
    identificacion: "",
  });

  const [modoEdicion, setModoEdicion] = useState(null);
  const [usuarioEditado, setUsuarioEditado] = useState({
    nombre: "",
    correo: "",
    rol: "",
    edad: "",
    colegio: "",
    grado: "",
    identificacion: "",
  });

  const [error, setError] = useState("");

  if (user?.rol !== "coordinador") {
    return (
      <Typography variant="h5" className="acceso-denegado">
        Acceso denegado
      </Typography>
    );
  }

  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setUsuarioEditado({ ...usuarioEditado, [e.target.name]: e.target.value });
  };

  const agregarUsuario = async () => {
    const { nombre, correo, password, rol, identificacion } = nuevoUsuario;

    if (!nombre || !correo || !password || !identificacion) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    const existe = usuarios.some((u) => u.correo === correo || u.identificacion === identificacion);
    if (existe) {
      setError("Ya existe un usuario con este correo o identificación.");
      return;
    }

    const nuevo = {
      ...nuevoUsuario,
      edad: 0,
      colegio: "",
      grado: "",
    };

    const { data, error: supabaseError } = await supabase
      .from("usuarios")
      .insert(nuevo)
      .select()
      .single();

    if (supabaseError) {
      console.error("Error al agregar usuario:", supabaseError.message);
      setError("Ocurrió un error al registrar el usuario.");
      return;
    }

    setUsuarios([...usuarios, data]);
    setNuevoUsuario({ nombre: "", correo: "", password: "", rol: "estudiante", identificacion: "" });
    setError("");
  };

  const eliminarUsuario = async (id) => {
    const { error } = await supabase.from("usuarios").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar usuario:", error.message);
      alert("Error al eliminar el usuario");
      return;
    }

    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  const iniciarEdicion = (usuario) => {
    setModoEdicion(usuario.id);
    setUsuarioEditado({ ...usuario });
  };

  const cancelarEdicion = () => {
    setModoEdicion(null);
    setUsuarioEditado({
      nombre: "",
      correo: "",
      rol: "",
      edad: "",
      colegio: "",
      grado: "",
      identificacion: "",
    });
  };

  const guardarUsuario = async () => {
    const { error } = await supabase
      .from("usuarios")
      .update({
        nombre: usuarioEditado.nombre,
        correo: usuarioEditado.correo,
        rol: usuarioEditado.rol,
        edad: usuarioEditado.edad,
        colegio: usuarioEditado.colegio,
        grado: usuarioEditado.grado,
        identificacion: usuarioEditado.identificacion,
      })
      .eq("id", usuarioEditado.id);

    if (error) {
      console.error("Error al actualizar usuario:", error.message);
      alert("Error al guardar los cambios.");
      return;
    }

    setUsuarios(
      usuarios.map((u) =>
        u.id === usuarioEditado.id ? { ...u, ...usuarioEditado } : u
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
        <Typography variant="h6" className="subtitulo">
          Crear nuevo usuario
        </Typography>
        
        {error && (
          <Alert severity="error" className="mensaje-error">
            {error}
          </Alert>
        )}

        <Box className="campos-formulario">
          <TextField 
            label="Nombre" 
            name="nombre" 
            value={nuevoUsuario.nombre} 
            onChange={handleChange} 
          />
          <TextField 
            label="Correo" 
            name="correo" 
            value={nuevoUsuario.correo} 
            onChange={handleChange} 
          />
          <TextField 
            label="Contraseña" 
            name="password" 
            type="password" 
            value={nuevoUsuario.password} 
            onChange={handleChange} 
          />
          <TextField 
            label="Identificación" 
            name="identificacion" 
            value={nuevoUsuario.identificacion} 
            onChange={handleChange} 
          />
          <TextField 
            select 
            label="Rol" 
            name="rol" 
            value={nuevoUsuario.rol} 
            onChange={handleChange}
          >
            <MenuItem value="estudiante">Estudiante</MenuItem>
            <MenuItem value="docente">Docente</MenuItem>
            <MenuItem value="coordinador">Coordinador</MenuItem>
          </TextField>
          <Button variant="contained" onClick={agregarUsuario}>
            Agregar
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" className="subtitulo">
        Usuarios registrados
      </Typography>

      <Table className="tabla-usuarios">
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Identificación</TableCell>
            <TableCell>Edad</TableCell>
            <TableCell>Colegio</TableCell>
            <TableCell>Grado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(usuarios || []).map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                {modoEdicion === u.id ? (
                  <TextField 
                    name="nombre" 
                    value={usuarioEditado.nombre} 
                    onChange={handleEditChange} 
                  />
                ) : (
                  u.nombre
                )}
              </TableCell>
              <TableCell>
                {modoEdicion === u.id ? (
                  <TextField 
                    name="correo" 
                    value={usuarioEditado.correo} 
                    onChange={handleEditChange} 
                  />
                ) : (
                  u.correo
                )}
              </TableCell>
              <TableCell>
                {modoEdicion === u.id ? (
                  <TextField 
                    select 
                    name="rol" 
                    value={usuarioEditado.rol || ""} 
                    onChange={handleEditChange}
                  >
                    <MenuItem value="estudiante">Estudiante</MenuItem>
                    <MenuItem value="docente">Docente</MenuItem>
                    <MenuItem value="coordinador">Coordinador</MenuItem>
                  </TextField>
                ) : (
                  u.rol || <em>Sin rol</em>
                )}
              </TableCell>
              <TableCell>
                {modoEdicion === u.id ? (
                  <TextField 
                    name="identificacion" 
                    value={usuarioEditado.identificacion || ""} 
                    onChange={handleEditChange} 
                  />
                ) : (
                  u.identificacion || "-"
                )}
              </TableCell>
              <TableCell>
                {modoEdicion === u.id ? (
                  <TextField 
                    name="edad" 
                    value={usuarioEditado.edad || ""} 
                    onChange={handleEditChange} 
                  />
                ) : (
                  u.edad || "-"
                )}
              </TableCell>
              <TableCell>
                {modoEdicion === u.id ? (
                  <TextField 
                    name="colegio" 
                    value={usuarioEditado.colegio || ""} 
                    onChange={handleEditChange} 
                  />
                ) : (
                  u.colegio || "-"
                )}
              </TableCell>
              <TableCell>
                {modoEdicion === u.id ? (
                  <TextField 
                    name="grado" 
                    value={usuarioEditado.grado || ""} 
                    onChange={handleEditChange} 
                  />
                ) : (
                  u.grado || "-"
                )}
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
                    <Button color="primary" onClick={() => iniciarEdicion(u)}>
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