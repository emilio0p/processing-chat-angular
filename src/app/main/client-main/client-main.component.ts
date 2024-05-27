import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-client-main',
  templateUrl: './client-main.component.html',
  styleUrl: './client-main.component.css'
})
export class ClientMainComponent {



  constructor(private authService: AuthService){}

  userID = this.authService.getCurrentUserId()

}
