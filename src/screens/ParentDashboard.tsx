import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { obtenerResumenHijos, HijoResumen } from "../services/family.service";
import { listaUsuarios } from "../services/user.service";
import { UserSummaryDTO } from "../services/dto/userSummary.dto";

interface CustomJwtPayload {
  sub: string; // Tu backend guarda el email aquí (ej: apoderado1.valido@test.com)
  roles: string[];
}

export function ParentDashboard() {
  const [hijos, setHijos] = useState<HijoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarInformacionPupilos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No se encontró una sesión activa.");

        // 1. Extraemos el email del token
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const emailApoderado = decoded.sub;

        // 2. Traemos la lista completa de usuarios usando tu servicio
        const usuarios: UserSummaryDTO[] = await listaUsuarios();

        // 3. 🎯 Buscamos al usuario cuyo email coincida con el del token para extraer su RUT real
        const usuarioEncontrado = usuarios.find(
          (u) => u.email === emailApoderado,
        );

        if (!usuarioEncontrado) {
          throw new Error(
            `No se encontraron datos de perfil para el correo: ${emailApoderado}`,
          );
        }

        const rutReal = usuarioEncontrado.rut;
        console.log(
          `🚀 RUT recuperado con éxito para ${emailApoderado}: ${rutReal}`,
        );

        // 4. Enviamos el RUT correcto al BFF
        const data = await obtenerResumenHijos(rutReal);
        setHijos(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar el resumen de tus hijos.");
      } finally {
        setLoading(false);
      }
    };

    cargarInformacionPupilos();
  }, []);

  if (loading)
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Cargando información escolar...
      </div>
    );
  if (error)
    return <div style={{ padding: "40px", color: "#ef4444" }}>⚠️ {error}</div>;

  return (
    <section
      className="register-panel"
      style={{ maxWidth: "900px", margin: "20px auto" }}
    >
      <div className="panel-heading">
        <span className="icon" style={{ backgroundColor: "#10b981" }}>
          👪
        </span>
        <div>
          <h2>Seguimiento de Pupilos</h2>
          <p>
            Visualiza el estado académico y asistencia en tiempo real de tus
            estudiantes asociados.
          </p>
        </div>
      </div>

      {hijos.length === 0 ? (
        <div style={{ padding: "30px", textAlign: "center", color: "#64748b" }}>
          No registras estudiantes vinculados a tu RUT actualmente. Contacta al
          administrador escolar.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "25px", padding: "10px" }}>
          {hijos.map((hijo) => (
            <div
              key={hijo.rut}
              className="form-grid"
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "20px",
                background: "#f8fafc",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <h3
                    style={{ margin: 0, color: "#1e293b", fontSize: "1.3rem" }}
                  >
                    {hijo.fullName}
                  </h3>
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    RUT: {hijo.rut} • Relación:{" "}
                    <strong>{hijo.relationship}</strong>
                  </span>
                </div>
              </div>

              {/* Contenedor de Tarjetas de Rendimiento */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "15px",
                  flexWrap: "wrap",
                }}
              >
                {/* Tarjeta de Promedio */}
                <div
                  style={{
                    flex: "1",
                    minWidth: "150px",
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    📈 Promedio General
                  </span>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "2rem",
                      marginTop: "5px",
                      color:
                        hijo.promedioGeneral >= 4.0 ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {hijo.promedioGeneral.toFixed(1)}
                  </strong>
                </div>

                {/* Tarjeta de Asistencia */}
                <div
                  style={{
                    flex: "1",
                    minWidth: "150px",
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    📊 Asistencia
                  </span>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "2rem",
                      marginTop: "5px",
                      color:
                        hijo.porcentajeAsistencia >= 85 ? "#1d4ed8" : "#d97706",
                    }}
                  >
                    {hijo.porcentajeAsistencia}%
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
