import axios, { AxiosResponse, AxiosError } from "axios";
const BASE_URL = "https://r-report-v1.onrender.com";

interface loginPayload {
  email: string;
  password: string;
}

export class AuthApis {
  async loginUser(payload: loginPayload): Promise<AxiosResponse | AxiosError> {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/auth/login-user`,
        payload,
        { withCredentials: true }
      );
      return response;
    } catch (error) {
      console.log(error);
      return error as AxiosError;
    }
  }
}
