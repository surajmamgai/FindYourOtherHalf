import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  is_login: boolean;

  constructor(private http: HttpClient, private Cook: CookieService) {
    if (this.Cook.check("token")) {
      this.is_login = true;
    } else {
      this.is_login = false;
    }
  }
  }
