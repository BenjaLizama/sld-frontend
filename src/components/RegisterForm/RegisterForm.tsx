import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { register } from "../../services/auth.service";
import { RegisterRequest } from "../../services/dto/registerRequest.dto";

type FormState = {
  // auth
  email: string;
  password: string;
  role: NonNullable<RegisterRequest["auth"]["role"]>;
  // session
  deviceId: string;
  deviceName: string;
  // parent profile
  educationLevel: string;
  isSupporter: boolean;
  // student profile
  medicConditions: string;
  // teacher profile
  biography: string;
  office: string;
  availabilityHours: string;
  academicGrade: string;
  // personal
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

export function RegisterForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

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
        profile = {
          medicConditions: form.medicConditions,
        };
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
      auth: {
        email: form.email,
        password: form.password,
        role: form.role,
      },

      session: {
        deviceId: form.deviceId,
        deviceName: form.deviceName,
      },

      profile,

      personal: {
        rut: form.rut,
        firstName: form.firstName,
        middleName: form.middleName || undefined,
        lastName: form.lastName,
        secondLastname: form.secondLastname || undefined,
        phoneNumber: form.phoneNumber,
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
      const value =
        event.target instanceof HTMLInputElement &&
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;

      setForm((current) => ({
        ...current,
        [field]: value,
      }));
    };
  const submitRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("loading");
    setMessage("Registrando usuario...");

    try {
      await register(payload);

      setStatus("success");
      setMessage("Usuario registrado correctamente.");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo completar el registro.";

      setStatus("error");
      setMessage(errorMessage);
    }
  };

  return (
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
              Correo
              <input
                type="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="usuario@colegio.cl"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Contrasena
              <input
                type="password"
                value={form.password}
                onChange={updateField("password")}
                placeholder=".123Contrasena#"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>

            <label>
              Rol
              <select value={form.role} onChange={updateField("role")} required>
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
          <legend>Sesion</legend>
          <div className="form-section">
            <label>
              Device ID
              <input
                type="text"
                value={form.deviceId}
                onChange={updateField("deviceId")}
                placeholder="web-browser"
                required
              />
            </label>

            <label>
              Device name
              <input
                type="text"
                value={form.deviceName}
                onChange={updateField("deviceName")}
                placeholder="Frontend SLD"
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Perfil</legend>
          <div className="form-section">
            {form.role === "PARENT" && (
              <>
                <label>
                  Nivel educacional
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
                  placeholder="Asma, alergias, etc."
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
              RUT
              <input
                type="text"
                value={form.rut}
                onChange={updateField("rut")}
                placeholder="12.345.678-9"
                required
              />
            </label>

            <label>
              Primer nombre
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
              Primer apellido
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
              Telefono
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={updateField("phoneNumber")}
                placeholder="927452872"
                autoComplete="tel"
                required
              />
            </label>

            <label>
              Direccion
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
              Fecha de nacimiento
              <input
                type="date"
                value={form.birthday}
                onChange={updateField("birthday")}
                required
              />
            </label>

            <label>
              Nacionalidad
              <input
                type="text"
                value={form.nationality}
                onChange={updateField("nationality")}
                placeholder="Chile"
                required
              />
            </label>

            <label>
              Genero
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
  );
}
