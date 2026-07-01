import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import AdminDashboard from "./screens/AdminDashboard";
import TeacherDashboard from "./screens/TeacherDashboard";

export default function App() {
  return (
    <main
      style={{
        height: "100vh",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route Component={Login} path="/"></Route>
          <Route Component={AdminDashboard} path="/admin"></Route>
          <Route Component={TeacherDashboard} path="/teacherDashboard"></Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}
