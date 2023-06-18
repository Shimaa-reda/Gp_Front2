
import { MessageService } from '../message.service';
import { map } from 'rxjs';
import { StudentsService } from './../students.service';
import { AuthService } from '../auth.service';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ProfessorTAService } from '../professor-ta.service';
import { Router } from '@angular/router';
import { ProfessorAndTaService } from '../professor-and-ta.service';

@Component({
  selector: 'app-fcaichat',
  templateUrl: './fcaichat.component.html',
  styleUrls: ['./fcaichat.component.css']
})

export class FCAIChatComponent implements OnInit {
  @ViewChild('fileInput') fileInput: any;
  student: any;
  messages: any;
  profOrTA: any;
  message: any = '';
  messagesOfProfessorAndTA: any;
  messagesOfStudent: any;
  contacts: any;
  // contacts: {[key: string]: object} = {};
  professorsDetails: any;
  TADetails: any;
  StudentChat: any;
  isTA: boolean = false;
  isStudent: boolean = false;
  isProfessor: boolean = false;

  senderData: any;
  searchText = '';

  attachement: any;
  selectedFile: any;
  attachmentUrl: any;
  userTypeValue: any;


  constructor(private messageService: MessageService,
    private stdService: StudentsService,
    private _AuthService: AuthService,
    private router: Router,
    private profAndTa: ProfessorAndTaService,
    private ProfService: ProfessorTAService) { }


  ngOnInit() {

    this.getStudentDetails();
    this.profOrTA; // Replace with recipient ID
    this.student;
    // this.getProfessorDetails("Ayman");
    this.getAllContacts();

    /////////////////////
    const token = this._AuthService.getToken();

    this._AuthService.getType(token).subscribe((userType: any) => {
      if (userType && userType.length > 0) {
        this.userTypeValue = userType[0].Type;
        console.log("usertype", this.userTypeValue);

        if (this.userTypeValue === "Student") {
          this.stdService.getStudentInfo(token).subscribe((StudentData: any) => {
            if (StudentData && StudentData.length > 0) {
              this.getAllContacts();
              this.StudentChat = StudentData;
              //console.log('prof data',this.getSchedualeProf(ProfessorData[0].professorId));
            } else {
              console.error("Professor or ta data is empty or null");
            }
          });
        } else if (this.userTypeValue === "Professor") {
          this.profAndTa.getProfessorInfo(token).subscribe((ProfessorData: any) => {
            if (ProfessorData && ProfessorData.length > 0) {
              this.listTAsStudents();
              this.professorsDetails = ProfessorData;
            } else {
              console.error("Students data is empty or null");
            }
          });
        }
        else if (this.userTypeValue === "TA") {
          this.profAndTa.getTAInfo(token).subscribe((TAData: any) => {
            if (TAData && TAData.length > 0) {
              this.listProfessorsStudents();
              this.TADetails = TAData;
            } else {
              console.error("Students data is empty or null");
            }
          });
        }
        else {
          console.error("Unknown userType: " + this.userTypeValue);
        }
      } else {
        console.error("userType is empty or null");
      }
      console.log('students and tas', this.contacts);
    });


  }

  //enter as a student

  loadProfessorAndTAMessages() {
    //prof to TA or Stud
    if (this.userTypeValue === "Professor") {
      console.log('from prof to stud', this.professorsDetails[0].userID);

      if (this.StudentChat != null) {
        console.log(' stud', this.StudentChat.StudentDtails[0].userID);
        // console.log('ta',this.TADetails[0].userID);
        return this.messageService.getProfessorAndTAHistory(this.professorsDetails[0].userID, this.StudentChat.StudentDtails[0].userID);
      }
      else {
        console.log('ta', this.TADetails.TADtails[0].userID);
        return this.messageService.getProfessorAndTAHistory(this.professorsDetails[0].userID, this.TADetails.TADtails[0].userID);
      }
    }
    //TA to prof or Stud
    else if (this.userTypeValue === "TA") {
      console.log('ta',this.TADetails[0].userID);
      // console.log('from TA to stud');
      if (this.StudentChat != null) {
        console.log(' stud', this.StudentChat.StudentDtails[0].userID);
      
        return this.messageService.getProfessorAndTAHistory(this.TADetails[0].userID, this.StudentChat.StudentDtails[0].userID);
      }
      else {
        console.log('prof', this.professorsDetails.professorDtails[0].userID);
       
        return this.messageService.getProfessorAndTAHistory(this.TADetails[0].userID,this.professorsDetails.professorDtails[0].userID);
      }
     
    }
     //Stud to prof or TA
    else {
      console.log('from Stud to TA or prof');
      console.log('stud',this.StudentChat[0].userID);
      if (this.professorsDetails != null) {
        console.log('prof', this.professorsDetails.professorDtails[0].userID);
        return this.messageService.getProfessorAndTAHistory( this.StudentChat[0].userID,this.professorsDetails.professorDtails[0].userID);
      }
      else {
        console.log('ta',  this.TADetails.TADtails[0].userID);
        return this.messageService.getProfessorAndTAHistory(this.StudentChat[0].userID, this.TADetails.TADtails[0].userID);
      }
     
    }



  }

  loadStudentMessages() {
    //console.log()
    return this.messageService.getStudentHistory(this.profOrTA);
  }




  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];


    const inputElement = document.querySelector('input[name="message"]');
    if (inputElement instanceof HTMLInputElement) {
      inputElement.value = this.selectedFile.name;
    }


  }


  sendMessage() {
    const formData = new FormData();
    formData.append('from', this.student);
    formData.append('to', this.profOrTA);
    // formData.append('message', this.message);
    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile, this.selectedFile.name);
      formData.append('message', this.selectedFile.name);
    }
    else {
      formData.append('message', this.message);
    }

    this.messageService.sendMessage(formData).subscribe((response: any) => {
      this.loadProfessorAndTAMessages().subscribe((history) => {
        this.messagesOfProfessorAndTA = history;
      });
      // handle success

      this.selectedFile = null;
      this.message = '';
      const inputElement = document.querySelector('input[name="message"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }



    }, (error) => {
      // handle error
      console.log(error);
    });
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }


  getAllContacts() {
    this.messageService.getContacts().subscribe(
      response => {
        this.contacts = response;
        console.log(this.contacts);
      },
      error => {
        console.error('Error!', error);
      });
  }

  listProfessorsStudents() {
    this.messageService.listProfessorsStudents().subscribe(
      response => {
        this.contacts = response;
        console.log(this.contacts);
      },
      error => {
        console.error('Error!', error);
      });
  }

  listTAsStudents() {
    this.messageService.listTAsStudents().subscribe(
      response => {
        this.contacts = response;
        console.log(this.contacts);
      },
      error => {
        console.error('Error!', error);
      });
  }

  getProfessorDetails(professorName: any) {
    this.messageService.getProfessorDetails(professorName)
      .subscribe(
        response => {
          this.professorsDetails = response;
          console.log(this.professorsDetails.professorDtails[0].professorName);
          if (this.professorsDetails != null) {
            this.isProfessor = true;
            this.isTA = false;
            //this.isStudent=false;
            this.profOrTA = this.professorsDetails.professorDtails[0].userID;
            console.log(this.isProfessor);
            console.log(this.profOrTA);
            this.loadProfessorAndTAMessages().subscribe((history) => {
              this.messagesOfProfessorAndTA = history;
              console.log(this.messagesOfProfessorAndTA);
            });

            this.loadStudentMessages().subscribe((studentHistory) => {
              this.messagesOfStudent = studentHistory;
              this.messages = this.messagesOfStudent.messages;
              console.log('all array', this.messagesOfStudent);
              console.log('stdmsg', this.messagesOfStudent.messages[0].message);
            });


          }

        },
        error => {
          console.error('Error!', error);


        });
  }
  getTADetails(TAName: string) {
    this.messageService.getTADetails(TAName)
      .subscribe(
        response => {
          this.TADetails = response;
          console.log(this.TADetails.TADtails[0].TAName);
          if (this.TADetails != null) {
            this.isTA = true;
            this.isProfessor = false;
            //this.isStudent=false;
            this.profOrTA = this.TADetails.TADtails[0].userID;
            console.log(this.isTA);

            this.loadProfessorAndTAMessages().subscribe((history) => {
              this.messagesOfProfessorAndTA = history;
              console.log('iman to dina: ', this.messagesOfProfessorAndTA);
            });

            this.loadStudentMessages().subscribe((history) => {
              this.messagesOfStudent = history;
            });


          }

        },
        error => {
          console.error('Error!', error);


        });
  }

  getStudentDetails() {
    const token = this._AuthService.getToken();
    console.log(token);
    this.stdService.getStudentInfo(token).subscribe(
      response => {
        this.senderData = response;
        this.student = this.senderData[0].userID;
        console.log('std id', this.student);
        console.log('sender data', this.senderData);

      },
      error => {
        console.error(error, 'cant work');

      }
    );
  }

  getStudentChat(studentName: any) {
    this.messageService.getStudentsDetails(studentName)
      .subscribe(
        response => {
          this.StudentChat = response;
          console.log('fist', this.StudentChat.StudentDtails[0].studentName);
          if (this.StudentChat != null) {
            this.isStudent = true;
            this.isProfessor = false;
            // this.isTA=false;
            this.student = this.StudentChat.StudentDtails[0].userID;
            this.loadProfessorAndTAMessages().subscribe((history) => {
              this.messagesOfProfessorAndTA = history;
              console.log('iman to ahmed msg1 ', this.messagesOfProfessorAndTA);
            });

            this.loadStudentMessages().subscribe((history) => {
              this.messagesOfStudent = history;
              console.log('iman to ahmed msg2 ', this.messagesOfStudent);
            });
          }

          console.log(this.isStudent);
        },
        error => {
          console.error('Error!', error);
        });
    console.log(this.isStudent);
    console.log("cahhhhhhhhhhhhh", this.StudentChat);
    console.log("heloo");

  }



  openImagePopup(url: string) {
    window.open(url, 'Image', 'width=800,height=600');
  }
  isImage(file: string): boolean {
    return file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif');
  }


}
