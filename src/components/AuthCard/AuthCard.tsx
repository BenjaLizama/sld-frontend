import { useState } from "react";
import { login } from "../../services/auth.service";
export type LoggedUser = {
  firstName: string;
  lastName: string;
  role: "STUDENT" | "TEACHER" | "PARENT";
};

type AuthCardProps = {
  onLogin: (user: LoggedUser) => void;
};

const resolveUserByEmail = (email: string): LoggedUser => {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.includes("docente")) {
    return { firstName: "Matias", lastName: "Herrera", role: "TEACHER" };
  }

  if (normalizedEmail.includes("apoderado")) {
    return { firstName: "Carolina", lastName: "Munoz", role: "PARENT" };
  }

  return { firstName: "Benjamin", lastName: "Lizama", role: "STUDENT" };
};

export function AuthCard({ onLogin }: AuthCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await login({
        login: {
          identifier: email,
          password,
          provider: "LOCAL",
        },

        session: {
          deviceId: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : 'test-device-id',
          deviceName: "WEB BROWSER",
        },
      });

      localStorage.setItem("accessToken", response.accessToken);

      localStorage.setItem("refreshToken", response.refreshToken);

      console.log("Login OK");

      if (onLogin) {
        onLogin(resolveUserByEmail(email));
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Credenciales incorrectas";
      alert(errorMessage);
    }
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <span className="icon">ID</span>
        <div>
          <h2>Acceso seguro</h2>
          <p>Formulario de autenticacion para la comunidad escolar.</p>
        </div>
      </div>

      <form className="form-grid">
        <label>
          Correo
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="usuario@colegio.cl"
            autoComplete="email"
          />
        </label>
        <label>
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>
        <button type="button" onClick={handleLogin}>
          Iniciar sesion
        </button>
      </form>
    </section>
  );
}
