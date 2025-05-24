import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../../Context/AuthContext";
import "./NavBar.css";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static" color="primary">
      <Toolbar className="nav-toolbar">
        <Box className="nav-links">
          <Button component={Link} to="/">
            Inicio
          </Button>
          <Button component={Link} to="/projects">
            Proyectos
          </Button>
          {user?.rol === "docente" && (
            <Button component={Link} to="/projects/create">
              Nuevo Proyecto
            </Button>
          )}
          {user?.rol === "coordinador" && (
            <Button component={Link} to="/usuarios">
              Usuarios
            </Button>
          )}
        </Box>

        <Box className="nav-user-info">
          {user ? (
            <>
              <Typography className="nav-username">
                {user.nombre} ({user.rol})
              </Typography>
              <Button onClick={logout}>Cerrar sesión</Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login">Login</Button>
              <Button component={Link} to="/register">Registro</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
