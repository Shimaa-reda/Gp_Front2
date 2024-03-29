import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from '../students.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-student-group-selection',
  templateUrl: './student-group-selection.component.html',
  styleUrls: ['./student-group-selection.component.css']
})
export class StudentGroupSelectionComponent {
 
  apiUrlGroup = "http://127.0.0.1:8000/api/getCourseGroup/";
  apiUrlCourse ="http://127.0.0.1:8000/api/getCourseInfo/";
  selectedCoursesIds: any;
 
  apiResponseArrayGroup:any = [];
  apiResponseArrayCourse:any = [];
  lenOfCourses :any;
  CoursesArray: any[] =[]
  GroupsArray: any[] =[]
  courseDataArray: any[] = [];
  StudentData:any
  noConfilect:any={};
  flag:any=false;
  taData: any;
  // count:any=0;

 
  constructor(private router: Router,private route: ActivatedRoute,private studendService: StudentsService ,private http: HttpClient,private _AuthService:AuthService) {
  
  }

  ngOnInit() {
    const token=this._AuthService.getToken();
    this.studendService.getStudentInfo(token).subscribe({
      next:(response)=> this.StudentData=response
      
    });
   
    this.route.queryParams.subscribe(params => {
     
    this.selectedCoursesIds={...params};
    const keysArray= Object.keys(this.selectedCoursesIds);
    const lengthOfObj = keysArray.length;
    this.lenOfCourses=lengthOfObj
   
    this.CoursesArray.length=this.lenOfCourses
    let observables1 = [];
    let observables2 = [];
    for (let key in this.selectedCoursesIds) {
      let urlGrp = this.apiUrlGroup+this.selectedCoursesIds[key];
      observables1.push(this.http.get(urlGrp));
     
    }
    forkJoin(observables1).subscribe((responses) => {
      this.apiResponseArrayGroup = responses;
      console.log("this.apiResponseArray1",this.apiResponseArrayGroup) //groups
    });
    for (let key in this.selectedCoursesIds) {
      let urlCourse = this.apiUrlCourse+this.selectedCoursesIds[key];
      observables2.push(this.http.get(urlCourse));
    }
    forkJoin(observables2).subscribe((responses) => {
      this.apiResponseArrayCourse = responses;
      console.log("this.apiResponseArray2",this.apiResponseArrayCourse) //courses
    });
     
    }
   
  );
   console.log("*****");
      // console.log("id===",this.studentID)
}
// function to save the selected group and corresponding course data to the array of objects
saveSelectedGroup(courseData: any, selectedGroup: any, id: any) {
  // find the object in the array with the matching course code
  const courseObjIndex = this.courseDataArray.findIndex(obj => obj.courseID == courseData.courseID);


  // if the object already exists, update the selected group
  if (courseObjIndex !== -1) {
    this.courseDataArray[courseObjIndex].selectedGroup = selectedGroup;
  }
  // otherwise, add a new object to the array with the course data and selected group
  else {
    this.studendService.getTAId(selectedGroup,courseData.courseID).subscribe({
      next:(response)=>{
        const today = new Date();
       
        this.taData=response
        this.courseDataArray.push({
          courseID: courseData.courseID,
          endTimeCourse1: courseData.startTime1,
          startTimeCourse1: courseData.startTime1,
          slotDayCourse1: courseData.slotday1,
          endTimeCourse2: courseData.startTime2,
          startTimeCourse2: courseData.startTime2,
          slotDayCourse2: courseData.slotday2,
          selectedGroup: selectedGroup,
          grade:null,
          creditHours:courseData.creditHours,
          type:courseData.type,
          studentId:id,
          professor1:courseData.professor1,
          professor2:courseData.professor2,
          TAId:this.taData[0].TAId,
          Year: today.getFullYear(),
        });

      }
    });
   
   
  }
}


saveData() {
  let url = 'http://127.0.0.1:8000/api/registerCourses';
   let options = { headers: { 'Content-Type': 'application/json' } };
  this.http.post(url, this.courseDataArray,options).subscribe(
    (response) =>{this.noConfilect=response
      console.log(response)
      if(this.noConfilect.message){
        this.router.navigate(['/registerdCoursesAndResults']);
      }
     
    }
   ,
    (error) => console.error("error",error),
    
   
  );
  
  this.flag=true
 
 
}
// groupCount(groupCount:any)
// {
//   this.count=groupCount-1;
//   console.log(this.count);
// }
navigateToRegisterCourse()
{
  this.router.navigate(['register_course']);
}
navigateToregisterdCoursesAndResults(){
  this.router.navigate(['registerdCoursesAndResults']);
}
navigateToHome(){
  this.router.navigate(['home_login']); 
}
 
}
