export interface RegisterRequest {
  auth: {
    email: string;
    password: string;
    role?: ROLE;
  };
  session: {
    deviceId: string;
    deviceName: string;
  };
  profile: any;
  personal: {
    rut: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastname?: string;
    phoneNumber: string;
    address: string;
    birthday: string;
    nationality: string;
    genderId: number;
  };
}

type ROLE = "STUDENT" | "TEACHER" | "PARENT";
