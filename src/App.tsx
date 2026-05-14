import { AuthCard } from "./components/AuthCard";
import { ServiceSummary } from "./components/ServiceSummary";
import { StudentWidget } from "./components/StudentWidget";
import { REGISTRAR_USUARIO } from "./services/register";
import { REGISTRAR_USUARIO_INTERFACE } from "./types/registrarUsuario.type";

export default function App() {
  const NUEVO_USUARIO: REGISTRAR_USUARIO_INTERFACE = {
    auth: {
      email: "apoderado3.valido@test.com",
      password: "Password123!",
      role: "ROLE_PARENT",
    },
    session: {
      deviceId: "127.0.0.1",
      deviceName: "Device",
    },
    profile: {
      educationLevel: "Universitaria",
      isSupporter: true,
    },
    personal: {
      address: "...",
      birthday: "1990-05-12",
      firstName: "Juan",
      lastName: "Pérez",
      phoneNumber: "+569...",
      genderId: 1,
      nationality: "Chilena",
      rut: "14.345.678-1",
    },
  };
  console.log(REGISTRAR_USUARIO(NUEVO_USUARIO));

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Colegio Bernardo O&apos;Higgins</p>
          <h1>Libro de Clases Digital</h1>
        </div>
        <span className="status-pill">React + TypeScript</span>
      </header>

      <section className="layout-grid" aria-label="Componentes principales">
        <AuthCard />
        <ServiceSummary />
        <StudentWidget />
      </section>
    </main>
  );
}
