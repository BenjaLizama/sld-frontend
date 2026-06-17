import { API, handleResponse } from "./api.service";
import { UserSummaryDTO } from "./dto/userSummary.dto";
const USER_URL = API.user;
export const listaUsuarios = async (): Promise<UserSummaryDTO[]> => {
  const response = await fetch(`${USER_URL}`, {
    method: "GET",
  });
  return handleResponse(response);
};
