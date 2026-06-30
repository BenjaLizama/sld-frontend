
export interface GradeResponseDTO {
  valor: number;
  name: string;
  id: string;
  studentId: string;
  teacherId: string;
}

export interface StudentWithGradesDTO {
  studentId: string;
  rut: string;
  fullName: string;
  grades: GradeResponseDTO[];
}