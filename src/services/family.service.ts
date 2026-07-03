import { API, handleResponse } from "./api.service";

export interface HijoResumen {
  rut: string;
  fullName: string;
  relationship: string;
  promedioGeneral: number;
  porcentajeAsistencia: number;
}

export interface LinkFamilyRequest {
  parentId: string; // RUT Apoderado
  studentId: string; // RUT Estudiante
  parentTypeId: number; // ID de base de datos (1: Madre, 2: Padre, etc.)
}

/**
 * 🛠️ Crea un parentesco desde el panel de Administrador
 */
export const crearParentesco = async (
  payload: LinkFamilyRequest,
): Promise<any> => {
  const response = await fetch(API.familiesLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

/**
 * 👪 Obtiene el listado consolidado de pupilos para el Apoderado logueado
 */
export const obtenerResumenHijos = async (
  rutApoderado: string,
): Promise<HijoResumen[]> => {
  const response = await fetch(
    `${API.parentSummary}/${rutApoderado}/resumen-hijos`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
  return handleResponse(response);
};
