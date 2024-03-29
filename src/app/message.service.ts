import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  sendMessage(msgDetails: any) {
    return this.http.post(`${this.baseUrl}/message`, msgDetails);
  }

  getHistory(from: any, to: any) {
    return this.http.get(`${this.baseUrl}/getHistory/${from}/${to}`);
  }
  
  getAllContacts(senderID: any, sendertype: any) {
    return this.http.get(`${this.baseUrl}/getAllContacts/${senderID}/${sendertype}`);
  }

  getRecentContacts(senderID: any) {
    return this.http.get(`${this.baseUrl}/getRecentContacts/${senderID}`);
  }

 

  blockUser(user1Id:any , user2Id:any)
  {
    const url = `http://127.0.0.1:8000/api/blockUser/${user1Id}/${user2Id}`;
    return this.http.post(url, {});
  }

  unBlockUser(user1Id:any , user2Id:any)
  {
    const url = `http://127.0.0.1:8000/api/unBlockUser/${user1Id}/${user2Id}`;
    return this.http.delete(url, {});
  }

  getBlockedUsers(user1Id:any , user2Id:any) {
    return this.http.get(`${this.baseUrl}/getBlockedUsers/${user1Id}/${user2Id}`);
  }

  updateSeenStatus(from:any , to:any)
  {  
      let url= "http://127.0.0.1:8000/api/updateSeenStatus/"+from+"/"+to;
      return this.http.put(url,status);
  }

  sendNotification(mailMessage:any)
  {
    const url = `http://127.0.0.1:8000/api/sendNotification/${mailMessage}`;
    return this.http.post(url, {});
  }
    
}
  
