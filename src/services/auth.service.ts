import { API, handleResponse } from "./api.service";
import { AuthResponse } from "./dto/authResponse.dto";
import { LoginRequest } from "./dto/loginRequest.dto";
import { LoginResponse } from "./dto/loginResponse.dto";
import { RegisterRequest } from "./dto/registerRequest.dto";

const AUTH_URL = `${API.auth}`;
const LOGIN_URL = `${API.login}`;

export const register = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  const response = await fetch(`${AUTH_URL}/registrar-usuario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": data.session.deviceId,
    },
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${LOGIN_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-ID": data.session.deviceId,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};
