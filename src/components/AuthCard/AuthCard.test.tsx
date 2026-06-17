import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthCard } from "./AuthCard";
import * as authService from "../../services/auth.service";

// Mock del servicio de autenticación
jest.mock("../../services/auth.service");
const mockedLogin = authService.login as jest.Mock;

describe("Componente AuthCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock de window.alert
    window.alert = jest.fn();
    
    // Mock exitoso por defecto
    mockedLogin.mockResolvedValue({
      accessToken: "fake-token",
      refreshToken: "fake-refresh-token"
    });
  });

  test("renderiza el encabezado y la descripción correctamente", () => {
    render(<AuthCard onLogin={() => {}} />);

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
    render(<AuthCard onLogin={() => {}} />);

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
    render(<AuthCard onLogin={() => {}} />);

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesion/i,
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "button");
  });

  test("notifica un usuario estudiante por defecto al iniciar sesión", async () => {
    const onLogin = jest.fn();
    render(<AuthCard onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: " alumno@colegio.cl " },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesion/i }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({
        firstName: "Benjamin",
        lastName: "Lizama",
        role: "STUDENT",
      });
    });
  });

  test("detecta correos de docentes sin depender de mayúsculas o espacios", async () => {
    const onLogin = jest.fn();
    render(<AuthCard onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: " DOCENTE.historia@colegio.cl " },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesion/i }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({
        firstName: "Matias",
        lastName: "Herrera",
        role: "TEACHER",
      });
    });
  });

  test("detecta correos de apoderados", async () => {
    const onLogin = jest.fn();
    render(<AuthCard onLogin={onLogin} />);

    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "apoderado.valido@colegio.cl" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesion/i }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({
        firstName: "Carolina",
        lastName: "Munoz",
        role: "PARENT",
      });
    });
  });

  test("permite iniciar sesión aunque no se entregue callback", async () => {
    // @ts-ignore - probando caso sin prop requerida según tipos pero permitida por JS
    render(<AuthCard />);

    fireEvent.click(screen.getByRole("button", { name: /iniciar sesion/i }));
    
    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalled();
    });
  });
});
