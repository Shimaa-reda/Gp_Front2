import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
 

  constructor(private http:HttpClient) { }  

  public  registerationStatus:any = '0';
  public EvaluationFormStatus:any = 0;
  public GPFormStatus:any = '0';



  private baseUrl = 'http://127.0.0.1:8000/api';

  returnAcceptedRequestsGP()
  {
    let url= "http://127.0.0.1:8000/api/returnAcceptedRequestsGP/";
    return this.http.get(url);  
  }

  get_Number_Of_Students_In_Department(year:any)
  {
    let url= "http://127.0.0.1:8000/api/get_Number_Of_Students_In_Department/"+year;
    return this.http.get(url);  
  }

  get_GPA_distribution_In_Department(year:any)
  {
    let url= "http://127.0.0.1:8000/api/get_GPA_distribution_In_Department/"+year;
    return this.http.get(url);  
  }
  getPreferencesYears()
  {
    let url= "http://127.0.0.1:8000/api/getPreferencesYears";
    return this.http.get(url);  
  }
  setDepatmentToStudent()
  {
    let url= "http://127.0.0.1:8000/api/setDepatmentToStudent/";
    return this.http.put(url,1);  
  }
  getAdminInfo(token:any)
  {
    let url= "http://127.0.0.1:8000/api/getAdminInfo/"+token;
    return this.http.get(url);  
  }
  // setRegisterationStatus(data: any) {
  //   this.registerationStatus = data;
  //   console.log('registerationStatusssssssssss',this.registerationStatus);

  //   this.getRegisterationStatus();  
  // }

  // getRegisterationStatus() {
  //   console.log('registerationStatus',this.registerationStatus);
  //   return this.registerationStatus;
  // }

  updateRegisterationStatus(status:any)
  {  
      let url= "http://127.0.0.1:8000/api/updateRegisterationStatus/"+status;
      return this.http.put(url,status);
  }
  updateprogramSelectionStatus(status:any)
  {  
       
      let url= "http://127.0.0.1:8000/api/updateprogramSelectionStatus/"+status;
      return this.http.put(url,status);
  }
  
  getAllCourses()
  {
    let url= "http://127.0.0.1:8000/api/getAllCourses/";
    return this.http.get(url);  
  }

  getStudentInCourse(courseId:any)
  {
    let url= "http://127.0.0.1:8000/api/getStudentInCourse/"+courseId;
    return this.http.get(url);  
  }

  addGrade(courseId:any , studentId:any,formData:any)
  { 
    return this.http.post(`${this.baseUrl}/addGrade/${courseId}/${studentId}`, formData); 
  }
  setGPFormStatus(satus:any)
  {
    let url= "http://127.0.0.1:8000/api/setGPFormStatus/"+satus;
    return this.http.put(url,satus);
  }
  setEvaluationStatus(satus:any)
  {
    let url= "http://127.0.0.1:8000/api/setEvaluationStatus/"+satus;
    return this.http.put(url,satus);
  }
  getAdminControlStatus()
  {
    let url= "http://127.0.0.1:8000/api/getAdminControlStatus/";
    return this.http.get(url);  
  }

}
