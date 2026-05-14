export interface REGISTRAR_USUARIO_INTERFACE {
  auth: { email: string; password: string; role: string };
  session: { deviceId: string; deviceName: string };
  personal: {
    rut: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    birthday: string;
    nationality: string;
    genderId: 1 | 2;
  };
  profile: {
    educationLevel: string;
    isSupporter: boolean;
  };
}

export interface BffError {
  status: number;
  code: string;
  error: string;
  message: string;
  developerMessage: string;
  path: string;
  timestamp: number;
}
