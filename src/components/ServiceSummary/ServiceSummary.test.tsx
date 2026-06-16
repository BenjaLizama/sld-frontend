import { render, screen, within } from "@testing-library/react";
import { ServiceSummary } from "./ServiceSummary";

describe("Componente ServiceSummary", () => {
  test("renderiza el título y la descripción principal", () => {
    render(<ServiceSummary />);

    const heading = screen.getByRole("heading", {
      name: /servicios backend/i,
      level: 2,
    });
    expect(heading).toBeInTheDocument();

    const description = screen.getByText(
      /vista resumida de los componentes dockerizados/i,
    );
    expect(description).toBeInTheDocument();
  });

  test("renderiza la cantidad correcta de servicios", () => {
    const { container } = render(<ServiceSummary />);

    const serviceRows = container.querySelectorAll(".service-row");

    expect(serviceRows).toHaveLength(3);
  });

  test("muestra la información correcta para cada servicio en la lista", () => {
    render(<ServiceSummary />);

    expect(screen.getByText("BFF")).toBeInTheDocument();
    expect(screen.getByText("Auth")).toBeInTheDocument();
    expect(screen.getByText("Usuarios")).toBeInTheDocument();

    expect(screen.getByText("Orquesta registro y perfil")).toBeInTheDocument();
    expect(screen.getByText("JWT, roles y sesiones")).toBeInTheDocument();
    expect(screen.getByText("Datos personales y perfiles")).toBeInTheDocument();

    expect(screen.getByText(":8082")).toBeInTheDocument();
    expect(screen.getByText(":8081")).toBeInTheDocument();
    expect(screen.getByText(":8083")).toBeInTheDocument();
  });

  test("agrupa correctamente el nombre, descripción y puerto por cada artículo", () => {
    const { container } = render(<ServiceSummary />);
    const serviceRows = container.querySelectorAll(".service-row");

    const firstService = serviceRows[0] as HTMLElement;

    expect(within(firstService).getByText("BFF")).toBeInTheDocument();
    expect(
      within(firstService).getByText("Orquesta registro y perfil"),
    ).toBeInTheDocument();
    expect(within(firstService).getByText(":8082")).toBeInTheDocument();
  });
});
