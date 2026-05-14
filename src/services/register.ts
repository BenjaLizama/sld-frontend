import { REGISTRAR_USUARIO_INTERFACE } from "../types/registrarUsuario.type";
import { BffError } from "../types/registrarUsuario.type";

const BFF_URL = "/api/v1/registro";

export const REGISTRAR_USUARIO = async (
  nuevoUsuario: REGISTRAR_USUARIO_INTERFACE,
) => {
  try {
    const respuesta = await fetch(`${BFF_URL}/registrar-usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoUsuario),
    });

    // 2. Si la respuesta trae un código de error (400, 401, 500, etc.)
    if (!respuesta.ok) {
      // Intentamos leer el JSON que el BFF mandó con el detalle del error
      const errorData = await respuesta.json().catch(() => null);

      // Si el BFF mandó tu estructura, la lanzamos tal cual
      if (errorData && errorData.message) {
        throw errorData as BffError;
      }

      // Si el BFF falló feo y no mandó JSON, armamos la estructura nosotros
      throw {
        status: respuesta.status,
        code: "ERR_UNKNOWN",
        error: respuesta.statusText || "Error Desconocido",
        message: "Ocurrió un problema al procesar la solicitud.",
        developerMessage:
          "El servidor devolvió un error, pero no en el formato estándar.",
        path: `${BFF_URL}/registrar-usuarios`,
        timestamp: Date.now(),
      } as BffError;
    }

    // 3. Si todo salió bien (status 200, 201), devolvemos los datos normales
    const datos = await respuesta.json();
    return datos;
  } catch (error: any) {
    // 4. Si el error ya trae nuestra estructura (lo lanzamos arriba), lo dejamos pasar
    if (error.status && error.message) {
      throw error;
    }

    // 5. Si fue un error de red (ej. se cayó el internet, o el Docker está apagado)
    // Armamos la misma estructura para que el frontend NUNCA rompa
    throw {
      status: 503,
      code: "ERR_NETWORK",
      error: "Service Unavailable",
      message: "No se pudo conectar con el servidor.",
      developerMessage: error.message || "Error de conexión con el BFF",
      path: `${BFF_URL}/registrar-usuarios`,
      timestamp: Date.now(),
    } as BffError;
  }
};
