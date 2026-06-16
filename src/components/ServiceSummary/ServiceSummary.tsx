type ServiceItem = {
  name: string;
  description: string;
  port: number;
};

const services: ServiceItem[] = [
  { name: "BFF", description: "Orquesta registro y perfil", port: 8082 },
  { name: "Auth", description: "JWT, roles y sesiones", port: 8081 },
  { name: "Usuarios", description: "Datos personales y perfiles", port: 8083 },
];

export function ServiceSummary() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <span className="icon">API</span>
        <div>
          <h2>Servicios backend</h2>
          <p>Vista resumida de los componentes Dockerizados.</p>
        </div>
      </div>

      <div className="service-list">
        {services.map((service) => (
          <article className="service-row" key={service.name}>
            <strong>{service.name}</strong>
            <span>{service.description}</span>
            <code>:{service.port}</code>
          </article>
        ))}
      </div>
    </section>
  );
}
