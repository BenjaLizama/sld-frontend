import { AuthCard } from "./components/AuthCard";
import { ServiceSummary } from "./components/ServiceSummary";
import { StudentWidget } from "./components/StudentWidget";

export default function App() {
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
