import axios, { AxiosError, AxiosResponse, } from 'axios';
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
      const payload = {
        isActive: false,
      }
      const response = await axios.patch(`${BASE_URL}/api/v1/auth/update-userdetails-admin/${id}`,
        payload,
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
  async editSignleUser(id: number, data: {firstName: string, lastName: string, middleName: string, email: string, dob: string, occupation: string, gender: string, role: string}) {
    try{
      const token = localStorage.getItem("authToken")
      if(!token){
        return null
      }
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        email: data.email,
        dob: data.dob,
        occupation: data.occupation,
        gender: data.gender,
        role: data.role,
      }
      const response = await axios.patch(`${BASE_URL}/api/v1/auth/update-userdetails-admin/${id}`,
        payload,
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
  
  async submitIncidentReport(data: { message: string, subject: string, photo: File , voiceNote: File}){
    try{
      const token = localStorage.getItem("authToken")
      const formData = new FormData();
      formData.append('message', data.message);
      formData.append('subject', data.subject);
      formData.append('photo', data.photo);
      formData.append('voiceNote', data.voiceNote);

      const response = await axios.post(`${BASE_URL}/api/v1/incident/user/report`,
      formData,
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

  async submitEvent(data: { title: string, description: string, date: string, time: string }){
    try{
      const token = localStorage.getItem("authToken")
      const payload = {
        eventTitle: data.title,
        eventDescription: data.description,
        eventDate: data.date,
        eventTime: data.time
      }

      const response = await axios.post(`${BASE_URL}/api/v1/admin/create-event`,
      payload,
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
  async getAllEvents(){
    try{
      const token = localStorage.getItem("authToken")
      const response = await axios.get(`${BASE_URL}/api/v1/admin/get-all/event?limit=100&page=1`,
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
  async submitWeeklyReport(data: { actionItems: string, ongoingItems: string, completedItems: string }){
    try{
      const token = localStorage.getItem("authToken")
      const payload = {
        ActionItem: data.actionItems,
        OngoingTask: data.ongoingItems,
        CompletedTask: data.completedItems
      }

      const response = await axios.post(`${BASE_URL}/api/v1/user/create-report`,
      payload,
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
  async getAllReports(){
    try{
      const token = localStorage.getItem("authToken")
      const response = await axios.get(`${BASE_URL}/api/v1/user/getAll-weeklyReport`,
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

  async updateWeeklyReport(userId: number, data: { actionItemsId: string, actionItemsdescription:string, ongoingTaskId: string, ongoingTaskdescription:string, completedTaskId: string, completedTaskdescription:string }){
    try{
      const token = localStorage.getItem("authToken")
      const payload = {
        ActionItem: [{
          id: data.actionItemsId,
          description: data.actionItemsdescription
        }],
        OngoingTask: [{
          id: data.ongoingTaskId,
          description: data.ongoingTaskdescription
        }],        
        CompletedTask: [{
          id: data.completedTaskId,
          description: data.completedTaskdescription
        }]
      }

      const response = await axios.patch(`${BASE_URL}/api/v1/user/editTarget-weeklyReport/${userId}`,
      payload,
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

  
  // async getEvent(id: string){
  //   try{
  //     const token = localStorage.getItem("authToken")
  //     const response = await axios.get(`${BASE_URL}/api/v1/admin/get-all/event/`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     )
  //     return response.data.data.
  //   }
  //   catch(err){
  //     return err
  //   }
  // }

  // async getSpecificUserIncident(id: number){
  //   try{
  //     const token = localStorage.getItem("authToken")
  //     const response = await axios.get(`${BASE_URL}/api/v1/single-user/details/${id}`,
        
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`
  //         }
  //       }
  //     )
  //     return response
  //   }
  //   catch(err){
  //     return err
  //   }
  // }
  
}
