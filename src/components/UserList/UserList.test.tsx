import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { UserList } from "./UserList";
import * as userService from "../../services/user.service";

// Mock del servicio de usuarios
jest.mock("../../services/user.service");
const mockedListaUsuarios = userService.listaUsuarios as jest.Mock;

const mockUsers = [
  {
    fullName: "Juan Perez",
    email: "juan@test.com",
    rut: "12.345.678-9",
    gender: "Masculino",
    phoneNumber: "987654321",
    address: "Calle Falsa 123",
    birthday: "1990-01-01T00:00:00.000Z",
    nationality: "Chilena",
    creationDate: "2023-01-01T10:00:00.000Z",
  },
];

describe("Componente UserList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza el título y la tabla correctamente", async () => {
    mockedListaUsuarios.mockResolvedValue(mockUsers);
    render(<UserList />);

    expect(screen.getByText(/usuarios registrados/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText("Juan Perez")).toBeInTheDocument();
      expect(screen.getByText("juan@test.com")).toBeInTheDocument();
      expect(screen.getByText("12.345.678-9")).toBeInTheDocument();
    });
  });

  test("maneja errores al cargar usuarios", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockedListaUsuarios.mockRejectedValue(new Error("Error al cargar"));
    
    render(<UserList />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
});