import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { listaUsuarios } from "../../services/user.service"; // 🚀 Importas tu servicio nuevo

interface CustomJwtPayload {
  roles: string[];
  userId: string;
  sub: string; // email
}

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    displayName: string;
    role: string;
    initial: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNavbarData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 1. Desarmamos el Token JWT
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const mainRole = decoded.roles[0] || "SIN_ROL";
        const loggedEmail = decoded.sub;

        // 2. 🚀 Llamamos a tu servicio para traer a todos los usuarios
        const allUsers = await listaUsuarios();

        // 3. Buscamos al usuario logueado usando su correo electrónico (o userId si tu DTO lo tiene)
        // Nota: Ajusta 'u.email' por cómo se llame exactamente la propiedad en tu UserSummaryDTO (ej: u.correo o u.email)
        const currentUserData = allUsers.find(
          (u: any) => u.email === loggedEmail,
        );

        if (currentUserData) {
          // Si lo encuentra, usamos su NOMBRE REAL de la Base de Datos
          const realName = currentUserData.fullName;
          setUser({
            displayName: realName,
            role: mainRole,
            initial: realName.charAt(0).toUpperCase(),
          });
        } else {
          // Parche de emergencia si por alguna razón el usuario no aparece en la lista global
          const backupName = loggedEmail.split("@")[0].replace(".", " ");
          setUser({
            displayName: backupName,
            role: mainRole,
            initial: backupName.charAt(0).toUpperCase(),
          });
        }
      } catch (error) {
        console.error("Error cargando datos reales en la Navbar:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadNavbarData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "#3b82f6" : "#ffffff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: isActive ? "bold" : "normal",
    padding: "8px 12px",
    borderRadius: "4px",
    backgroundColor: isActive ? "rgba(59, 130, 246, 0.15)" : "transparent",
    transition: "all 0.3s ease",
  });

  // Si está cargando la petición a la API, mostramos una Navbar neutra provisional
  if (loading) {
    return (
      <nav
        style={{
          backgroundColor: "#1e293b",
          padding: "0 20px",
          height: "65px",
          display: "flex",
          alignItems: "center",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        Cargando perfil...
      </nav>
    );
  }

  if (!user) {
    return (
      <nav
        style={{
          backgroundColor: "#1e293b",
          padding: "15px 20px",
          color: "white",
          fontFamily: "Arial",
        }}
      >
        🔒 Portal Escolar Seguro
      </nav>
    );
  }

  const getRoleColor = (role: string) => {
    if (role === "ROLE_ADMIN") return "#ef4444";
    if (role === "ROLE_TEACHER") return "#f59e0b";
    return "#10b981";
  };

  return (
    <nav
      style={{
        backgroundColor: "#1e293b",
        padding: "0 20px",
        height: "65px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ color: "#ffffff", fontSize: "16px", fontWeight: "bold" }}>
        🏫 Colegio Intranet
      </div>

      <ul
        style={{
          display: "flex",
          listStyle: "none",
          gap: "8px",
          margin: 0,
          padding: 0,
        }}
      >
        {user.role === "ROLE_ADMIN" && (
          <li>
            <NavLink to="/registrar-usuarios" style={linkStyle}>
              👥 Registrar Usuarios
            </NavLink>
          </li>
        )}
        {user.role === "ROLE_TEACHER" && (
          <>
            <li>
              <NavLink to="/asistencia" style={linkStyle}>
                📋 Control Asistencia
              </NavLink>
            </li>
            <li>
              <NavLink to="/notas" style={linkStyle}>
                📝 Gestionar Notas
              </NavLink>
            </li>
          </>
        )}
        {user.role === "ROLE_STUDENT" && (
          <li>
            <NavLink to="/dashboard-estudiante" style={linkStyle}>
              📊 Mis Notas y Asistencia
            </NavLink>
          </li>
        )}
      </ul>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* 👤 FOTO DE PERFIL CON LA INICIAL DEL NOMBRE REAL */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: getRoleColor(user.role),
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              border: "2px solid #fff",
            }}
          >
            {user.initial}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* 🎯 ¡NOMBRE REAL IMPRESO DE LA BD! */}
            <span
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "bold",
                lineHeight: "1.2",
              }}
            >
              {user.displayName}
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "#94a3b8",
                marginTop: "2px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              ✨ {user.role.replace("ROLE_", "")}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent",
            color: "#f1f5f9",
            border: "1px solid #475569",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#273549")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          🚪 Salir
        </button>
      </div>
    </nav>
  );
};
