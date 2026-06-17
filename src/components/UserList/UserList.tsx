type Gender = {
  id: number;
  name: string;
};

import { useEffect, useState } from "react";
import { UserSummaryDTO } from "../../services/dto/userSummary.dto";
import { listaUsuarios } from "../../services/user.service";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

export function UserList() {
  const [users, setUsers] = useState<UserSummaryDTO[]>([]);

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const data = await listaUsuarios();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarUsuarios();
  }, []);
  return (
    <section className="user-list-section" aria-labelledby="user-list-title">
      <div className="panel-heading">
        <span className="icon">US</span>
        <div>
          <h2 id="user-list-title">Usuarios registrados</h2>
          <p>Vista resumida basada en la entidad usuarios.</p>
        </div>
      </div>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>RUT</th>
              <th>Genero</th>
              <th>Contacto</th>
              <th>Nacimiento</th>
              <th>Creacion</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                <td>
                  <strong>{user.fullName}</strong>
                  <span>{user.email}</span>
                </td>
                <td>{user.rut}</td>
                <td>{user.gender}</td>
                <td>
                  <strong>{user.phoneNumber}</strong>
                  <span>{user.address}</span>
                </td>
                <td>{formatDate(user.birthday)}</td>
                <td>
                  <strong>{user.nationality}</strong>
                  <span>{formatDate(user.creationDate)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
