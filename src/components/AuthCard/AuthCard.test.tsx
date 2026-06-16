import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { AuthCard } from "./AuthCard";

describe("Componente AuthCard", () => {
  test("renderiza el encabezado y la descripción correctamente", () => {
    render(<AuthCard />);

    const heading = screen.getByRole("heading", {
      name: /acceso seguro/i,
      level: 2,
    });
    expect(heading).toBeInTheDocument();

    const description = screen.getByText(
      /formulario de autenticacion para la comunidad escolar/i,
    );
    expect(description).toBeInTheDocument();
  });

  test("renderiza los campos de email y contraseña con sus atributos correctos", () => {
    render(<AuthCard />);

    const emailInput = screen.getByLabelText(/correo/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("placeholder", "usuario@colegio.cl");

    const passwordInput = screen.getByLabelText(/contrasena/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("placeholder", "••••••••");
  });

  test("renderiza el botón de iniciar sesión", () => {
    render(<AuthCard />);

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesion/i,
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "button");
  });
});
