import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceService } from 'src/app/service.service';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isLoading : boolean = true
  user: any
  profile: any
  editable : boolean
  is_login:boolean
  name: string
  education: string
  occupation: string
  height: number
  photo: any
  location: string
  message : ""
  constructor(private route: ActivatedRoute, private http: HttpClient, private service: ServiceService, private router: Router, private Cook: CookieService)
  {
    this.is_login = this.service.is_login
  }
  
  ngOnInit() {
    setTimeout(() =>{
      this.show_profile()
    },100);
    setTimeout(() => {
      this.isLoading = false;
      
    }, 1500);
  }

  show_profile(){
    this.editable = false
    let url = 'https://fyoh-backend.onrender.com/view-profile/';
    console.log(this.user)
    this.http.post(url, { viewer_username: this.user.username, profile_username: this.route.snapshot.paramMap.get("username") }, { withCredentials: true }).subscribe({
      next: (response: any) => {
          this.profile = response.data;
      },
      error: (error: any) => {
        this.service.is_login = false;
        console.log(error);
      }
    });
  }


  send_interest(user: any){
    let url = 'https://fyoh-backend.onrender.com/send-request/'; 
    this.http.post(url, {sender_username : this.user.username, receiver_username: user.username, status: 0}, { withCredentials: true }).subscribe({
      next: (response: any) => {
        console.log(response)
      },
      error: (error: any) => {
        this.service.is_login = false;
        console.log(error)
      }
    })
  }

  make_editable(){
    this.editable = true;
  }

  readUrl(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
  
      reader.onload = (event: any) => {
        this.photo = event.target.result;
      }
  
      reader.readAsDataURL(event.target.files[0]);
    }
}

update_profile() {
    let url = 'https://fyoh-backend.onrender.com/update-user/';
    
    this.http.post(url, {username: this.user.username, name: this.name, education:this.education, occupation:this.occupation, height:this.height, location: this.location, photo:this.photo }).subscribe({
      next: (response: any) => {
        console.log(response)
        this.message = response.message
        this.editable = false
        this.show_profile()
      },
      error: (error: any) => {
        console.log(error)
        this.message = error.message
      }
    })
    console.log(this.name, this.education, this.occupation, this.location, this.height, this.photo);
  }


  setDefaultImage(){
    if(this.profile.gender == "female")
      this.profile.photo = "https://wfmcstudios.org/wp-content/uploads/2020/06/female-placeholder.png";
    else
      this.profile.photo = "https://www.therhlawfirm.com/wp-content/uploads/2021/05/male-placeholder.jpg";
  }
  go_back(){
    this.router.navigateByUrl('/search_profiles')
  }

  ngDoCheck(){
    this.is_login = this.service.is_login
    const storedUser = this.Cook.get('user'); 
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          this.user = parsedUser;
        }
      } catch (e) {
        console.log('Error parsing stored user:', e);
      }
    }
    }

  
}
