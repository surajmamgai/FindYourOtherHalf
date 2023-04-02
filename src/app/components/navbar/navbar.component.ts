import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import swal from 'sweetalert2'
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  is_login:boolean
  username : string
  constructor(private Cook: CookieService, private service: ServiceService, private router: Router){
  }
  logout(){
    this.service.is_login=false;
    this.Cook.deleteAll()
    swal.fire('Logged Out Successfully !')
    this.router.navigateByUrl('/login')
  }
  ngDoCheck(){
    this.is_login = this.service.is_login
    if(this.Cook.check("token")){
      const storedUser = this.Cook.get('user'); 
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser) {
            this.username = parsedUser.username;
          }
        } catch (e) {
          console.log('Error parsing stored user:', e);
        }
      }
    }
    }
  }
