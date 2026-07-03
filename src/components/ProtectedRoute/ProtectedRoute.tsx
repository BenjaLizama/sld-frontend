import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  roles: string[];
  userId: string;
  sub: string;
}

interface ProtectedRouteProps {
  allowedRole: string;
}

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    // 🚫 No hay token: Mandar al login
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const roles = decoded.roles;

    // 👮 Verificar si el usuario tiene el rol requerido
    if (!roles.includes(allowedRole)) {
      // Si está logueado pero no es Admin, lo mandamos a una ruta segura por defecto
      alert("Acceso denegado: No tienes permisos de administrador.");
      return <Navigate to="/" replace />;
    }

    // ✅ Todo en orden: Permite el paso al componente hijo (el formulario de registro)
    return <Outlet />;
  } catch (error) {
    // Token inválido o corrupto
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}
