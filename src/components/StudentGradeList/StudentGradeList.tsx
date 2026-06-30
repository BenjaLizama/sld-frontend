import { useEffect, useState } from "react";
import {
  getStudentsWithGrades,
  assignGrade,
  deleteGrade,
  updateGrade,
} from "../../services/grades.service";

export type Grade = {
  id: string;
  valor: number;
  name: string;
  studentId: string;
  teacherId: string;
};

export type StudentWithGrades = {
  studentId: string;
  rut: string;
  fullName: string;
  grades: Grade[];
};

export function StudentGradeList() {
  const [students, setStudents] = useState<StudentWithGrades[]>([]);

  // --- Estados para CREAR nota ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [gradeValue, setGradeValue] = useState<number | "">("");
  const [gradeName, setGradeName] = useState("");

  // --- Estados para EDITAR/ELIMINAR nota ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [editGradeValue, setEditGradeValue] = useState<number | "">("");
  const [editGradeName, setEditGradeName] = useState("");

  const cargarAlumnos = async () => {
    try {
      const data = await getStudentsWithGrades();
      setStudents(data);
    } catch (error) {
      console.error("Error al cargar los alumnos", error);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  // ====== LÓGICA PARA CREAR NOTA ======
  const handleOpenCreateModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedStudentId(null);
    setGradeValue("");
    setGradeName("");
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || gradeValue === "" || gradeName.trim() === "")
      return;

    try {
      await assignGrade({
        studentId: selectedStudentId,
        teacherId: "123e4567-e89b-12d3-a456-426614174000",
        value: Number(gradeValue),
        name: gradeName,
      });
      handleCloseCreateModal();
      cargarAlumnos();
    } catch (error) {
      console.error("Error al guardar la nota", error);
      alert("Hubo un error al guardar la nota.");
    }
  };

  // ====== LÓGICA PARA EDITAR / ELIMINAR NOTA ======
  const handleOpenEditModal = (grade: Grade) => {
    setSelectedGrade(grade);
    setEditGradeValue(grade.valor);
    setEditGradeName(grade.name);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedGrade(null);
    setEditGradeValue("");
    setEditGradeName("");
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrade || editGradeValue === "" || editGradeName.trim() === "")
      return;

    try {
      await updateGrade(selectedGrade.id, {
        value: Number(editGradeValue),
        name: editGradeName,
      });
      handleCloseEditModal();
      cargarAlumnos();
    } catch (error) {
      console.error("Error al actualizar", error);
      alert("Hubo un error al actualizar la nota.");
    }
  };

  const handleDelete = async () => {
    if (!selectedGrade) return;

    // Pequeña confirmación por si el profe apretó sin querer
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar la nota "${selectedGrade.name}"?`,
    );
    if (!confirmar) return;

    try {
      await deleteGrade(selectedGrade.id);
      handleCloseEditModal();
      cargarAlumnos();
    } catch (error) {
      console.error("Error al eliminar", error);
      alert("Hubo un error al eliminar la nota.");
    }
  };

  return (
    <section className="user-list-section" aria-labelledby="teacher-list-title">
      <div className="panel-heading">
        <span className="icon">PR</span>
        <div>
          <h2 id="teacher-list-title">Panel de Calificaciones</h2>
          <p>Gestiona las notas de los estudiantes inscritos.</p>
        </div>
      </div>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>RUT</th>
              <th>Notas Actuales</th>
              <th>Promedio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => {
                const promedio =
                  student.grades.length > 0
                    ? (
                        student.grades.reduce(
                          (acc, curr) => acc + curr.valor,
                          0,
                        ) / student.grades.length
                      ).toFixed(1)
                    : "N/A";

                return (
                  <tr key={student.studentId}>
                    <td>
                      <strong>{student.fullName}</strong>
                    </td>
                    <td>{student.rut}</td>
                    <td>
                      {/* 👉 AQUI CAMBIAMOS COMO SE VEN LAS NOTAS */}
                      {student.grades.length > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          {student.grades.map((g) => {
                            // 👈 Llamamos a nuestra función para obtener los colores de esta nota
                            const colors = getBadgeColor(g.valor);

                            return (
                              <button
                                key={g.id}
                                onClick={() => handleOpenEditModal(g)}
                                title={g.name}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  border: "1px solid rgba(0,0,0,0.1)", // Borde más suave
                                  backgroundColor: colors.bg, // 👈 Aplicamos el fondo dinámico
                                  color: colors.text, // 👈 Aplicamos el texto dinámico
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                }}
                              >
                                {g.valor}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <span style={{ color: "#999" }}>Sin notas</span>
                      )}
                    </td>
                    <td>
                      <strong>{promedio}</strong>
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenCreateModal(student.studentId)}
                        style={{
                          padding: "5px 10px",
                          cursor: "pointer",
                          backgroundColor: "#007bff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                        }}
                      >
                        + Asignar Nota
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#666",
                  }}
                >
                  Cargando información o no hay estudiantes matriculados...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 👉 MODAL PARA CREAR NOTA */}
      {isCreateModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Asignar nueva nota</h3>
            <form
              onSubmit={handleSubmitCreate}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <div>
                <label>Nota (ej: 6.5):</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="7"
                  required
                  value={gradeValue}
                  onChange={(e) => setGradeValue(parseFloat(e.target.value))}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div>
                <label>Descripción (ej: Prueba 1):</label>
                <input
                  type="text"
                  required
                  value={gradeName}
                  onChange={(e) => setGradeName(e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseCreateModal}
                  style={{ padding: "8px 15px", cursor: "pointer" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 15px",
                    cursor: "pointer",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                  }}
                >
                  Guardar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 👉 MODAL PARA EDITAR/ELIMINAR NOTA */}
      {isEditModalOpen && selectedGrade && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Gestionar Nota</h3>
            <form
              onSubmit={handleSubmitEdit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <div>
                <label>Nota:</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="7"
                  required
                  value={editGradeValue}
                  onChange={(e) =>
                    setEditGradeValue(parseFloat(e.target.value))
                  }
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div>
                <label>Descripción:</label>
                <input
                  type="text"
                  required
                  value={editGradeName}
                  onChange={(e) => setEditGradeName(e.target.value)}
                  style={{ width: "100%", padding: "8px" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "15px",
                }}
              >
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    padding: "8px 15px",
                    cursor: "pointer",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                  }}
                >
                  🗑️ Eliminar
                </button>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    style={{ padding: "8px 15px", cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "8px 15px",
                      cursor: "pointer",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Actualizar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// Función para determinar el color de la nota
const getBadgeColor = (nota: number) => {
  if (nota < 4.0) return { bg: "#dc3545", text: "white" }; // Rojo para notas < 4.0
  if (nota < 6.0) return { bg: "#ffc107", text: "black" }; // Amarillo para notas de 4.0 a 5.9
  return { bg: "#28a745", text: "white" }; // Verde para notas de 6.0 en adelante
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "380px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};
