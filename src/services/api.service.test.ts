import { handleResponse } from "./api.service";

const buildResponse = (body: string, init: ResponseInit = {}) =>
  ({
    ok: init.status ? init.status >= 200 && init.status < 300 : true,
    status: init.status ?? 200,
    statusText: init.statusText ?? "",
    url: "http://localhost/api/v1/registro",
    text: jest.fn().mockResolvedValue(body),
  }) as unknown as Response;

describe("handleResponse", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("devuelve JSON parseado cuando la respuesta exitosa trae un cuerpo JSON", async () => {
    const response = buildResponse(
      JSON.stringify({ accessToken: "access-token", refreshToken: "refresh-token" }),
    );

    await expect(handleResponse(response)).resolves.toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
  });

  test("devuelve null cuando la respuesta exitosa no trae cuerpo", async () => {
    const response = buildResponse("   ");

    await expect(handleResponse(response)).resolves.toBeNull();
  });

  test("devuelve texto crudo cuando la respuesta exitosa no es JSON", async () => {
    const response = buildResponse("registro aceptado");

    await expect(handleResponse(response)).resolves.toBe("registro aceptado");
  });

  test("lanza un error enriquecido usando message cuando el error viene como JSON", async () => {
    const response = buildResponse(
      JSON.stringify({
        message: "Correo ya registrado",
        code: "EMAIL_EXISTS",
        error: "Conflict",
      }),
      { status: 409, statusText: "Conflict" },
    );

    await expect(handleResponse(response)).rejects.toMatchObject({
      message: "Correo ya registrado",
      status: 409,
      code: "EMAIL_EXISTS",
      error: "Conflict",
    });
  });

  test("lanza un error enriquecido usando mensaje cuando el backend responde en espanol", async () => {
    const response = buildResponse(
      JSON.stringify({
        mensaje: "Rut invalido",
      }),
      { status: 400, statusText: "Bad Request" },
    );

    await expect(handleResponse(response)).rejects.toMatchObject({
      message: "Rut invalido",
      status: 400,
      code: "Bad Request",
      error: "JSON Error",
    });
  });

  test("incluye el texto crudo cuando el error no es JSON", async () => {
    const response = buildResponse("<html>nginx error</html>", {
      status: 502,
      statusText: "Bad Gateway",
    });

    await expect(handleResponse(response)).rejects.toMatchObject({
      message: "Respuesta cruda del servidor: <html>nginx error</html>",
      status: 502,
      code: "Bad Gateway",
      error: "Raw/Empty Error",
    });
  });

  test("usa statusText cuando el error no trae cuerpo", async () => {
    const response = buildResponse("", {
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(handleResponse(response)).rejects.toMatchObject({
      message: "Error de servidor sin cuerpo: 500 - Internal Server Error",
      status: 500,
      code: "Internal Server Error",
      error: "Raw/Empty Error",
    });
  });

  test("usa el codigo HTTP cuando el error no trae cuerpo ni statusText", async () => {
    const response = buildResponse("", { status: 503, statusText: "" });

    await expect(handleResponse(response)).rejects.toMatchObject({
      message: "Error de servidor código: 503 (Cuerpo vacío)",
      status: 503,
      code: "HTTP_503",
      error: "Raw/Empty Error",
    });
  });
});
