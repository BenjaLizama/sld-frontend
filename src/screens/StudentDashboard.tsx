import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { StudentAttendanceSummary } from "../types/attendance";
import { StudentWithGradesDTO } from "../services/dto/studentGrades.dto";
import { attendanceService } from "../services/attendanceService";
import { getStudentsWithGrades } from "../services/grades.service";

interface CustomJwtPayload {
  roles: string[];
  userId: string;
  sub: string;
}

export function StudentDashboard() {
  const [gradesData, setGradesData] = useState<StudentWithGradesDTO | null>(
    null,
  );
  const [myAttendance, setMyAttendance] =
    useState<StudentAttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // 1. Extraemos el id único del estudiante desde su Token JWT
        const decoded = jwtDecode<CustomJwtPayload>(token);
        const loggedStudentId = decoded.userId;

        // 2. Llamamos a los métodos que ya tienes creados
        const [allGrades, allAttendance] = await Promise.all([
          getStudentsWithGrades(), // Fetch tradicional
          attendanceService.getAttendanceReport(), // Tu Axios.get
        ]);

        // 3. Buscamos el registro del alumno logueado en la lista de notas
        const myGradesRecord = allGrades.find(
          (s) => s.studentId === loggedStudentId,
        );
        if (myGradesRecord) setGradesData(myGradesRecord);

        // 4. 🎯 Buscamos el registro del alumno logueado en tu reporte de asistencia
        const myAttendanceRecord = allAttendance.find(
          (r) => r.student.studentId === loggedStudentId,
        );
        if (myAttendanceRecord) setMyAttendance(myAttendanceRecord);
      } catch (error) {
        console.error("Error cargando los datos del estudiante:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, []);

  const calculateAverage = () => {
    if (!gradesData || !gradesData.grades || gradesData.grades.length === 0)
      return "Sin notas";
    const sum = gradesData.grades.reduce((acc, curr) => acc + curr.valor, 0);
    return (sum / gradesData.grades.length).toFixed(1);
  };

  if (loading)
    return (
      <div style={{ padding: "20px" }}>
        Cargando tus calificaciones y asistencia...
      </div>
    );

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "25px",
        }}
      >
        {/* Usamos el fullName que viene desde el objeto de asistencia o el de notas */}
        <h1 style={{ margin: 0 }}>
          👋 ¡Hola,{" "}
          {myAttendance?.student.fullName ||
            gradesData?.fullName ||
            "Estudiante"}
          !
        </h1>
        <p style={{ margin: "5px 0 0 0", color: "#94a3b8" }}>
          RUT: {myAttendance?.student.rut || gradesData?.rut}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        {/* Card Asistencia usando tu DTO original */}
        <div
          style={{
            border: "1px solid #e2e8f0",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#475569" }}>
            📊 Tu Asistencia Actual
          </h3>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color:
                (myAttendance?.attendancePercentage || 0) >= 85
                  ? "#10b981"
                  : "#ef4444",
            }}
          >
            {myAttendance?.attendancePercentage !== undefined
              ? `${myAttendance.attendancePercentage.toFixed(1)}%`
              : "0.0%"}
          </div>
          <p
            style={{ fontSize: "12px", color: "#64748b", margin: "5px 0 0 0" }}
          >
            Mínimo requerido para aprobar: 85%
          </p>
        </div>

        {/* Card Promedio */}
        <div
          style={{
            border: "1px solid #e2e8f0",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", color: "#475569" }}>
            📈 Promedio General
          </h3>
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color:
                parseFloat(calculateAverage()) >= 4.0 ? "#3b82f6" : "#ef4444",
            }}
          >
            {calculateAverage()}
          </div>
          <p
            style={{ fontSize: "12px", color: "#64748b", margin: "5px 0 0 0" }}
          >
            Cálculo basado en tus evaluaciones
          </p>
        </div>
      </div>

      {/* Tabla de Notas */}
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <h3
          style={{
            padding: "15px 20px",
            margin: 0,
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          📝 Detalle de Notas
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={{ padding: "12px 20px" }}>Evaluación</th>
              <th style={{ padding: "12px 20px", textAlign: "center" }}>
                Nota
              </th>
            </tr>
          </thead>
          <tbody>
            {!gradesData ||
            !gradesData.grades ||
            gradesData.grades.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  Aún no registras calificaciones.
                </td>
              </tr>
            ) : (
              gradesData.grades.map((grade) => (
                <tr
                  key={grade.id}
                  style={{ borderBottom: "1px solid #e2e8f0" }}
                >
                  <td style={{ padding: "12px 20px" }}>{grade.name}</td>
                  <td
                    style={{
                      padding: "12px 20px",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: grade.valor >= 4.0 ? "#2563eb" : "#dc2626",
                    }}
                  >
                    {grade.valor.toFixed(1)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
