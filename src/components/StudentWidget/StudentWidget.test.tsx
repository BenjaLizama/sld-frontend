import { render, screen } from "@testing-library/react";
import { StudentWidget } from "./StudentWidget";

describe("Componente StudentWidget", () => {
  test("renderiza el encabezado y la descripción principal", () => {
    render(<StudentWidget />);

    const heading = screen.getByRole("heading", {
      name: /resumen academico/i,
      level: 2,
    });
    expect(heading).toBeInTheDocument();

    const description = screen.getByText(
      /componente visual no conectado, preparado para integracion futura/i,
    );
    expect(description).toBeInTheDocument();
  });

  test("renderiza exactamente 3 métricas", () => {
    const { container } = render(<StudentWidget />);

    const metricsContainer = container.querySelector(".metrics");

    expect(metricsContainer?.children).toHaveLength(3);
  });

  test("muestra correctamente los valores y etiquetas de cada métrica", () => {
    render(<StudentWidget />);

    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("Asistencia")).toBeInTheDocument();

    expect(screen.getByText("6.4")).toBeInTheDocument();
    expect(screen.getByText("Promedio")).toBeInTheDocument();

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Mensajes")).toBeInTheDocument();
  });
});
