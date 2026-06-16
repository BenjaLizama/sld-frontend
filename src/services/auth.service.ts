import { API, handleResponse } from "./api.service";
import { AuthResponse } from "./dto/authResponse.dto";
import { RegisterRequest } from "./dto/registerRequest.dto";

const AUTH_URL = `${API.auth}`;

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
