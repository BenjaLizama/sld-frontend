type Metric = {
  label: string;
  value: string;
};

const metrics: Metric[] = [
  { value: "92%", label: "Asistencia" },
  { value: "6.4", label: "Promedio" },
  { value: "3", label: "Mensajes" },
];

export function StudentWidget() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <span className="icon">CL</span>
        <div>
          <h2>Resumen academico</h2>
          <p>
            Componente visual no conectado, preparado para integracion futura.
          </p>
        </div>
      </div>

      <div className="metrics">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
