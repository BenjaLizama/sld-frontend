import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RegisterForm } from "./RegisterForm";
import * as authService from "../../services/auth.service";

// Mock del servicio de autenticación
jest.mock("../../services/auth.service");
const mockedRegister = authService.register as jest.Mock;

describe("Componente RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock exitoso por defecto
    mockedRegister.mockResolvedValue({
      accessToken: "fake-token",
      refreshToken: "fake-refresh-token"
    });
  });

  test("renderiza el título y los campos básicos correctamente", () => {
    render(<RegisterForm />);

    expect(screen.getByText(/registro de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contrasena/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rol/i)).toBeInTheDocument();
  });

  test("cambia los campos de perfil según el rol seleccionado (STUDENT)", () => {
    render(<RegisterForm />);
    
    // Por defecto es STUDENT
    expect(screen.getByLabelText(/condiciones médicas/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/nivel educacional/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/biografía/i)).not.toBeInTheDocument();
  });

  test("cambia los campos de perfil según el rol seleccionado (PARENT)", () => {
    render(<RegisterForm />);
    
    fireEvent.change(screen.getByLabelText(/rol/i), { target: { value: "PARENT" } });
    
    expect(screen.getByLabelText(/nivel educacional/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/es apoderado/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/condiciones médicas/i)).not.toBeInTheDocument();
  });

  test("cambia los campos de perfil según el rol seleccionado (TEACHER)", () => {
    render(<RegisterForm />);
    
    fireEvent.change(screen.getByLabelText(/rol/i), { target: { value: "TEACHER" } });
    
    expect(screen.getByLabelText(/biografía/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/oficina/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/condiciones médicas/i)).not.toBeInTheDocument();
  });

  test("envía el formulario correctamente", async () => {
    render(<RegisterForm />);

    // Llenar campos requeridos mínimos
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText(/contrasena/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/rut/i), { target: { value: "12.345.678-9" } });
    fireEvent.change(screen.getByLabelText(/primer nombre/i), { target: { value: "Juan" } });
    fireEvent.change(screen.getByLabelText(/primer apellido/i), { target: { value: "Perez" } });
    fireEvent.change(screen.getByLabelText(/telefono/i), { target: { value: "987654321" } });
    fireEvent.change(screen.getByLabelText(/direccion/i), { target: { value: "Calle Falsa 123" } });
    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText(/nacionalidad/i), { target: { value: "Chilena" } });

    fireEvent.click(screen.getByRole("button", { name: /registrar usuario/i }));

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalled();
      expect(screen.getByText(/usuario registrado correctamente/i)).toBeInTheDocument();
    });
  });

  test("muestra mensaje de error si el registro falla", async () => {
    mockedRegister.mockRejectedValue(new Error("Error de conexión"));
    render(<RegisterForm />);

    // Llenar campos requeridos mínimos
    fireEvent.change(screen.getByLabelText(/correo/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText(/contrasena/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/rut/i), { target: { value: "12.345.678-9" } });
    fireEvent.change(screen.getByLabelText(/primer nombre/i), { target: { value: "Juan" } });
    fireEvent.change(screen.getByLabelText(/primer apellido/i), { target: { value: "Perez" } });
    fireEvent.change(screen.getByLabelText(/telefono/i), { target: { value: "987654321" } });
    fireEvent.change(screen.getByLabelText(/direccion/i), { target: { value: "Calle Falsa 123" } });
    fireEvent.change(screen.getByLabelText(/fecha de nacimiento/i), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText(/nacionalidad/i), { target: { value: "Chilena" } });

    fireEvent.click(screen.getByRole("button", { name: /registrar usuario/i }));

    await waitFor(() => {
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument();
    });
  });
});