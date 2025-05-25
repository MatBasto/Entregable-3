import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "../supabase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuarios al inicio
  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data, error } = await supabase.from("usuarios").select("*");
      if (error) {
        console.error("Error al cargar usuarios:", error.message);
      } else {
        setUsuarios(data);
      }
      setLoading(false);
    };

    fetchUsuarios();
  }, []);

  // Login simple contra la tabla usuarios
  const login = async (correo, password) => {
    const usuario = usuarios.find(
      (u) => u.correo === correo && u.password === password
    );

    if (!usuario) {
      return { success: false, message: "Correo o contraseña incorrectos." };
    }

    if (!usuario.rol) {
      return {
        success: false,
        message: "Tu cuenta aún no tiene un rol asignado.",
      };
    }

    setUser(usuario);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (nuevoUsuario) => {
    const { data, error } = await supabase.from("usuarios").insert([nuevoUsuario]);
    if (error) {
      return { success: false, message: error.message };
    }

    // recargar usuarios
    const { data: nuevosUsuarios } = await supabase.from("usuarios").select("*");
    setUsuarios(nuevosUsuarios);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, usuarios, setUsuarios }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
