import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{
  // Variables para controlar si el usuario iniciado es administrador o cliente
  isAdminCheck: boolean = false;
  isClientCheck: boolean = false;

  // Inyectamos los servicios necesaros
  constructor(private authService: AuthService){}

  // Al iniciar el componente comprobar de que tipo de usuario se trata
  ngOnInit(): void {

    this.checkClientStatus();
    this.checkAdminStatus();

  }

  // Método actualizar tipo de usuario (cliente)
  checkClientStatus(): void {
    this.authService.isClientLoggedIn().subscribe(
      isClient => {
        this.isClientCheck = isClient;
      },
      error => console.error('Error checking client status', error)
    );
  }

  // Método actualizar tipo de usuario (admin)
  checkAdminStatus(): void {
    this.authService.isAdminLoggedIn().subscribe(
      isAdmin => {
        this.isAdminCheck = isAdmin;
      },
      error => console.error('Error checking admin status', error)
    );
  }

}
