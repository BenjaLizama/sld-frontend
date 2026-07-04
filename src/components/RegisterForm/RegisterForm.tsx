import { ChangeEvent, FormEvent, useMemo, useState, useEffect } from "react";
import { register } from "../../services/auth.service";
import { RegisterRequest } from "../../services/dto/registerRequest.dto";
import { crearParentesco } from "../../services/family.service";
import { listaUsuarios } from "../../services/user.service";
import { UserSummaryDTO } from "../../services/dto/userSummary.dto";

type FormState = {
  email: string;
  password: string;
  role: NonNullable<RegisterRequest["auth"]["role"]>;
  deviceId: string;
  deviceName: string;
  educationLevel: string;
  isSupporter: boolean;
  medicConditions: string;
  biography: string;
  office: string;
  availabilityHours: string;
  academicGrade: string;
  rut: string;
  firstName: string;
  middleName: string;
  lastName: string;
  secondLastname: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  nationality: string;
  genderId: number;
};

const initialState: FormState = {
  email: "",
  password: "",
  role: "STUDENT",
  deviceId: "web-browser",
  deviceName: "Frontend SLD",
  educationLevel: "",
  isSupporter: false,
  medicConditions: "",
  biography: "",
  office: "",
  availabilityHours: "",
  academicGrade: "",
  rut: "",
  firstName: "",
  middleName: "",
  lastName: "",
  secondLastname: "",
  phoneNumber: "",
  address: "",
  birthday: "",
  nationality: "",
  genderId: 1,
};

const roles: Array<FormState["role"]> = ["STUDENT", "TEACHER", "PARENT"];
const educationLevels = [
  "Prebasica",
  "Basica",
  "Media",
  "Tecnico profesional",
  "Superior",
];

const RequiredStar = () => (
  <span style={{ color: "#ef4444", marginLeft: "4px", fontWeight: "bold" }}>
    *
  </span>
);

const formatRut = (value: string): string => {
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length <= 1) return clean;
  const dv = clean.slice(-1);
  let cuerpo = clean.slice(0, -1);
  let cuerpoFormateado = "";
  while (cuerpo.length > 3) {
    cuerpoFormateado = "." + cuerpo.slice(-3) + cuerpoFormateado;
    cuerpo = cuerpo.slice(0, -3);
  }
  cuerpoFormateado = cuerpo + cuerpoFormateado;
  return `${cuerpoFormateado}-${dv}`;
};

export function RegisterForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  // Estados para Vinculación Familiar
  const [parentRut, setParentRut] = useState("");
  const [studentRut, setStudentRut] = useState("");
  const [parentTypeId, setParentTypeId] = useState(1);
  const [linkLoading, setLinkLoading] = useState(false);

  // Estados para la Lista de Usuarios
  const [usuarios, setUsuarios] = useState<UserSummaryDTO[]>([]);
  const [filtroRol, setFiltroRol] = useState<
    "TODOS" | "STUDENT" | "PARENT" | "TEACHER"
  >("TODOS");

  // Cargar usuarios al montar
  const cargarUsuarios = async () => {
    try {
      const data = await listaUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error("Error al cargar usuarios de la BD", err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const validacionesPassword = useMemo(() => {
    const p = form.password;
    return {
      minMin_8: p.length >= 8,
      tieneNumero: /[0-9]/.test(p),
      tieneMayuscula: /[A-Z]/.test(p),
      tieneMinuscula: /[a-z]/.test(p),
      // Mapea los caracteres especiales exactos de tu backend (@, #, $, %, ^, &, +, =, !, y el punto .)
      tieneEspecial: /[@#$%^&+=!\.]/.test(p),
    };
  }, [form.password]);

  const passwordEsValida = useMemo(() => {
    return Object.values(validacionesPassword).every(Boolean);
  }, [validacionesPassword]);

  const payload = useMemo<RegisterRequest>(() => {
    let profile;
    switch (form.role) {
      case "PARENT":
        profile = {
          educationLevel: form.educationLevel,
          isSupporter: form.isSupporter,
        };
        break;
      case "STUDENT":
        profile = { medicConditions: form.medicConditions };
        break;
      case "TEACHER":
        profile = {
          biography: form.biography,
          office: form.office,
          availabilityHours: form.availabilityHours,
          academicGrade: form.academicGrade,
        };
        break;
    }
    return {
      auth: { email: form.email, password: form.password, role: form.role },
      session: { deviceId: form.deviceId, deviceName: form.deviceName },
      profile,
      personal: {
        rut: form.rut,
        firstName: form.firstName,
        middleName: form.middleName || undefined,
        lastName: form.lastName,
        secondLastname: form.secondLastname || undefined,
        phoneNumber: form.phoneNumber ? `+569${form.phoneNumber}` : "",
        address: form.address,
        birthday: form.birthday,
        nationality: form.nationality,
        genderId: Number(form.genderId),
      },
    };
  }, [form]);

  const updateField =
    (field: keyof FormState) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      let value: any = event.target.value;
      if (
        event.target instanceof HTMLInputElement &&
        event.target.type === "checkbox"
      ) {
        value = event.target.checked;
      }
      if (field === "rut") value = formatRut(value);
      if (field === "phoneNumber") value = value.replace(/\D/g, "").slice(0, 8);

      setForm((current) => ({ ...current, [field]: value }));
    };

  const handleLinkFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentRut || !studentRut) {
      alert("Por favor ingrese ambos RUTs.");
      return;
    }
    try {
      setLinkLoading(true);
      await crearParentesco({
        parentId: parentRut,
        studentId: studentRut,
        parentTypeId: Number(parentTypeId),
      });
      alert("✨ Vinculación familiar creada exitosamente.");
      setParentRut("");
      setStudentRut("");
    } catch (error: any) {
      alert(error.message || "Error al vincular el parentesco.");
    } finally {
      setLinkLoading(false);
    }
  };

  const submitRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.phoneNumber.length < 8) {
      alert(
        "El número de teléfono debe tener exactamente 8 dígitos (después del +569).",
      );
      return;
    }
    setStatus("loading");
    setMessage("Registrando usuario...");
    try {
      await register(payload);
      setStatus("success");
      setMessage("Usuario registrado correctamente.");
      setForm(initialState);
      cargarUsuarios(); // Recargar lista al crear nuevo
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo completar el registro.";
      setStatus("error");
      setMessage(errorMessage);
      alert(errorMessage);
    }
  };

  // Filtrado reactivo de usuarios según la pestaña seleccionada
  const usuariosFiltrados = useMemo(() => {
    if (filtroRol === "TODOS") return usuarios;
    return usuarios.filter((u) => u.role === filtroRol);
  }, [usuarios, filtroRol]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "20px",
      }}
    >
      {/* SECCIÓN 1: Formulario Registro de Usuario */}
      <section className="register-panel" aria-labelledby="register-title">
        <div className="panel-heading">
          <span className="icon">RG</span>
          <div>
            <h2 id="register-title">Registro de usuario</h2>
            <p>Completa los datos requeridos por registroRequest.</p>
          </div>
        </div>
        <form className="register-form" onSubmit={submitRegister}>
          <fieldset>
            <legend>Cuenta</legend>
            <div className="form-section">
              <label>
                Correo <RequiredStar />
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  placeholder="usuario@colegio.cl"
                  autoComplete="email"
                  required
                />
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  position: "relative",
                }}
              >
                Contraseña <RequiredStar />
                <input
                  type="password"
                  value={form.password}
                  onChange={updateField("password")}
                  placeholder=".123Contrasena#"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  style={{
                    borderColor: form.password
                      ? passwordEsValida
                        ? "#10b981"
                        : "#ef4444"
                      : "#ccc",
                    transition: "border-color 0.2s",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                {/* 🔍 Aparece solo si hay texto Y la contraseña aún NO es válida */}
                {form.password && !passwordEsValida && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      zIndex: 50,
                      marginTop: "4px",
                      width: "100%",
                      minWidth: "260px",
                      padding: "12px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#475569",
                        marginBottom: "2px",
                      }}
                    >
                      Requisitos de seguridad obligatorios:
                    </span>
                    <span
                      style={{
                        color: validacionesPassword.minMin_8
                          ? "#10b981"
                          : "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {validacionesPassword.minMin_8 ? "✓" : "✗"} Al menos 8
                      caracteres (Llevas {form.password.length})
                    </span>
                    <span
                      style={{
                        color: validacionesPassword.tieneMayuscula
                          ? "#10b981"
                          : "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {validacionesPassword.tieneMayuscula ? "✓" : "✗"} Una
                      letra mayúscula (A-Z)
                    </span>
                    <span
                      style={{
                        color: validacionesPassword.tieneMinuscula
                          ? "#10b981"
                          : "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {validacionesPassword.tieneMinuscula ? "✓" : "✗"} Una
                      letra minúscula (a-z)
                    </span>
                    <span
                      style={{
                        color: validacionesPassword.tieneNumero
                          ? "#10b981"
                          : "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {validacionesPassword.tieneNumero ? "✓" : "✗"} Al menos un
                      número (0-9)
                    </span>
                    <span
                      style={{
                        color: validacionesPassword.tieneEspecial
                          ? "#10b981"
                          : "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {validacionesPassword.tieneEspecial ? "✓" : "✗"} Un
                      carácter especial (@, #, $, %, ^, &, +, =, !, .)
                    </span>
                  </div>
                )}
              </label>
              <label>
                Rol <RequiredStar />
                <select
                  value={form.role}
                  onChange={updateField("role")}
                  required
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Perfil</legend>
            <div className="form-section">
              {form.role === "PARENT" && (
                <>
                  <label>
                    Nivel educacional <RequiredStar />
                    <select
                      value={form.educationLevel}
                      onChange={updateField("educationLevel")}
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      {educationLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="checkbox-field">
                    <input
                      type="checkbox"
                      checked={form.isSupporter}
                      onChange={updateField("isSupporter")}
                    />
                    Es apoderado
                  </label>
                </>
              )}
              {form.role === "STUDENT" && (
                <label>
                  Condiciones médicas
                  <textarea
                    value={form.medicConditions}
                    onChange={updateField("medicConditions")}
                    placeholder="Asma, allergies, etc."
                  />
                </label>
              )}
              {form.role === "TEACHER" && (
                <>
                  <label>
                    Biografía
                    <textarea
                      value={form.biography}
                      onChange={updateField("biography")}
                    />
                  </label>
                  <label>
                    Oficina
                    <input
                      type="text"
                      value={form.office}
                      onChange={updateField("office")}
                    />
                  </label>
                  <label>
                    Horario de atención
                    <input
                      type="text"
                      value={form.availabilityHours}
                      onChange={updateField("availabilityHours")}
                    />
                  </label>
                  <label>
                    Grado académico
                    <input
                      type="text"
                      value={form.academicGrade}
                      onChange={updateField("academicGrade")}
                    />
                  </label>
                </>
              )}
            </div>
          </fieldset>

          <fieldset>
            <legend>Datos personales</legend>
            <div className="form-section personal-grid">
              <label>
                RUT <RequiredStar />
                <input
                  type="text"
                  value={form.rut}
                  onChange={updateField("rut")}
                  placeholder="12.345.678-9"
                  maxLength={12}
                  required
                />
              </label>
              <label>
                Primer nombre <RequiredStar />
                <input
                  type="text"
                  value={form.firstName}
                  onChange={updateField("firstName")}
                  placeholder="Benjamin"
                  autoComplete="given-name"
                  required
                />
              </label>
              <label>
                Segundo nombre
                <input
                  type="text"
                  value={form.middleName}
                  onChange={updateField("middleName")}
                  placeholder="Rodrigo"
                  autoComplete="additional-name"
                />
              </label>
              <label>
                Primer apellido <RequiredStar />
                <input
                  type="text"
                  value={form.lastName}
                  onChange={updateField("lastName")}
                  placeholder="Lizama"
                  autoComplete="family-name"
                  required
                />
              </label>
              <label>
                Segundo apellido
                <input
                  type="text"
                  value={form.secondLastname}
                  onChange={updateField("secondLastname")}
                  placeholder="Cespedes"
                />
              </label>
              <label>
                Teléfono <RequiredStar />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      backgroundColor: "#e2e8f0",
                      padding: "8px 12px",
                      border: "1px solid #ccc",
                      borderRight: "none",
                      borderRadius: "4px 0 0 4px",
                      fontSize: "14px",
                      color: "#4a5568",
                      fontWeight: "500",
                      userSelect: "none",
                    }}
                  >
                    +56 9
                  </span>
                  <input
                    type="text"
                    value={form.phoneNumber}
                    onChange={updateField("phoneNumber")}
                    placeholder="27452872"
                    autoComplete="tel"
                    required
                    style={{ borderRadius: "0 4px 4px 0", flex: 1 }}
                  />
                </div>
              </label>
              <label>
                Dirección <RequiredStar />
                <input
                  type="text"
                  value={form.address}
                  onChange={updateField("address")}
                  placeholder="Alejandro Villalobos 241"
                  autoComplete="street-address"
                  required
                />
              </label>
              <label>
                Fecha de nacimiento <RequiredStar />
                <input
                  type="date"
                  value={form.birthday}
                  onChange={updateField("birthday")}
                  required
                />
              </label>
              <label>
                Nacionalidad <RequiredStar />
                <select
                  value={form.nationality}
                  onChange={updateField("nationality")}
                  required
                >
                  <option value="">Selecciona nacionalidad</option>
                  <option value="Chilena">Chilena</option>
                  <option value="Extranjera">Extranjera</option>
                </select>
              </label>
              <label>
                Género <RequiredStar />
                <select
                  value={form.genderId}
                  onChange={updateField("genderId")}
                  required
                >
                  <option value="1">Masculino</option>
                  <option value="2">Femenino</option>
                </select>
              </label>
            </div>
          </fieldset>

          <div className="form-actions">
            <button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Registrando..." : "Registrar usuario"}
            </button>
            {message ? (
              <p className={`form-message ${status}`} role="status">
                {message}
              </p>
            ) : null}
          </div>
        </form>
      </section>

      {/* SECCIÓN 2: Asignación de Parentescos */}
      <section className="register-panel">
        <div className="panel-heading" style={{ borderColor: "#3b82f6" }}>
          <span className="icon" style={{ backgroundColor: "#3b82f6" }}>
            🔗
          </span>
          <div>
            <h2>Asignación de Parentescos</h2>
            <p>
              Vincula un Apoderado existente con su respectivo Estudiante usando
              sus RUTs.
            </p>
          </div>
        </div>
        <form className="register-form" onSubmit={handleLinkFamily}>
          <fieldset>
            <legend>Enlace Familiar</legend>
            <div className="form-section personal-grid">
              <label>
                RUT Apoderado <RequiredStar />
                <input
                  type="text"
                  value={parentRut}
                  onChange={(e) => setParentRut(formatRut(e.target.value))}
                  placeholder="12.345.678-9"
                  maxLength={12}
                  required
                />
              </label>
              <label>
                RUT Estudiante <RequiredStar />
                <input
                  type="text"
                  value={studentRut}
                  onChange={(e) => setStudentRut(formatRut(e.target.value))}
                  placeholder="23.456.789-K"
                  maxLength={12}
                  required
                />
              </label>
              <label>
                Vínculo / Relación <RequiredStar />
                <select
                  value={parentTypeId}
                  onChange={(e) => setParentTypeId(Number(e.target.value))}
                  required
                >
                  <option value="1">Madre</option>
                  <option value="2">Padre</option>
                  <option value="3">Abuelo/a</option>
                  <option value="4">Tío/a</option>
                  <option value="5">Hermano/a Mayor</option>
                  <option value="6">Tutor Legal</option>
                </select>
              </label>
            </div>
          </fieldset>
          <div className="form-actions">
            <button
              type="submit"
              style={{ backgroundColor: "#3b82f6" }}
              disabled={linkLoading}
            >
              {linkLoading ? "Vinculando..." : "Establecer Parentesco"}
            </button>
          </div>
        </form>
      </section>

      {/* SECCIÓN 3: Listado de Usuarios Separado por Categorías */}
      <section className="register-panel" style={{ marginTop: "10px" }}>
        <div className="panel-heading" style={{ borderColor: "#10b981" }}>
          <span className="icon" style={{ backgroundColor: "#10b981" }}>
            📋
          </span>
          <div>
            <h2>Listado General de Usuarios</h2>
            <p>Visualiza y administra las cuentas creadas en el ecosistema.</p>
          </div>
        </div>

        {/* Barra de Pestañas / Filtros Dinámicos */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            margin: "15px 0",
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "10px",
          }}
        >
          {(["TODOS", "STUDENT", "PARENT", "TEACHER"] as const).map((rol) => (
            <button
              key={rol}
              type="button"
              onClick={() => setFiltroRol(rol)}
              style={{
                padding: "8px 16px",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                backgroundColor: filtroRol === rol ? "#10b981" : "#edf2f7",
                color: filtroRol === rol ? "#fff" : "#4a5568",
                transition: "all 0.2s",
              }}
            >
              {rol === "TODOS"
                ? "🌍 Todos"
                : rol === "STUDENT"
                  ? "🎓 Estudiantes"
                  : rol === "PARENT"
                    ? "👪 Apoderados"
                    : "💼 Profesores"}
            </button>
          ))}
        </div>

        {/* Tabla renderizada de Usuarios */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f7fafc",
                  textAlign: "left",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <th style={{ padding: "12px" }}>Nombre Completo</th>
                <th style={{ padding: "12px" }}>RUT</th>
                <th style={{ padding: "12px" }}>Correo</th>
                <th style={{ padding: "12px" }}>Rol Sistema</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#a0aec0",
                    }}
                  >
                    No hay usuarios registrados en esta categoría.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u, index) => (
                  <tr
                    key={u.rut || index}
                    style={{
                      borderBottom: "1px solid #edf2f7",
                      hover: { backgroundColor: "#f8fafc" },
                    }}
                  >
                    <td style={{ padding: "12px", fontWeight: "500" }}>
                      {u.fullName}
                    </td>
                    <td style={{ padding: "12px", fontFamily: "monospace" }}>
                      {u.rut}
                    </td>
                    <td style={{ padding: "12px" }}>{u.email}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor:
                            u.role === "STUDENT"
                              ? "#e9d5ff"
                              : u.role === "PARENT"
                                ? "#fef3c7"
                                : "#bbf7d0",
                          color:
                            u.role === "STUDENT"
                              ? "#6b21a8"
                              : u.role === "PARENT"
                                ? "#92400e"
                                : "#166534",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
