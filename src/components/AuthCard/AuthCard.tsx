import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AuthCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /* Si el usuario es un adminstrador deberia viajar hacia el dashboard de administrador. */
  const handleLogin = () => {
    alert("Se pulso iniciar sesion!");
    navigate("/admin");
    return;
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
