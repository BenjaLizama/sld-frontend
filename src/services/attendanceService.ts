import axios from "axios";
import {
  StudentAttendanceSummary,
  AttendanceRequestDto,
  AttendanceStatus,
} from "../types/attendance";

const API_BASE_URL = "http://localhost:8082/api/v1/bff/asistencias";

export const attendanceService = {
  getAttendanceReport: async (): Promise<StudentAttendanceSummary[]> => {
    const response = await axios.get<StudentAttendanceSummary[]>(
      `${API_BASE_URL}/estudiantes/reporte-asistencia`,
    );
    return response.data;
  },

  passAttendance: async (
    studentId: string,
    status: AttendanceStatus,
  ): Promise<any> => {
    const today = new Date().toISOString().split("T")[0];

    const payload: AttendanceRequestDto = {
      attendanceDate: today,
      attendanceStatus: status,
    };

    const response = await axios.post(
      `${API_BASE_URL}/estudiante/${studentId}`,
      payload,
    );
    return response.data;
  },

  passAttendanceWithDate: async (
    studentId: string,
    dateStr: string,
    status: AttendanceStatus,
  ): Promise<any> => {
    const payload: AttendanceRequestDto = {
      attendanceDate: dateStr, // 📅 Usamos la fecha seleccionada en el Front en lugar del string fijo de hoy
      attendanceStatus: status,
    };

    const response = await axios.post(
      `${API_BASE_URL}/estudiante/${studentId}`,
      payload,
    );
    return response.data;
  },
};
