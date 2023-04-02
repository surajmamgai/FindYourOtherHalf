import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private http: HttpClient, private router: Router) {
  }
  username: string
  name: string
  education: string
  occupation: string
  password: string
  gender: boolean
  dob: any
  height: number
  photo: File
  photo_url: any
  age:number
  message= ""

  readUrl(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
  
      reader.onload = (event: any) => {
        this.photo = event.target.result;
      }
  
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  

  calculateAge() {
    var now = new Date();
    var birthdate = new Date(this.dob);
    var age = now.getFullYear() - birthdate.getFullYear();
    var m = now.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
  }

  submit_form() {
    console.log(this.username, this.name, this.education, this.occupation, this.password, this.gender, this.dob, this.height, this.photo);
    this.age = this.calculateAge()
    let url = 'https://fyoh-backend.onrender.com/add-user/';

    this.http.post(url, { username: this.username, name: this.name, gender:this.gender, dob:this.dob, education:this.education, occupation:this.occupation, height:this.height, age: this.age, password: this.password ,photo:this.photo }).subscribe({
      next: (response: any) => {
        console.log(response)
        this.message = response.message
        this.router.navigateByUrl('/login')
      },
      error: (error: any) => {
        console.log(error)
        this.message = error.message
      }
    })
  }
}
