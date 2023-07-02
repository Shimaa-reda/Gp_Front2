import { AuthService } from '../auth.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MessageService } from './../message.service';
import { ThisReceiver } from '@angular/compiler';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fcaichat',
  templateUrl: './fcaichat.component.html',
  styleUrls: ['./fcaichat.component.css']
})

export class FCAIChatComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  message: any = '';
  contacts: any;
  recentContacts:any;
  searchText = '';
  attachement: any;
  selectedFile: any;
  attachmentUrl: any;
  currentSender:any;
  currentReceiver :any;
  chatPartner:any='';
  chatPartnerType:any;
  senderInfo:any;
  chatHistory:any;
  flag: boolean=false;
  flag2: any;
  blockContent:boolean = false;
  isBlocked:boolean = false;
  blockedUsers:any;
  

  constructor(private messageService: MessageService,
    private _AuthService: AuthService,private datePipe: DatePipe
   ) { }


  ngOnInit() {
    const token = this._AuthService.getToken();
    this.messageService.getUserInfo(token).subscribe(
      senderInfo=> {
        this.senderInfo=senderInfo;
        console.log('senderInfo',this.senderInfo);
        this.currentSender=this.senderInfo[0].id;
        this.getRecentContacts (this.senderInfo[0].id) ;    
    }
    ,
    error => { 
      console.error(error);  
    });

    setInterval(() => {
      this.getHistory(this.currentSender,this.currentReceiver).subscribe((history) => {
        this.chatHistory = history;
      });
      
    }, 2000);

  }

getAllContacts(){
  this.flag2=false;
  this.flag=true;
  this.messageService.getAllContacts(this.senderInfo[0].id,this.senderInfo[0].Type).subscribe(
    response=> {
      this.contacts=response;
      console.log('contacts',this.contacts);     
  }
  ,
  error => { 
    console.error(error);  
  });
  
}
formatDate(dateString: string): any {
  const offsetMs = new Date().getTimezoneOffset() * 60 * 1000;
  const date = new Date(Date.parse(dateString) - offsetMs);
  return this.datePipe.transform(date, 'dd/MM/yyyy h:mm a');
}

getRecentContacts(senderID:any){
  this.flag2=true;
  this.messageService.getRecentContacts(senderID).subscribe(
    response=> {
      this.recentContacts=response;
      this.recentContacts = this.recentContacts.map((item: { last_contact_time: string }) => {
        return {
          ...item,
         
          last_contact_time: this.formatDate(item. last_contact_time)
        };
      });

      console.log('recent contacts',this.recentContacts);     
  }
  ,
  error => { 
    console.error(error);  
  });
  
}

setCurrentReceiver(receiver: any) {
  this.flag2=true;
  this.flag=false;
  this.currentReceiver = receiver.userID;
  this.chatPartner= receiver.Type+'. '+receiver.name;
  this.chatPartnerType= receiver.Type;
  console.log('currentReceiver',this.currentReceiver);
  this.getHistory(this.currentSender,this.currentReceiver).subscribe((history) => {
    this.chatHistory = history;
    console.log('chatHistory',this.chatHistory);
  });
}

sendMessage() {
  
  this.getBlockedUsers();
 
}

getHistory(currentSender:any,currentReceiver:any) {
    return this.messageService.getHistory(currentSender, currentReceiver);
  }

onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const inputElement = document.querySelector('input[name="message"]');
    if (inputElement instanceof HTMLInputElement) {
      inputElement.value = this.selectedFile.name;
    }
  }

triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

openImagePopup(url: string) {
    window.open(url, 'Image', 'width=800,height=600');
  }

isImage(file: string): boolean {
    return file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif');
  }

diplayBlockContent()
  {
    this.blockContent = true;
  }

blockUser()
  {
    this.messageService.blockUser(this.currentSender,this.currentReceiver)
    .subscribe(
      response=> {
        console.log('blocked users',response);             
    }
    ,
    error => { 
      console.error(error); 
      alert("This user has been blocked");   
    }); 
}

unBlockUser()
{
  this.messageService.unBlockUser(this.currentSender,this.currentReceiver)
  .subscribe(
    response=> {
      console.log('Unblocked users',response);            
  }
  ,
  error => { 
    console.error(error); 
    alert("This user has been unblocked");   
  }); 
}

getBlockedUsers()
{
  this.messageService.getBlockedUsers(this.currentSender,this.currentReceiver)
  .subscribe(
    response=> {
      this.blockedUsers = response;
      console.log('blocked userssssssssss',this.blockedUsers);
      if(this.blockedUsers.length === 0)
  {
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile, this.selectedFile.name);
      formData.append('message', this.selectedFile.name);
      console.log('message body',this.selectedFile.name);
      console.log('found attachment');
    } else {
      formData.append('message', this.message);
    }
    formData.append('from', this.currentSender);
    formData.append('to', this.currentReceiver);
    formData.append('senderName', this.senderInfo[0].name);
  
    this.messageService.sendMessage(formData).subscribe((response: any) => {
      this.getHistory(this.currentSender,this.currentReceiver).subscribe((history) => {
        this.chatHistory = history;
      });
      this.getRecentContacts(this.currentSender);
      this.selectedFile = null;
      this.message = '';
      const inputElement = document.querySelector('input[name="message"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
      console.log('msg send sucessfully');
    }, (error) => {
      console.log(error);
    });
  }

  else
  {
    alert("You can't send a message to this user");
  }
 
      console.log('Blocked Users' , response);         
  }
  ,
  error => { 
    console.error(error); 
  }); 
}

}