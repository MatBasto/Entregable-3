import { createContext, useContext, useState, useEffect } from "react";

// Cuentas simuladas iniciales
const usuariosIniciales = [
  {
    id: 1,
    correo: "coordinador@ejemplo.com",
    password: "123456",
    nombre: "Ana Coordinadora",
    rol: "coordinador",
    identificacion: "1001",
    edad: 40,
    colegio: "Colegio Central",
    grado: "",
  },
  {
    id: 2,
    correo: "docente@ejemplo.com",
    password: "123456",
    nombre: "Carlos Docente",
    rol: "docente",
    identificacion: "1002",
    edad: 35,
    colegio: "Colegio El Saber",
    grado: "",
  },
  {
    id: 3,
    correo: "estudiante@ejemplo.com",
    password: "123456",
    nombre: "Laura Estudiante",
    rol: "estudiante",
    identificacion: "1003",
    edad: 16,
    colegio: "Colegio Campestre",
    grado: "10°",
  },
  {
    id: 4,
    correo: "sinrol@ejemplo.com",
    password: "123456",
    nombre: "Pedro Sin Rol",
    rol: null,
    identificacion: "1004",
    edad: 17,
    colegio: "Colegio Libre",
    grado: "11°",
  },
];

// Crear contexto
const AuthContext = createContext();

// Hook personalizado para usar contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor de contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem("usuarios");
    return guardados ? JSON.parse(guardados) : usuariosIniciales;
  });

  // Guardar usuarios en localStorage cada vez que se actualicen
  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  // Restaurar sesión activa al cargar la app
  useEffect(() => {
    const guardado = localStorage.getItem("usuarioActivo");
    if (guardado) {
      setUser(JSON.parse(guardado));
    }
  }, []);

  // Función para iniciar sesión
  const login = (correo, password) => {
    const usuario = usuarios.find(
      (u) => u.correo === correo && u.password === password
    );

    if (!usuario) {
      return { success: false, message: "Correo o contraseña incorrectos." };
    }

    if (!usuario.rol) {
      return {
        success: false,
        message: "Tu cuenta aún no tiene un rol asignado. Espera aprobación del coordinador.",
      };
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    setUser(usuario);
    return { success: true };
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("usuarioActivo");
    setUser(null);
  };

  // Función para registrar nuevo usuario
  const register = (nuevoUsuario) => {
    const existe = usuarios.some((u) => u.correo === nuevoUsuario.correo);
    if (existe) {
      return { success: false, message: "Ya existe una cuenta con este correo." };
    }

    const usuario = {
      ...nuevoUsuario,
      id: usuarios.length + 1,
      rol: null,
    };

    setUsuarios([...usuarios, usuario]);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, usuarios, setUsuarios }}
    >
      {children}
    </AuthContext.Provider>
  );
}
