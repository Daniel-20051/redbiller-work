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
        {
          email_address: payload.email,
           password: payload.password
        }
        ,
        { withCredentials: true }
      );
      console.log(response)
      return response;
    } catch (error: any) {
      console.log(error.message);
      return error.message;
    }
  }

  async getUserDetails() {
    try{
      const token: any = localStorage.getItem("authToken")
      if(!token){
        return console.log("token not found")
      }
      const response = await axios.get(`${BASE_URL}/api/v1/auth/current-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const result = response;
      return result;
    }catch(err: any){
      console.error("Error fetching user details:", err);
      return err;
    }
  }
}
