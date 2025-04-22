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
      console.log(error);
      return error;
    }
  }

  async getUserDetails() {
    try{
      const token = localStorage.getItem("authToken")
      if(!token){
        console.log("token not found")
        return null
      }
      const response = await axios.get(`${BASE_URL}/api/v1/auth/current-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response;
    }catch(err: any){
      console.error("Error fetching user details:", err);
      return err;
    }
  }

  async getAllUser() {
    try{
      const token = localStorage.getItem("authToken")
      if(!token){
        return null
      }
      const response = await axios.get(`${BASE_URL}/api/v1/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response
    }catch(err){
      console.log(err)
      return err
    }
  }


  async deleteSignleUser(id: number) {
    try{
      const token = localStorage.getItem("authToken")
      if(!token){
        return null
      }
      const response = await axios.delete(`${BASE_URL}/api/v1/admin/user-delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response;
    }catch(err){
      console.log(err)
      return err
    }
  }
  
  async submitIncidentReport(bodyData: string){
    try{
      const token = localStorage.getItem("authToken")
      const response = await axios.post(`${BASE_URL}/api/v1/incident/user/report`,
      bodyData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return response
  }
    catch(err){
      return err
    }
  }

  async getAllIncidentReport(){
    try{
      const token = localStorage.getItem("authToken")
      const response = await axios.get(`${BASE_URL}/api/v1/report/admin-get/all-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response
    }
    catch(err){
      return err
    }
  }
}
