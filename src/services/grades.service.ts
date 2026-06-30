import { API, handleResponse } from "./api.service";
import { StudentWithGradesDTO } from "./dto/studentGrades.dto";

const GRADES_URL = API.grades;

export const getStudentsWithGrades = async (): Promise<
  StudentWithGradesDTO[]
> => {
  const response = await fetch(`${GRADES_URL}`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};
export const assignGrade = async (payload: {
  studentId: string;
  teacherId: string;
  value: number;
  name: string;
}) => {
  const response = await fetch(`${GRADES_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

// Eliminar nota
export const deleteGrade = async (gradeId: string) => {
  const response = await fetch(`${GRADES_URL}/${gradeId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar la nota");
  }
  return true;
};

// Editar nota
export const updateGrade = async (
  gradeId: string,
  payload: { value: number; name: string },
) => {
  const response = await fetch(`${GRADES_URL}/${gradeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};
