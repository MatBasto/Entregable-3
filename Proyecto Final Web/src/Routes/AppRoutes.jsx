import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";
import ProjectsPage from "../Pages/ProjectsPage/ProjectsPage";
import ProjectDetailsPage from "../Pages/ProjectDetailsPage/ProjectDetailsPage";
import RegistrarBitacora from "../Pages/BitacorasPage/RegistrarBitacora";
import BitacoraDetalle from "../Pages/BitacorasPage/BitacoraDetalle";
import UserManagement from "../Pages/UserManagement/UserManagement";
import { useAuth } from "../Context/AuthContext";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:id" element={<ProjectDetailsPage />} />

      {user?.rol === "estudiante" && (
        <Route path="/projects/:id/bitacora/nueva" element={<RegistrarBitacora />} />
      )}

      {user && (
        <Route path="/bitacora/:id" element={<BitacoraDetalle />} />
      )}

      {user?.rol === "coordinador" && (
        <Route path="/usuarios" element={<UserManagement />} />
      )}

      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}
