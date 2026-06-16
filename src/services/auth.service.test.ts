import { register } from "./auth.service";
import { RegisterRequest } from "./dto/registerRequest.dto";

const request: RegisterRequest = {
  auth: {
    email: "benjamin.lizama@sld.com",
    password: ".123Contrasena#",
    role: "STUDENT",
  },
  session: {
    deviceId: "web-browser",
    deviceName: "Frontend SLD",
  },
  profile: {
    educationLevel: "Media",
    isSupporter: false,
  },
  personal: {
    rut: "21.910.844-3",
    firstName: "Benjamin",
    middleName: "Rodrigo",
    lastName: "Lizama",
    secondLastname: "Cespedes",
    phoneNumber: "927452872",
    address: "Alejandro Villalobos 241",
    birthday: "2005-08-08",
    nationality: "Chile",
    genderId: 1,
  },
};

const buildResponse = (body: string, init: ResponseInit = {}) =>
  ({
    ok: init.status ? init.status >= 200 && init.status < 300 : true,
    status: init.status ?? 200,
    statusText: init.statusText ?? "",
    url: "http://localhost/api/v1/registro/registrar-usuario",
    text: jest.fn().mockResolvedValue(body),
  }) as unknown as Response;

describe("register", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
    jest.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("envia el registro al endpoint del BFF con headers y payload esperados", async () => {
    fetchMock.mockResolvedValueOnce(
      buildResponse(
        JSON.stringify({
          accessToken: "access-token",
          refreshToken: "refresh-token",
        }),
      ),
    );

    await expect(register(request)).resolves.toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/registro\/registrar-usuario$/),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": "web-browser",
        },
        body: JSON.stringify(request),
      },
    );
  });

  test("propaga el error procesado por handleResponse cuando el backend rechaza el registro", async () => {
    fetchMock.mockResolvedValueOnce(
      buildResponse(
        JSON.stringify({
          message: "Correo ya registrado",
          code: "EMAIL_EXISTS",
          error: "Conflict",
        }),
        { status: 409, statusText: "Conflict" },
      ),
    );

    await expect(register(request)).rejects.toMatchObject({
      message: "Correo ya registrado",
      status: 409,
      code: "EMAIL_EXISTS",
      error: "Conflict",
    });
  });
});
