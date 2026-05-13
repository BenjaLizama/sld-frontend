export function AuthCard() {
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
          <input type="email" placeholder="usuario@colegio.cl" autoComplete="email" />
        </label>
        <label>
          Contrasena
          <input type="password" placeholder="••••••••" autoComplete="current-password" />
        </label>
        <button type="button">Iniciar sesion</button>
      </form>
    </section>
  );
}
