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
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useTheme } from "@mui/material/styles";
import "./NavBar.css";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Configuración de enlaces de navegación
  const getNavigationLinks = () => {
    const baseLinks = [
      { label: "Inicio", to: "/" },
      { label: "Proyectos", to: "/projects" },
    ];

    if (user?.rol === "docente") {
      baseLinks.push({ label: "Nuevo Proyecto", to: "/projects/create" });
    }

    if (user?.rol === "coordinador") {
      baseLinks.push({ label: "Usuarios", to: "/usuarios" });
    }

    return baseLinks;
  };

  const getAuthLinks = () => {
    return user
      ? [{ label: "Cerrar sesión", action: logout, icon: <LogoutIcon /> }]
      : [
          { label: "Iniciar Sesión", to: "/login" },
          { label: "Registrarse", to: "/register" },
        ];
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const renderNavigationButton = (link, index) => (
    <Button
      key={index}
      component={Link}
      to={link.to}
      className="nav-link-button"
    >
      {link.label}
    </Button>
  );

  const renderAuthButton = (link, index) => (
    <Button
      key={index}
      component={link.to ? Link : "button"}
      to={link.to}
      onClick={link.action}
      className={link.action ? "nav-logout-button" : "nav-auth-button"}
      startIcon={link.icon}
    >
      {link.label}
    </Button>
  );

  const renderDrawerItem = (link, index) => (
    <ListItem
      key={index}
      component={link.to ? Link : "button"}
      to={link.to}
      onClick={link.action || handleDrawerClose}
      className="drawer-item"
    >
      {link.icon && <Box className="drawer-item-icon">{link.icon}</Box>}
      <ListItemText primary={link.label} />
    </ListItem>
  );

  const navigationLinks = getNavigationLinks();
  const authLinks = getAuthLinks();

  if (isMobile) {
    return (
      <>
        <AppBar position="static" className="navbar">
          <Toolbar className="navbar-toolbar">
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerToggle}
              className="menu-button"
              aria-label="abrir menú"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className="navbar-title">
              Proyectos Escolares
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={handleDrawerClose}
          className="navbar-drawer"
        >
          <Box className="drawer-content" role="presentation">
            <Box className="drawer-header">
              <Typography variant="h6" className="drawer-title">
                Menú
              </Typography>
            </Box>
            <Divider />
            
            <List className="drawer-nav-list">
              {navigationLinks.map(renderDrawerItem)}
            </List>
            
            <Divider />
            
            <List className="drawer-auth-list">
              {user && (
                <ListItem className="drawer-user-info">
                  <Avatar className="user-avatar">
                    <PersonIcon />
                  </Avatar>
                  <Box className="user-details">
                    <Typography variant="body2" className="user-name">
                      {user.nombre}
                    </Typography>
                    <Typography variant="caption" className="user-role">
                      {user.rol}
                    </Typography>
                  </Box>
                </ListItem>
              )}
              {authLinks.map(renderDrawerItem)}
            </List>
          </Box>
        </Drawer>
      </>
    );
  }

  return (
    <AppBar position="static" className="navbar">
      <Toolbar className="navbar-toolbar">
        <Box className="navbar-brand">
          <Typography variant="h6" className="navbar-title">
            Proyectos Escolares
          </Typography>
        </Box>

        <Box className="navbar-navigation">
          {navigationLinks.map(renderNavigationButton)}
        </Box>

        <Box className="navbar-user-section">
          {user && (
            <Box className="user-info">
              <Avatar className="user-avatar">
                <PersonIcon />
              </Avatar>
              <Box className="user-details">
                <Typography variant="body2" className="user-name">
                  {user.nombre}
                </Typography>
                <Typography variant="caption" className="user-role">
                  {user.rol}
                </Typography>
              </Box>
            </Box>
          )}
          <Box className="auth-buttons">
            {authLinks.map(renderAuthButton)}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}