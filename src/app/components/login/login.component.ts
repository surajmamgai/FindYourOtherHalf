import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ServiceService } from 'src/app/service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private Cook: CookieService, private service: ServiceService, private router: Router) {
  }
  username: string
  password: string

  submit_form() {
    let url = 'https://fyoh-backend.onrender.com/login/';

    this.http.post(url, { username: this.username, password: this.password }).subscribe({
      next: (response: any) => {
        this.Cook.set('token', response.token)
        this.service.is_login = true
        this.set_logged_in_user()
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  set_logged_in_user() {
    const set_logged_in_user_url = 'https://fyoh-backend.onrender.com/logged-in-user/';
    this.http.post(set_logged_in_user_url, {}, { withCredentials: true }).subscribe({
      next: (response: any) => {
        console.log(response);
        // this.Cook.set('user', JSON.stringify(response));
        const user_basic = {
          username : response.username,
          gender : response.gender
        }
        document.cookie = 'user=' + JSON.stringify(user_basic) + '; path=/';
        this.router.navigateByUrl('/search_profiles');
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

}
