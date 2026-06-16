import { REGISTRAR_USUARIO } from "./register";
import {
  REGISTRAR_USUARIO_INTERFACE,
  BffError,
} from "../types/registrarUsuario.type";

// Mock de datos para el usuario
const mockUsuario: REGISTRAR_USUARIO_INTERFACE = {
  auth: {
    email: "usuario@colegio.cl",
    password: "PasswordSegura123!",
    role: "STUDENT",
  },
  session: {
    deviceId: "uuid-dispositivo-1234",
    deviceName: "Chrome - Windows",
  },
  personal: {
    rut: "12345678-9",
    firstName: "Juan",
    lastName: "Pérez",
    phoneNumber: "+56912345678",
    address: "Avenida Siempreviva 742",
    birthday: "2005-08-15",
    nationality: "Chilena",
    genderId: 1,
  },
  profile: {
    educationLevel: "Media",
    isSupporter: false,
  },
};

// 1. Creamos nuestro mock directamente
const mockFetch = jest.fn();
// 2. Se lo asignamos a globalThis (estándar de navegador) engañando un poco a TypeScript
globalThis.fetch = mockFetch as unknown as typeof fetch;

describe("Servicio REGISTRAR_USUARIO", () => {
  beforeEach(() => {
    // 3. Ahora simplemente limpiamos nuestra variable
    mockFetch.mockClear();
  });

  test("1. Retorna los datos correctamente cuando la petición es exitosa (Status 200/201)", async () => {
    const mockRespuestaExitosa = { id: 1, mensaje: "Usuario creado con éxito" };

    // Usamos nuestra variable mockFetch en lugar de intentar leer el global
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRespuestaExitosa,
    } as unknown as Response);

    const resultado = await REGISTRAR_USUARIO(mockUsuario);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual(mockRespuestaExitosa);
  });

  test("2. Lanza un error estructurado si el BFF responde con error manejado", async () => {
    const mockErrorBff: Partial<BffError> = {
      status: 400,
      code: "ERR_VALIDATION",
      message: "El correo ya existe",
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorBff,
    } as unknown as Response);

    await expect(REGISTRAR_USUARIO(mockUsuario)).rejects.toEqual(mockErrorBff);
  });

  test("3. Lanza un error genérico si el BFF falla feo y no manda JSON", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => {
        throw new Error("Invalid JSON");
      },
    } as unknown as Response);

    try {
      await REGISTRAR_USUARIO(mockUsuario);
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.status).toBe(500);
      expect(error.code).toBe("ERR_UNKNOWN");
      expect(error.error).toBe("Internal Server Error");
      expect(error.message).toBe(
        "Ocurrió un problema al procesar la solicitud.",
      );
      expect(error.developerMessage).toBe(
        "El servidor devolvió un error, pero no en el formato estándar.",
      );
      expect(typeof error.timestamp).toBe("number");
    }
  });

  test("4. Lanza un error de red (503) si el servidor está caído o no hay internet", async () => {
    const mockMensajeRed = "Failed to fetch";

    mockFetch.mockRejectedValueOnce(new Error(mockMensajeRed));

    try {
      await REGISTRAR_USUARIO(mockUsuario);
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.status).toBe(503);
      expect(error.code).toBe("ERR_NETWORK");
      expect(error.error).toBe("Service Unavailable");
      expect(error.message).toBe("No se pudo conectar con el servidor.");
      expect(error.developerMessage).toBe(mockMensajeRed);
      expect(typeof error.timestamp).toBe("number");
    }
  });
});
