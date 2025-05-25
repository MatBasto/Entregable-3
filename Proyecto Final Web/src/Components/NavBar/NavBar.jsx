import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "@mui/material/styles";
import "./NavBar.css";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const commonLinks = [
    { label: "Inicio", to: "/" },
    { label: "Proyectos", to: "/projects" },
  ];

  if (user?.rol === "docente") {
    commonLinks.push({ label: "Nuevo Proyecto", to: "/projects/create" });
  }

  if (user?.rol === "coordinador") {
    commonLinks.push({ label: "Usuarios", to: "/usuarios" });
  }

  const authLinks = user
    ? [
        { label: `Cerrar sesión`, action: logout },
      ]
    : [
        { label: "Login", to: "/login" },
        { label: "Registro", to: "/register" },
      ];

  const renderLink = ({ label, to, action }, index) => {
    return (
      <ListItem button key={index} onClick={action} component={to ? Link : "button"} to={to || undefined}>
        <ListItemText primary={label} />
      </ListItem>
    );
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar className="nav-toolbar">
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Proyectos Escolares
              </Typography>
            </>
          ) : (
            <>
              <Box className="nav-links">
                {commonLinks.map((link, idx) => (
                  <Button
                    key={idx}
                    component={Link}
                    to={link.to}
                    className="nav-button"
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>

              <Box className="nav-user-info">
                {user && (
                  <Typography className="nav-username">
                    {user.nombre} ({user.rol})
                  </Typography>
                )}
                {authLinks.map((link, idx) => (
                  <Button
                    key={idx}
                    component={link.to ? Link : "button"}
                    to={link.to || undefined}
                    onClick={link.action || undefined}
                    className="nav-button"
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer móvil */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {commonLinks.map(renderLink)}
          </List>
          <Divider />
          <List>
            {user && (
              <ListItem>
                <ListItemText primary={`${user.nombre} (${user.rol})`} />
              </ListItem>
            )}
            {authLinks.map(renderLink)}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
