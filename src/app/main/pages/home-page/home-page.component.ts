import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  isAdminCheck: boolean = false;
  isClientCheck: boolean = false;

  constructor(private authService: AuthService, private userService: UserService){}

  ngOnInit(): void {

    this.checkClientStatus();


  }

  getUsers(){
    this.authService.getCurrentUserId().subscribe(userId => {
      if (userId !== 0) {
        console.log(userId);
      } else {
        console.error('No se pudo obtener el user ID');
      }
    }, error => {
      console.error(error);
    });

  }

  checkClientStatus(): void {
    this.authService.isClientLoggedIn().subscribe(
      isClient => {
        this.isClientCheck = isClient;
      },
      error => console.error('Error checking client status', error)
    );
  }

  checkAdminStatus(): void {
    this.authService.isAdminLoggedIn().subscribe(
      isAdmin => {
        this.isAdminCheck = isAdmin;
      },
      error => console.error('Error checking admin status', error)
    );
  }

}
