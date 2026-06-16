type Gender = {
  id: number;
  name: string;
};

type User = {
  id: string;
  rut: string;
  email: string;
  gender: Gender;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  nationality: string;
  creationDate: string;
};

const users: User[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    rut: "21.910.844-3",
    email: "benjamin.lizama@sld.com",
    gender: { id: 1, name: "Masculino" },
    firstName: "Benjamin",
    middleName: "Rodrigo",
    lastName: "Lizama",
    secondLastName: "Cespedes",
    phoneNumber: "927452872",
    address: "Alejandro Villalobos 241",
    birthday: "2005-08-08",
    nationality: "Chile",
    creationDate: "2026-06-15T14:30:00Z",
  },
  {
    id: "6f9f2a0d-ef35-47d9-9a70-61dd37f82216",
    rut: "14.345.678-1",
    email: "apoderado.valido@sld.com",
    gender: { id: 2, name: "Femenino" },
    firstName: "Carolina",
    lastName: "Munoz",
    secondLastName: "Rojas",
    phoneNumber: "956781234",
    address: "Los Aromos 1220",
    birthday: "1990-05-12",
    nationality: "Chilena",
    creationDate: "2026-06-12T09:12:00Z",
  },
  {
    id: "9d7b9472-d70d-4df8-8ed0-345f3a47a2de",
    rut: "18.765.432-5",
    email: "docente.historia@sld.com",
    gender: { id: 1, name: "Masculino" },
    firstName: "Matias",
    lastName: "Herrera",
    phoneNumber: "934561278",
    address: "Pasaje Las Encinas 84",
    birthday: "1987-11-03",
    nationality: "Chile",
    creationDate: "2026-06-10T17:45:00Z",
  },
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));

const getFullName = (user: User) =>
  [
    user.firstName,
    user.middleName,
    user.lastName,
    user.secondLastName,
  ]
    .filter(Boolean)
    .join(" ");

export function UserList() {
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
              <tr key={user.id}>
                <td>
                  <strong>{getFullName(user)}</strong>
                  <span>{user.email}</span>
                </td>
                <td>{user.rut}</td>
                <td>{user.gender.name}</td>
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
