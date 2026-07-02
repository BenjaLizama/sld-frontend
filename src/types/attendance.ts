export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT";

export interface StudentSummary {
  studentId: string;
  rut: string;
  fullName: string;
}

export interface StudentAttendanceSummary {
  student: StudentSummary;
  attendancePercentage: number;
}

export interface AttendanceRequestDto {
  attendanceDate: string; // Formato YYYY-MM-DD
  attendanceStatus: AttendanceStatus;
}
