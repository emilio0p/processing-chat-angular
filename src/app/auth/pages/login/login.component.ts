import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Importa el servicio de API (si lo utilizas)
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: string = '';
  password: string = '';
  token: string = '';
  tokenType: string = '';

  constructor(private http: HttpClient, // Inyecta el servicio HttpClient
              // Inyecta el servicio de API (si lo utilizas)
              private authService: AuthService, private router: Router) { }

  ngOnInit() { }

  login() {

    this.authService.login(this.user, this.password);
    this.router.navigateByUrl('/main/home');

  }
}
