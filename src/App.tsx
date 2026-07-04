import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Navbar } from "./components/Navbar/Navbar";
import { AuthCard } from "./components/AuthCard/AuthCard";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { RegisterForm } from "./components/RegisterForm/RegisterForm";
import { AttendanceManager } from "./components/StudentAttendance/AttendanceManager";
import { StudentDashboard } from "./screens/StudentDashboard";
import TeacherDashboard from "./screens/TeacherDashboard";
import { ParentDashboard } from "./screens/ParentDashboard";

function App() {
  // 🚀 Estado global para saber si hay sesión activa
  const [sessionUpdated, setSessionUpdated] = useState(0);

  // Esta pequeña función la llamaremos desde el Login para forzar la actualización
  const loginSync = () => {
    setSessionUpdated((prev) => prev + 1);
  };

  return (
    <BrowserRouter>
      {/* 🎯 Le pasamos 'sessionUpdated' como clave para que la Navbar se reinicie sola al iniciar sesión */}
      <Navbar key={sessionUpdated} />

      <div className="app-shell">
        <main style={{ marginTop: "20px" }}>
          <Routes>
            {/* 🎯 Le pasamos la función de sincronización al Login */}
            <Route
              path="/login"
              element={<AuthCard onLoginSuccess={loginSync} />}
            />

            {/* Rutas protegidas */}

            <Route element={<ProtectedRoute allowedRole="ROLE_ADMIN" />}>
              <Route path="/registrar-usuarios" element={<RegisterForm />} />
            </Route>

            <Route element={<ProtectedRoute allowedRole="ROLE_TEACHER" />}>
              <Route path="/asistencia" element={<AttendanceManager />} />
              <Route path="/notas" element={<TeacherDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRole="ROLE_STUDENT" />}>
              <Route
                path="/dashboard-estudiante"
                element={<StudentDashboard />}
              />
            </Route>
            <Route element={<ProtectedRoute allowedRole="ROLE_PARENT" />}>
              <Route
                path="/dashboard-apoderado"
                element={<ParentDashboard />}
              />
            </Route>

            <Route path="/" element={<AuthCard onLoginSuccess={loginSync} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
