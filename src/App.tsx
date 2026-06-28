import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import AdminDashboard from "./screens/AdminDashboard";

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
        </Routes>
      </BrowserRouter>
    </main>
  );
}
