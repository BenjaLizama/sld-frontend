import React, { useEffect, useState } from "react";
import { attendanceService } from "../../services/attendanceService";
import {
  StudentAttendanceSummary,
  AttendanceStatus,
} from "../../types/attendance";

export const AttendanceManager: React.FC = () => {
  const [report, setReport] = useState<StudentAttendanceSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 📅 Estado para controlar la fecha elegida (Por defecto toma el día de hoy en formato YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getAttendanceReport();
      setReport(data || []);
      setError(null);
    } catch (err: any) {
      const apiMessage =
        err.response?.data?.message || "Error al conectar con el servidor";
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Modificamos la función para que use la 'selectedDate' en lugar de la fecha fija de hoy
  const handleMarkAttendance = async (
    studentId: string,
    status: AttendanceStatus,
  ) => {
    try {
      // 🚀 Modificación en el servicio: le pasamos la fecha elegida por el usuario
      await attendanceService.passAttendanceWithDate(
        studentId,
        selectedDate,
        status,
      );
      alert(`Asistencia registrada con éxito para el día ${selectedDate}`);
      loadData(); // Refrescamos los porcentajes
    } catch (err: any) {
      const apiMessage = err.response?.data?.message || "No se pudo registrar";
      alert(`Error: ${apiMessage}`);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      <h2>📋 Control de Asistencia Flexible</h2>

      {/* 📅 Selector de Fecha Dinámico */}
      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "15px",
          borderRadius: "6px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <label htmlFor="attendance-date" style={{ fontWeight: "bold" }}>
          📆 Selecciona la fecha a registrar/editar:
        </label>
        <input
          id="attendance-date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "6px 12px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <span style={{ fontSize: "12px", color: "#666" }}>
          (Los clicks que hagas abajo impactarán en este día)
        </span>
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fee2e2",
            color: "#ef4444",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {loading && (
        <p style={{ color: "#666" }}>🔄 Actualizando lista y porcentajes...</p>
      )}

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
          border: "1px solid #ddd",
        }}
      >
        <thead style={{ backgroundColor: "#f3f4f6" }}>
          <tr>
            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "left",
              }}
            >
              RUT
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "left",
              }}
            >
              Nombre Completo
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "left",
              }}
            >
              % Asistencia Actual
            </th>
            <th
              style={{
                padding: "12px",
                borderBottom: "2px solid #ddd",
                textAlign: "left",
              }}
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {report.length === 0 && !loading ? (
            <tr>
              <td
                colSpan={4}
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#9ca3af",
                }}
              >
                No se encontraron estudiantes registrados en el sistema.
              </td>
            </tr>
          ) : (
            report.map(({ student, attendancePercentage }) => (
              <tr
                key={student.studentId}
                style={{ borderBottom: "1px solid #edf2f7" }}
              >
                <td style={{ padding: "12px" }}>{student.rut}</td>
                <td style={{ padding: "12px" }}>
                  <strong>{student.fullName}</strong>
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        (attendancePercentage || 0) >= 85
                          ? "#10b981"
                          : "#f59e0b",
                    }}
                  >
                    {(attendancePercentage || 0).toFixed(1)}%
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() =>
                      handleMarkAttendance(student.studentId, "PRESENT")
                    }
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      marginRight: "8px",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Presente
                  </button>
                  <button
                    onClick={() =>
                      handleMarkAttendance(student.studentId, "LATE")
                    }
                    style={{
                      backgroundColor: "#f59e0b",
                      color: "white",
                      marginRight: "8px",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Atraso
                  </button>
                  <button
                    onClick={() =>
                      handleMarkAttendance(student.studentId, "ABSENT")
                    }
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Ausente
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
