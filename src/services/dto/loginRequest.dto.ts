export interface LoginRequest {
  login: {
    identifier: string;
    password: string;
    provider: "LOCAL";
  };

  session: {
    deviceId: string;
    deviceName: string;
  };
}
