import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceService } from 'src/app/service.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-search-profiles',
  templateUrl: './search-profiles.component.html',
  styleUrls: ['./search-profiles.component.css']
})
export class SearchProfilesComponent {
  isLoading : boolean = true
  items: any
  is_login:boolean
  user:any
  gender : any
  available_education = ["B. Tech", "B. Com", "BBA", "B. Sc"]
  available_occupation = ["Engineer", "Accountant", "Dancer", "Actor", "CA", "Software Engineer", "Data Analyst", "HR"]
  payload : {}
  age: number = 0;
  height : number = 0;
  age_filter_type: string = ""
  height_filter_type: string = ""
  education: Record<string, boolean> = {};
  occupation: Record<string, boolean> = {};
 
  constructor(private http: HttpClient, private Cook: CookieService, private service: ServiceService, private router: Router) {
    this.available_education.forEach(ed => {
      this.education[ed] = false;
    });
    this.available_occupation.forEach(oc => {
      this.occupation[oc] = false;
    });
    this.is_login = this.service.is_login
  }

  ngOnInit() {
    setTimeout(() =>{
      this.user_show()
    },100);
    setTimeout(() => {
      this.isLoading = false;
    }, 1000); // Example timeout of 2 seconds
  }

  user_show(){
            const education_array = Object.keys(this.education).filter(ed => this.education[ed]);
            const occupation_array = Object.keys(this.occupation).filter(oc => this.occupation[oc]);
            console.log(this.user)
            this.payload = {
                viewer_username: this.user.username,
                gender: this.user.gender ? this.user.gender : undefined,
                age: this.age ? this.age : undefined,
                age_filter_type: this.age_filter_type ? this.age_filter_type : undefined,
                height: this.height ? this.height : undefined,
                height_filter_type: this.height_filter_type ? this.height_filter_type : undefined,
                education: education_array.length? education_array : undefined,
                occupation: occupation_array.length? occupation_array : undefined
              };
            let url = 'https://fyoh-backend.onrender.com/user-show/';
            this.http.post(url, this.payload, { withCredentials: true }).subscribe({
              next: (response: any) => {
                this.items = response.data
              },
              error: (error: any) => {
                this.service.is_login = false;
                console.log(error)
                this.items = []
              }
            })
        }
  
  send_interest(user: any){
    let url = 'https://fyoh-backend.onrender.com/send-request/'; 
    const currentTime = new Date();
    this.http.post(url, {sender_username : this.user.username, receiver_username: user.username, status: 0, timestamp: currentTime.toISOString()
    }, { withCredentials: true }).subscribe({
      next: (response: any) => {
        window.setTimeout(()=>{
        this.user_show()
      },100)
      },
      error: (error: any) => {
        this.service.is_login = false;
        console.log(error)
      }
    })
  }

  view_profile(user: any) {
        this.router.navigate(['/profile/' + user.username]);
  }
    
  setDefaultImage(item: any){
    if(item.gender == "female")
      item.photo = "https://wfmcstudios.org/wp-content/uploads/2020/06/female-placeholder.png";
    else
      item.photo = "https://www.therhlawfirm.com/wp-content/uploads/2021/05/male-placeholder.jpg";
  }

  ngDoCheck(){
    this.is_login = this.service.is_login
    const storedUser = this.Cook.get('user');
    console.log(storedUser)
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


//////////////////////////////////////////////////
//Age Filter
 
onAgeChange(event: any) {
    const target = event.target as HTMLInputElement;
    this.age = parseInt(target.value);
  }

set_age_filter_type(type: string){
  this.age_filter_type = type;
}

//////////////////////////////////////////////////
//Height Filter

onHeightChange(event: any) {
  const target = event.target as HTMLInputElement;
  this.height = parseInt(target.value);
}

set_height_filter_type(type: string){
this.height_filter_type = type;
console.log(this.height_filter_type)
}


}


