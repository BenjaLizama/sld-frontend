import { AuthCard, LoggedUser } from "./components/AuthCard/AuthCard";
import { RegisterForm } from "./components/RegisterForm/RegisterForm";
import { ServiceSummary } from "./components/ServiceSummary/ServiceSummary";
import { StudentWidget } from "./components/StudentWidget/StudentWidget";
import { UserList } from "./components/UserList/UserList";
import { useState } from "react";

export default function App() {
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Colegio Bernardo O&apos;Higgins</p>
          <h1>Libro de Clases Digital</h1>
        </div>

        <div className="topbar-actions">
          {loggedUser ? (
            <aside className="session-card" aria-label="Usuario conectado">
              <span>Sesion activa</span>
              <strong>
                {loggedUser.firstName} {loggedUser.lastName}
              </strong>
              <small>{loggedUser.role}</small>
            </aside>
          ) : null}
          <span className="status-pill">React + TypeScript</span>
        </div>
      </header>

      <RegisterForm />

      <section className="layout-grid" aria-label="Componentes principales">
        <AuthCard onLogin={setLoggedUser} />
        <ServiceSummary />
        <StudentWidget />
      </section>

      <UserList />
    </main>
  );
}
