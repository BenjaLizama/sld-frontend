import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth.service";
import { jwtDecode } from "jwt-decode";
import { LoginRequest } from "../../services/dto/loginRequest.dto";

interface CustomJwtPayload {
  roles: string[];
  userId: string;
  sub: string;
}

interface AuthCardProps {
  onLoginSuccess: () => void;
}

export function AuthCard({ onLoginSuccess }: AuthCardProps) {
  // 🚀 Mantenemos tus estados originales adentro del componente
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor, rellena todos los campos.");
      return;
    }

    try {
      setLoading(true);

      // Cumplimos con el DTO LoginRequest esperado por tu BFF
      const loginPayload: LoginRequest = {
        login: {
          identifier: email,
          password: password,
          provider: "LOCAL",
        },
        session: {
          deviceId: "browser-session-id",
          deviceName: "Navegador Web",
        },
      };

      const response = await login(loginPayload);

      if (response.accessToken) {
        // Guardamos el token en el almacenamiento local
        localStorage.setItem("token", response.accessToken);

        onLoginSuccess();

        // Decodificamos el JWT para saber a dónde redirigir al usuario
        const decoded = jwtDecode<CustomJwtPayload>(response.accessToken);
        const roles = decoded.roles;

        alert(`¡Bienvenido/a, ${decoded.sub}!`);

        // Redirección automatizada e inteligente según el Rol
        if (roles.includes("ROLE_ADMIN")) {
          navigate("/registrar-usuarios");
        } else if (roles.includes("ROLE_TEACHER")) {
          navigate("/asistencia");
        } else if (roles.includes("ROLE_STUDENT")) {
          navigate("/dashboard-estudiante");
        } else if (roles.includes("ROLE_PARENT")) {
          navigate("/dashboard-apoderado");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error(error);
      alert("Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="panel"
      style={{ maxWidth: "450px", margin: "60px auto" }}
    >
      <div className="panel-heading">
        <span className="icon">ID</span>
        <div>
          <h2>Acceso seguro</h2>
          <p>Formulario de autenticación para la comunidad escolar.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleLogin}>
        <label>
          Correo
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="usuario@colegio.cl"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </form>
    </section>
  );
}
